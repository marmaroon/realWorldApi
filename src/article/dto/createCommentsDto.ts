import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class CommentDto {
  @IsString()
  readonly body: string;
}

export class CreateCommentsDto {
  @Type(() => CommentDto)
  @IsNotEmpty()
  @ValidateNested()
  readonly comment: CommentDto;
}
