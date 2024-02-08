import { DatabaseError } from "pg";
import { client } from "../lib/DatabaseClient.js";
import { doubleReturn } from "../typings/global.js";
import { postSignInResT, postSignUpResT } from "../typings/requests.js";
import { v4 as uuidV4 } from "uuid";
import { user_DB } from "../typings/database.js";
import bcrypt from "bcrypt";

async function insertNewUser(
  username: string,
  hashedPassword: string
): Promise<doubleReturn<postSignUpResT>> {
  try {
    const userRes = await client.query<{ id: number; username: string }>(
      "INSERT INTO users (username, hashed_password) VALUES ($1,$2) RETURNING id, username",
      [username, hashedPassword]
    );

    const sessionRes = await client.query<{
      session_id: string;
    }>(
      "INSERT INTO sessions (user_id, session_id) VALUES ($1,$2) RETURNING session_id",
      [userRes.rows[0].id, uuidV4()]
    );

    return {
      status: true,
      value: {
        userID: userRes.rows[0].id,
        username: userRes.rows[0].username,
        sessionID: sessionRes.rows[0].session_id,
      },
    };
  } catch (error) {
    return {
      status: false,
      message:
        (error as DatabaseError).code === "23505"
          ? "This username cannot be used."
          : "Database error occurred.",
    };
  }
}

async function getSessionIDIfUserExists(
  username: string,
  password: string
): Promise<doubleReturn<postSignInResT>> {
  try {
    const userRes = await client.query<user_DB>(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (userRes.rowCount === 0)
      return {
        status: false,
        message: "Username or password is wrong.",
        actions: ["signOut"],
      };

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userRes.rows[0].hashed_password
    );

    if (!isPasswordCorrect)
      return {
        status: false,
        message: "Username or password is wrong.",
        actions: ["signOut"],
      };

    const sessionRes = await client.query<{
      session_id: string;
    }>(
      "INSERT INTO sessions (user_id, session_id) VALUES ($1,$2) RETURNING session_id",
      [userRes.rows[0].id, uuidV4()]
    );

    return {
      status: true,
      value: {
        userID: userRes.rows[0].id,
        username: userRes.rows[0].username,
        sessionID: sessionRes.rows[0].session_id,
      },
    };
  } catch (error) {
    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

async function getUserViaSessionID(
  sessionID: string
): Promise<doubleReturn<user_DB>> {
  try {
    const userRes = await client.query<user_DB>(
      "SELECT * FROM users WHERE id = (SELECT user_id FROM sessions WHERE session_id = $1)",
      [sessionID]
    );

    if (userRes.rowCount === 0)
      return {
        status: false,
        message: "Session ID is invalid.",
        actions: ["signOut"],
      };

    return {
      status: true,
      value: userRes.rows[0],
    };
  } catch (error) {
    console.log(error);

    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

async function increaseUserRequestCount(
  userID: number
): Promise<doubleReturn<undefined>> {
  try {
    await client.query(
      "UPDATE users SET request_count = (request_count + 1) WHERE id = $1",
      [userID]
    );

    return {
      status: true,
    };
  } catch (error) {
    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

async function increaseUsersTotalMovieCount(
  userID: number,
  increaseAmount: number
): Promise<doubleReturn<number>> {
  try {
    const res = await client.query<{ total_movie_count: number }>(
      "UPDATE users SET total_movie_count = (total_movie_count + $1) WHERE id = $2 RETURNING total_movie_count",
      [increaseAmount, userID]
    );

    if (res.rowCount === 0) throw "Something.";

    return {
      status: true,
      value: res.rows[0].total_movie_count,
    };
  } catch (error) {
    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

export {
  insertNewUser,
  getSessionIDIfUserExists,
  getUserViaSessionID,
  increaseUserRequestCount,
  increaseUsersTotalMovieCount,
};
