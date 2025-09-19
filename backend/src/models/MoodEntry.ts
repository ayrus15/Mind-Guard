import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity('mood_entries')
export class MoodEntry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('int')
  moodScore!: number; // 1-10 scale

  @Column('text', { nullable: true })
  text!: string; // User's journal entry

  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  textAnalysis!: number | null; // Sentiment analysis score (-1 to 1)

  @CreateDateColumn()
  timestamp!: Date;

  @ManyToOne(() => User, user => user.moodEntries)
  user!: User;

  @Column()
  userId!: string;
}