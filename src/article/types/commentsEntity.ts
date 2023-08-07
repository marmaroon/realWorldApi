import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity({ name: 'comments' })
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
