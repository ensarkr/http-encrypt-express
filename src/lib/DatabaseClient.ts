import pg, { Client } from "pg";
import {
  POSTGRESQL_DATABASE,
  POSTGRESQL_HOST,
  POSTGRESQL_PASSWORD,
  POSTGRESQL_PORT,
  POSTGRESQL_USER,
} from "../envExtractor.js";

class DatabaseClient {
  constructor() {
    this.client = new pg.Client({
      host: POSTGRESQL_HOST,
      port: parseInt(POSTGRESQL_PORT),
      database: POSTGRESQL_DATABASE,
      user: POSTGRESQL_USER,
      password: POSTGRESQL_PASSWORD,
    });
  }

  private client: Client;

  getClient() {
    this.client.connect();
    return this.client;
  }
}

const databaseClient = new DatabaseClient();
const client = databaseClient.getClient();

export { client };
