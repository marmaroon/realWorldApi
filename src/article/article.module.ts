import { FollowEntity } from '@app/profile/types/follow.entity';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserEntity } from '@app/user/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { ArticleEntity } from './article.entity';
import { ArticleService } from './article.service';
import { OptionalAuthGuard } from './guards/optionalGuard';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, UserEntity, FollowEntity]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService, AuthGuard, OptionalAuthGuard],
  exports: [ArticleService, TypeOrmModule],
})
export class ArticleModule {}
