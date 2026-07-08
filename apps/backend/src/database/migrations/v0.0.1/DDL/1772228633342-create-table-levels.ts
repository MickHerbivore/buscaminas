import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableLevels1772228633342 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'levels',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'rows_quantity',
                        type: 'int4',
                        isNullable: false,
                    },
                    {
                        name: 'columns_quantity',
                        type: 'int4',
                        isNullable: false,
                    },
                    {
                        name: 'mines_quantity',
                        type: 'int4',
                        isNullable: false,
                    },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('levels');
    }

}
