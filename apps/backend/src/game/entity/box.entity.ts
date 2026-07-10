import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './game.entity';

@Entity('boxes')
export class Box {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  row: number;

  @Column()
  column: number;

  @Column({ name: 'has_mine' })
  hasMine: boolean;

  @Column({ name: 'is_flagged' })
  isFlagged: boolean;

  @Column({ name: 'is_revealed' })
  isRevealed: boolean;

  @Column({ name: 'mines_around_quantity' })
  minesAroundQuantity: number;

  @ManyToOne(() => Game, (game) => game.boxes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game: Game;
}
