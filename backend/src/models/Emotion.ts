import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity('emotions')
export class Emotion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  emotion!: string; // happy, sad, anxious, neutral, etc.

  @Column('decimal', { precision: 3, scale: 2 })
  confidence!: number;

  @CreateDateColumn()
  timestamp!: Date;

  @ManyToOne(() => User, user => user.emotions)
  user!: User;

  @Column()
  userId!: string;
}