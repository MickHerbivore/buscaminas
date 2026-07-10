import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameBoxColumns1773100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "boxes" RENAME COLUMN "mines_arround_quantity" TO "mines_around_quantity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "boxes" RENAME COLUMN "id_rotated" TO "is_revealed"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "boxes" RENAME COLUMN "is_revealed" TO "id_rotated"`,
    );
    await queryRunner.query(
      `ALTER TABLE "boxes" RENAME COLUMN "mines_around_quantity" TO "mines_arround_quantity"`,
    );
  }
}
