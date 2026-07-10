import { MigrationInterface, QueryRunner } from 'typeorm';

export class GameCompletionAndBoxConstraints1772900000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "games" ADD COLUMN "ended_at" timestamp NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "games" ADD COLUMN "won_at" timestamp NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "boxes_game_row_column_unique"
       ON "boxes" ("game_id", "row", "column")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "boxes_game_row_column_unique"`);
    await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "won_at"`);
    await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "ended_at"`);
  }
}
