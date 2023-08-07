import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagController } from './tag.controller';
import { TagEntity } from './tag.entity';
import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])], //forFeature - каждый модуль как фича
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
