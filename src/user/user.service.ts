import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { hash, compare } from 'bcrypt';
import { LoginUserDto } from './dto/loginUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {},
    };
    const userByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.user.email },
    });

    const userByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.user.username },
    });

    if (userByEmail) {
      errorResponse.errors['email'] = 'has already been taken';
    }
    if (userByUsername) {
      errorResponse.errors['username'] = 'has already been taken';
    }
    if (userByEmail || userByUsername) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const hashedPassword = await hash(createUserDto.user.password, 10);
    const newUser = this.userRepository.create({
      ...createUserDto.user,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(newUser);
    return savedUser;
  }

  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        image: user.image,
      },
      JWT_SECRET,
    );
  }

  async login(loginDto: LoginUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {
        'email or password': 'is invalid',
      },
    };
    const user = await this.userRepository.findOne({
      where: { email: loginDto.user.email },
      select: ['id', 'email', 'username', 'bio', 'image', 'password'],
    });

    if (!user) {
      throw new HttpException(errorResponse, HttpStatus.FORBIDDEN);
    }

    const isCorrectPassword = await compare(
      loginDto.user.password,
      user.password,
    );

    if (!isCorrectPassword) {
      throw new HttpException(errorResponse, HttpStatus.FORBIDDEN);
    }

    return user;
  }

  async getUser(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findById(userId);
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }
}
