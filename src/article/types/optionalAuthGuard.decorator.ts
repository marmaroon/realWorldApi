import { SetMetadata } from '@nestjs/common';

export const OptionalAuth = () => SetMetadata('optional', true);
