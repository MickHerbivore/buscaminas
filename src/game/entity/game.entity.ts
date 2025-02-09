import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Level } from '../../level/entities/level.entity';
import { GameStatusType } from '../types/game-status';
import { Box } from './box.entity';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'status', nullable: false })
  status: GameStatusType;

  @Column({ name: 'started_at', nullable: true })
  startedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Level)
  @JoinColumn({ name: 'level_id' })
  level: Level;

  @OneToMany(() => Box, (box) => box.game, {
    cascade: true,
  })
  boxes: Box[];
}
