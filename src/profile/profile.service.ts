// profile.service.ts
import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowEntity } from './types/follow.entity';
import { ProfileType } from './types/profile.type';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async getProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      username: profileUsername,
    });

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    const following = await this.followRepository.findOne({
      followerId: currentUserId,
      followingId: user.id,
    });

    const profile: ProfileType = {
      username: user.username,
      bio: user.bio,
      image: user.image,
      following: !!following,
    };

    return profile;
  }

  async followProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      username: profileUsername,
    });

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    //проверяем, следит ли текущий пользователь уже за профилем
    const isAlreadyFollowing = await this.checkFollowingStatus(
      currentUserId,
      user.id,
    );

    if (isAlreadyFollowing) {
      throw new HttpException(
        `You are already following this`,
        HttpStatus.BAD_REQUEST,
      );
    }

    //проверяем, не пытается ли пользователь подписаться на себя
    if (currentUserId === user.id) {
      throw new HttpException(
        `You can't follow yourself`,
        HttpStatus.BAD_REQUEST,
      );
    }

    //создаем или обновляем отношение "подписка"
    const follow = new FollowEntity();
    follow.followerId = currentUserId;
    follow.followingId = user.id;
    await this.followRepository.save(follow);

    const profile: ProfileType = {
      username: user.username,
      bio: user.bio,
      image: user.image,
      following: true,
    };

    return profile;
  }
  //отдельный метод для проверки статуса
  //ищем запись, где followerId (тот, кто подписывается) равен currentUserId,
  //а followingId (тот, на кого подписываются) равен profileUserI
  private async checkFollowingStatus(
    currentUserId: number,
    profileUserId: number,
  ): Promise<boolean> {
    const follow = await this.followRepository.findOne({
      followerId: currentUserId,
      followingId: profileUserId,
    });
    //если follow не null и не undefined (т. е. запись найдена), !!follow будет true
    //если follow равно null или undefined (т. е. запись не найдена), !!follow будет false.
    return !!follow;
  }

  async unfollowProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      username: profileUsername,
    });

    if (!user) {
      throw new HttpException('Профиль не существует', HttpStatus.NOT_FOUND);
    }

    //проверяем, не пытается ли пользователь подписаться на себя
    if (currentUserId === user.id) {
      throw new HttpException(
        `You can't unfollow yourself`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.followRepository.delete({
      followerId: currentUserId,
      followingId: user.id,
    });

    const profile: ProfileType = {
      username: user.username,
      bio: user.bio,
      image: user.image,
      following: false,
    };

    return profile;
  }
}
