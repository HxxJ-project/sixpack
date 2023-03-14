import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Busienssusers } from 'src/global/entities/Busienssusers';
import { Gym } from 'src/global/entities/Gym';
import { GymImg } from 'src/global/entities/GymImg';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { JwtPayload } from '../auth/types/jwtPayload.type';
import * as bcrypt from 'bcrypt';
import { isApprove } from 'src/global/entities/common/gym.isApprove';

@Injectable()
export class GymService {
  constructor(
    @InjectRepository(Gym) private gymsrepository: Repository<Gym>,
    @InjectRepository(Busienssusers) private businessUserrepository: Repository<Busienssusers>,
    @InjectRepository(GymImg) private gymImgrepository: Repository<GymImg>,
    private dataSource: DataSource
  ) {}

  /**
   * 체육관 생성
   * @author 정호준
   * @param PostGymDto
   */
  async postGyms({ file, postgymDto, user }) {
    const existGym = await this.gymsrepository.findOne({
      where: { name: postgymDto.name },
    });
    if (existGym) throw new ConflictException('이미 등록된 체육관입니다.');
    if (!file.certification && !file.img) throw new BadRequestException('파일을 등록해야 합니다.');

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createGym = await this.gymsrepository.save({
        businessId: user.sub,
        name: postgymDto.name,
        phone: postgymDto.phone,
        lat: postgymDto.lat,
        lng: postgymDto.lng,
        address: postgymDto.address,
        gymType: postgymDto.gymType,
        description: postgymDto.description,
        certification: file.certification[0].location,
      });
      const gymImgs = [];
      for (let i = 0; i < file.img.length; i++) {
        gymImgs.push({ gymId: createGym.id, img: file.img[i].location });
      }

      const createImg = await this.gymImgrepository.save(gymImgs);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 로그인 사업자 체육관 조회
   * @author 정호준
   */
  async getGyms(user: JwtPayload) {
    return await this.gymsrepository.find({
      where: { businessId: user.sub, deletedAt: null },
      relations: ['gymImgs'],
    });
  }

  /**
   * 특정 체육관 조회
   * @author 정호준
   */
  async getGymsById(gymId: number) {
    // return await this.gymsrepository
    //   .createQueryBuilder('gym')
    //   .leftJoinAndSelect('gym.gymImgs', 'gymImg')
    //   .select(['gym', 'gymImg.img'])
    //   .where('gym.id = :id', { id: gymId })
    //   .getOne();
    // return await this.gymsrepository.findOne({
    //   where: { id: gymId, deletedAt: null },
    // });
    const gym = await this.gymsrepository
      .createQueryBuilder('gym')
      .leftJoinAndSelect('gym.gymImgs', 'gymImg')
      .select(['gym', 'gymImg.img'])
      .where('gym.id = :id', { id: gymId })
      .getOne();
    return gym;
  }

  /**
   * 체육관 정보 수정
   * @author 정호준
   * @param UpdateGymDto
   */
  async updateGym({ file, gymId, updateDto, user }) {
    await this.checkUser(gymId, user);
    // await this.checkPassword(updateDto.password, user);
    const findGymsImage = await this.gymImgrepository.findOne({
      where: { gymId: gymId },
    });
    const existGym = await this.gymsrepository.findOne({
      where: { id: gymId },
    });
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.gymsrepository.update(gymId, {
        name: updateDto.name ? updateDto.name : existGym.name,
        phone: updateDto.phone ? updateDto.phone : existGym.phone,
        gymType: updateDto.gymType ? updateDto.gymType : existGym.gymType,
        description: updateDto.description ? updateDto.description : existGym.description,
        certification: file.certification ? file.certification[0].location : existGym.certification,
      });
      await this.gymImgrepository.update(findGymsImage.id, {
        img: file.img ? file.img[0].location : findGymsImage.img,
      });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 체육관 정보 삭제
   * @author 정호준
   */
  async deleteGym({ gymId, user }) {
    await this.checkUser(gymId, user);
    // await this.checkPassword(password.password, user);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.gymsrepository.softDelete(gymId);
      await this.gymImgrepository.softDelete({ gymId: gymId });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 전체 체육관 조회
   * @author 정호준
   */

  async getAllGym() {
    return await this.gymsrepository
      .createQueryBuilder('gym')
      .leftJoinAndSelect('gym.gymImgs', 'gymImg')
      .select(['gym', 'gymImg.img'])
      .getMany();

    // return await this.gymsrepository.find({
    //   where: { deletedAt: null },
    //   relations: ['gymImgs'],
    // });
  }

  /**
   * 앞글자로 체육관 찾기
   * @author 정호준
   */
  async searchGymByText(text) {
    return await this.gymsrepository
      .createQueryBuilder('gym')
      .leftJoinAndSelect('gym.gymImgs', 'gymImg')
      .select(['gym.id', 'gym.name', 'gym.address', 'gymImg.img'])
      .where('gym.name LIKE :name', { name: `${text}%` })
      .getMany();
  }
  /**
   * 승인된 체육관만 가져오기
   * @author 정호준
   */
  async approveGymGeto() {
    return await this.gymsrepository
      .createQueryBuilder('gym')
      .leftJoinAndSelect('gym.gymImgs', 'gymImg')
      .select(['gym', 'gymImg.img'])
      .where('gym.isApprove = :isApprove', { isApprove: 1 })
      .andWhere('gym.deletedAt IS NULL')
      .getMany();
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
