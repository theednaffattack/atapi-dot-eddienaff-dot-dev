import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const devOrmconfig: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  ssl: false,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  logging: true,
  synchronize: true,
  entities: [`src/entity/**/*.*`],
  migrations: [`src/migration/**/*.ts`],
  subscribers: [`src/subscriber/**/*.ts`],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};

export = devOrmconfig;
