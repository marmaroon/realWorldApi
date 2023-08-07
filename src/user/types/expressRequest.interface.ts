import { Request } from 'express';
import { UserEntity } from '../user.entity';

//расширяем реквест
export interface ExpressRequest extends Request {
  user?: UserEntity;
}
