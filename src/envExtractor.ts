import "dotenv/config";

const API_URL = process.env.API_URL as string;

if (API_URL === undefined) throw "API_URL not found in .env file.";

const TMDB_API_KEY = process.env.TMDB_API_KEY as string;

if (TMDB_API_KEY === undefined) throw "TMDB_API_KEY not found in .env file.";

const POSTGRESQL_HOST = process.env.POSTGRESQL_HOST as string;

if (POSTGRESQL_HOST === undefined)
  throw "POSTGRESQL_HOST not found in .env file.";

const POSTGRESQL_PORT = process.env.POSTGRESQL_PORT as string;

if (POSTGRESQL_PORT === undefined)
  throw "POSTGRESQL_PORT not found in .env file.";

const POSTGRESQL_DATABASE = process.env.POSTGRESQL_DATABASE as string;

if (POSTGRESQL_DATABASE === undefined)
  throw "POSTGRESQL_DATABASE not found in .env file.";

const POSTGRESQL_USER = process.env.POSTGRESQL_USER as string;

if (POSTGRESQL_USER === undefined)
  throw "POSTGRESQL_USER not found in .env file.";

const POSTGRESQL_PASSWORD = process.env.POSTGRESQL_PASSWORD as string;

if (POSTGRESQL_PASSWORD === undefined)
  throw "POSTGRESQL_PASSWORD not found in .env file.";

export {
  API_URL,
  TMDB_API_KEY,
  POSTGRESQL_DATABASE,
  POSTGRESQL_HOST,
  POSTGRESQL_PASSWORD,
  POSTGRESQL_PORT,
  POSTGRESQL_USER,
};
