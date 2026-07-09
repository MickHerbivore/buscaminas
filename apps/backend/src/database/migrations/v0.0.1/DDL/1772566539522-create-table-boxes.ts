import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableBoxes1772566539522 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'boxes',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'row',
                        type: 'int4',
                        isNullable: false,
                    },
                    {
                        name: 'column',
                        type: 'int4',
                        isNullable: false,
                    },
                    {
                        name: 'has_mine',
                        type: 'boolean',
                        isNullable: false,
                    },
                    {
                        name: 'is_flagged',
                        type: 'boolean',
                        isNullable: false,
                    },
                    {
                        name: 'id_rotated',
                        type: 'boolean',
                        isNullable: false,
                    },
                    {
                        name: 'mines_around_quantity',
                        type: 'int4',
                        isNullable: false,
                    },
                    {
                        name: 'game_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                ],
                foreignKeys: [
                    {
                        name: 'boxes_game_id_fkey',
                        referencedTableName: 'games',
                        referencedColumnNames: ['id'],
                        columnNames: ['game_id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('boxes');
    }

}
