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

  @Column({ name: 'id_rotated' })
  isRotated: boolean;

  @Column({ name: 'mines_arround_quantity' })
  minesArroundQuantiy: number;

  @ManyToOne(() => Game, (game) => game.boxes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game: Game;
}
