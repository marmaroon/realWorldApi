import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isOptional = this.reflector.get<boolean>(
      'optional',
      context.getHandler(),
    );
    if (isOptional) {
      try {
        const canActivate = await super.canActivate(context);
        return canActivate as boolean;
      } catch (e) {
        return true;
      }
    } else {
      const canActivate = await super.canActivate(context);
      return canActivate as boolean;
    }
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    return user;
  }
}
