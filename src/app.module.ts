import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './ormconfig';
import { UserModule } from './user/user.module';
import { ArticleController } from './article/article.controller';
import { ArticleModule } from './article/article.module';
import { PassportModule } from '@nestjs/passport';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TagModule,
    UserModule,
    ArticleModule,
    ProfileModule,
  ],
  controllers: [AppController, ArticleController],
  providers: [AppService],
})
export class AppModule {}
