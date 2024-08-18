import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Box } from '../../box/entities/box.entity';
import { Level } from '../../level/entities/level.entity';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'started_at', nullable: true })
  startedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Level)
  @JoinColumn({ name: 'level_id' })
  level: Level;

  @OneToMany(() => Box, (box) => box.game, { cascade: true })
  boxes: Box[];
}
