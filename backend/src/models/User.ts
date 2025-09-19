import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Conversation } from './Conversation';
import { Emotion } from './Emotion';
import { MoodEntry } from './MoodEntry';
import { CrisisAlert } from './CrisisAlert';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  name!: string;

  @Column('jsonb', { nullable: true })
  emergencyContacts!: {
    name: string;
    phone: string;
    relationship: string;
  }[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Conversation, conversation => conversation.user)
  conversations!: Conversation[];

  @OneToMany(() => Emotion, emotion => emotion.user)
  emotions!: Emotion[];

  @OneToMany(() => MoodEntry, moodEntry => moodEntry.user)
  moodEntries!: MoodEntry[];

  @OneToMany(() => CrisisAlert, crisisAlert => crisisAlert.user)
  crisisAlerts!: CrisisAlert[];
}