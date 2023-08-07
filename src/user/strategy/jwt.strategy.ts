import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from '../user.service';
import { JWT_SECRET } from '@app/config';
import { JwtPayload } from '../types/jwtPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const { id } = payload;
    try {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new UnauthorizedException('User not found in the database');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid user ID in JWT token');
    }
  }
}
