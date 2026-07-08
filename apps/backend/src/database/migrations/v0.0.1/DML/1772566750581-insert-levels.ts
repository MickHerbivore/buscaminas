import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertLevels1772566750581 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO levels (name, description, rows_quantity, columns_quantity, mines_quantity)
            VALUES 
                ('Easy', '8x8 grid with 10 mines', 8, 8, 10),
                ('Intermediate', '16x16 grid with 40 mines', 16, 16, 40),
                ('Expert', '16x30 grid with 99 mines', 16, 30, 99);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM levels;`);
    }

}
