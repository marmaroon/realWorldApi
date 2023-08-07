import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import { UserService } from './user.service';
import { User } from './decorators/user.decorator';
import { AuthGuard } from './guards/auth.guard';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserEntity } from './user.entity';
import { BackendValidationPipe } from '@app/shared/backendValidation.pipe';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  private buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        email: user.email,
        token: this.userService.generateJwt(user),
        username: user.username,
        bio: user.bio,
        image: user.image || null,
      },
    };
  }

  @Post('users')
  @UsePipes(new BackendValidationPipe())
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new BackendValidationPipe())
  @HttpCode(200)
  async login(@Body() loginDto: LoginUserDto): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginDto);
    return this.buildUserResponse(user);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
    return this.buildUserResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @User('id') currentUserId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(
      currentUserId,
      updateUserDto,
    );
    return this.buildUserResponse(user);
  }
}
