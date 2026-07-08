import 'dotenv/config';
import { join } from 'path';
import { DataSource } from 'typeorm';

export const connectionSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USERNAME ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? 'postgres',
  database: process.env.DATABASE_NAME ?? 'buscaminas',
  logging: false,
  entities: [join(process.cwd(), 'src', '**', '*.entity{.ts,js}')],
  migrations: [
    join(process.cwd(), 'src', 'database', 'migrations', '**', '*{.ts,js}'),
  ],
  synchronize: false,
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: false,
});
