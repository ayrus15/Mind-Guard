import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  message!: string;

  @Column('text')
  response!: string;

  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  sentimentScore!: number;

  @CreateDateColumn()
  timestamp!: Date;

  @ManyToOne(() => User, user => user.conversations)
  user!: User;

  @Column()
  userId!: string;
}