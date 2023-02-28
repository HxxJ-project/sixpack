import { PostBusinessUserDto } from './dto/postBusinessUser.dto';
import {
  BadRequestException,
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/global/entities/Users';
import { Repository } from 'typeorm';
import { PostUserDto } from './dto/postUser.dto';
import * as bcrypt from 'bcrypt';
import { Busienssusers } from 'src/global/entities/Busienssusers';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtPayload } from './types/jwtPayload.type';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private userRepo: Repository<Users>,
    @InjectRepository(Busienssusers) private businessUserRepo: Repository<Busienssusers>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService
  ) {}

  /**
   * 일반유저 회원가입
   * @author 김승일
   * @param postuserDto
   */
  async postUsers(postuserDto: PostUserDto) {
    const existUser = await this.userRepo.findOne({
      where: { email: postuserDto.email },
    });
    if (existUser) throw new ConflictException('이미 존재하는 이메일입니다.');
    if (postuserDto.password !== postuserDto.passwordCheck) throw new ConflictException('비밀번호가 일치하지 않습니다.');
    const hashedPassword = await bcrypt.hash(postuserDto.password, 10);
    return await this.userRepo.save({
      email: postuserDto.email,
      password: hashedPassword,
      nickname: postuserDto.nickname,
      phone: postuserDto.phone,
    });
  }

  /**
   * 사업자 회원가입
   * @author 김승일
   * @param postBusinessUserDto
   */
  async postBusinessUsers(postBusinessUserDto: PostBusinessUserDto) {
    const existUser = await this.businessUserRepo.findOne({
      where: { email: postBusinessUserDto.email },
    });
    if (existUser) throw new ConflictException('이미 존재하는 이메일입니다.');
    if (postBusinessUserDto.password !== postBusinessUserDto.passwordCheck)
      throw new ConflictException('비밀번호가 일치하지 않습니다.');
    const hashedPassword = await bcrypt.hash(postBusinessUserDto.password, 10);
    return await this.businessUserRepo.save({
      email: postBusinessUserDto.email,
      password: hashedPassword,
      name: postBusinessUserDto.name,
      phone: postBusinessUserDto.phone,
    });
  }

  /**
   * 일반유저 로그인
   * @author 김승일
   * @param loginUserDto
   */
  async userlogin(loginUserDto: LoginUserDto) {
    const existUser = await this.userRepo.findOne({ where: { email: loginUserDto.email } });
    if (!existUser) throw new NotFoundException('이메일이 존재하지 않습니다.');
    const isMatch = await bcrypt.compare(loginUserDto.password, existUser.password);
    if (!isMatch) throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    const tokens = await this.getTokens(existUser.id, existUser.email);
    return tokens;
  }

  /**
   * access token, refresh token 발급
   * @author 김승일
   * @param userId
   * @param email
   */
  async getTokens(userId: number, email: string) {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email,
    };

    const [AccessToken, RefreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
      }),
    ]);
    // RefreshToken 암호화 후 캐시에 저장
    const hashRefreshToken = bcrypt.hashSync(RefreshToken, 10);
    await this.cacheManager.set(`${userId}-refresh`, hashRefreshToken, {
      ttl: 60 * 60 * 24 * 7, // 7일
    });
    return { AccessToken, RefreshToken };
  }

  /**
   * 토큰 재발급
   * @author 김승일
   * @param userId
   * @param rt
   */
  async restoreRefreshToken(userId: number, rt: string) {
    const existUser = await this.userRepo.findOne({
      where: { id: userId },
    });
    if (!existUser) throw new NotFoundException('유저가 존재하지 않습니다.');
    const existRt: string = await this.cacheManager.get(`${userId}-refresh`);
    const rtMatch = await bcrypt.compare(rt, existRt);
    if (!rtMatch) throw new UnauthorizedException('RefreshToken이 일치하지 않습니다.');

    const tokens = await this.getTokens(existUser.id, existUser.email);
    return tokens;
  }
}
