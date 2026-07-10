import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('levels')
export class Level {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ name: 'rows_quantity' })
  rowsQuantity: number;

  @Column({ name: 'columns_quantity' })
  columnsQuantity: number;

  @Column({ name: 'mines_quantity' })
  minesQuantity: number;
}
