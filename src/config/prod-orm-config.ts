import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const isLoggingTrue = process.env.TYPEORM_LOGGING === "true";
// const isSynchronizeTrue = process.env.TYPEORM_SYNCHRONIZE === "true";
const isSynchronizeTrue = "true" === "true";
const productionOrmConfig: PostgresConnectionOptions = {
  // name: "default",
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  ssl: false, // true,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  logging: isLoggingTrue,
  synchronize: isSynchronizeTrue,
  entities: [
    process.env.BUILD_FLAG === "local" ? "src/entity/*.*" : "dist/entity/*.*",
  ],
  migrations: [
    process.env.BUILD_FLAG === "local"
      ? "src/migration/**/*.ts"
      : "dist/migration/**/*.js",
  ],
  subscribers: [
    process.env.BUILD_FLAG === "local"
      ? "src/subscriber/**/*.ts"
      : "dist/subscriber/**/*.ts",
  ],
  cli: {
    migrationsDir: "src/migration/**/*.ts",
  },
};

export = productionOrmConfig;
