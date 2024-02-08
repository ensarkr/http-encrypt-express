import express from "express";
import { roleProcess_HOMW } from "../../middlewares/roleProcess.js";
import { userClientT } from "../../typings/auth.js";
import {
  increaseUserRequestCount,
  increaseUsersTotalMovieCount,
} from "../../functions/database.js";
import { requestTenRandomMovie } from "../../functions/requests.js";
import { sendEncrypted } from "../../middlewares/sendEncrypted.js";

const data = express();

data.get(
  "/data/randomMovies",
  roleProcess_HOMW("user"),
  async (req, res, next) => {
    const auth = res.locals.auth as userClientT;

    console.log("Random movies requested by " + auth.username);

    await increaseUserRequestCount(auth.userID);

    const randomMovieRes = await requestTenRandomMovie();

    if (!randomMovieRes.status) return sendEncrypted(res, 500, randomMovieRes);

    const dbRes = await increaseUsersTotalMovieCount(
      auth.userID,
      randomMovieRes.value.length
    );

    sendEncrypted(res, 200, {
      status: true,
      value: {
        randomMovies: randomMovieRes.value,
        totalRequestedMovieCount: dbRes.status ? dbRes.value : null,
      },
    });
  }
);

export { data };
