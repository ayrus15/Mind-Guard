import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity('crisis_alerts')
export class CrisisAlert {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: ['low', 'medium', 'high'],
  })
  riskLevel!: 'low' | 'medium' | 'high';

  @Column('jsonb')
  triggerData!: {
    moodData?: any;
    emotionData?: any;
    chatData?: any;
    analysis?: string;
  };

  @Column({ default: false })
  resolved!: boolean;

  @CreateDateColumn()
  timestamp!: Date;

  @ManyToOne(() => User, user => user.crisisAlerts)
  user!: User;

  @Column()
  userId!: string;
}