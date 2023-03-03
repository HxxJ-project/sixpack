import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Busienssusers } from 'src/global/entities/Busienssusers';
import { Gym } from 'src/global/entities/Gym';
import { GymImg } from 'src/global/entities/GymImg';
import { Repository } from 'typeorm';
import { JwtPayload } from '../auth/types/jwtPayload.type';
import { PostGymDto } from './dto/postGym.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class GymService {
  constructor(
    @InjectRepository(Gym) private gymsrepository: Repository<Gym>,
    @InjectRepository(Busienssusers) private businessUserrepository: Repository<Busienssusers>,
    @InjectRepository(GymImg) private gymImgrepository: Repository<GymImg>
  ) {}

  /**
   * 체육관 생성
   * @author 정호준
   * @param PostGymDto
   */
  async postGyms(file: Express.MulterS3.File, postgymDto: PostGymDto, user: JwtPayload) {
    const existGym = await this.gymsrepository.findOne({
      where: { name: postgymDto.name, address: postgymDto.address },
    });
    if (existGym) throw new ConflictException('이미 등록된 체육관입니다.');
    if (!file) throw new BadRequestException('파일을 등록해야 합니다.');

    return await this.gymsrepository.save({
      businessId: user.sub,
      name: postgymDto.name,
      phone: postgymDto.phone,
      address: postgymDto.address,
      description: postgymDto.description,
      certification: file.location,
    });
  }
  /**
   * 로그인 사업자 체육관 조회
   * @author 정호준
   */
  async getGyms(user: JwtPayload) {
    return await this.gymsrepository.find({
      where: { businessId: user.sub, deletedAt: null },
      select: ['name', 'address'],
    });
  }

  /**
   * 특정 체육관 조회
   * @author 정호준
   */
  async getGymsById(gymId: number) {
    return await this.gymsrepository.findOne({
      where: { id: gymId, deletedAt: null },
    });
  }

  /**
   * 체육관 정보 수정
   * @author 정호준
   * @param UpdateGymDto
   */
  async updateGym({ gymId, updateDto, user }) {
    // console.log('서비스22', password);

    await this.checkUser(gymId, user);
    await this.checkPassword(updateDto.password, user);
    const updategym = await this.gymsrepository.update(gymId, {
      name: updateDto.name,
      phone: updateDto.phone,
      address: updateDto.address,
      description: updateDto.description,
    });
    return updategym;
  }

  /**
   * 체육관 정보 삭제
   * @author 정호준
   * @param UpdateGymDto
   */
  async deleteGym({ gymId, password, user }) {
    await this.checkUser(gymId, user);
    await this.checkPassword(password.password, user);
    const deletegym = await this.gymsrepository.softDelete(gymId);
    return deletegym;
  }

  /**
   * 유저 확인
   * @author 정호준
   */
  private async checkUser(gymId, user) {
    const gym = await this.getGymsById(gymId);

    if (user.sub !== gym.businessId) throw new UnauthorizedException('글쓴이가 아닙니다.');
  }

  /**
   * 비밀번호 확인
   * @author 정호준
   */
  private async checkPassword(password, user) {
    const findUser = await this.businessUserrepository.findOne({
      where: { id: user.sub },
    });
    const pwMatch = await bcrypt.compare(password, findUser.password);

    if (!pwMatch) throw new ConflictException('비밀번호가 일치하지 않습니다.');
  }
}
