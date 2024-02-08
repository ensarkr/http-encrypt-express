import express from "express";
import { roleProcess_HOMW } from "../../middlewares/roleProcess.js";
import { decryptBody_MW } from "../../middlewares/decryptBody.js";
import {
  getVerifySessionResT,
  postSignInReqT,
  postSignUpReqT,
} from "../../typings/requests.js";
import {
  getSessionIDIfUserExists,
  insertNewUser,
} from "../../functions/database.js";
import bcrypt from "bcrypt";
import { sendEncrypted } from "../../middlewares/sendEncrypted.js";
import { doubleReturn } from "../../typings/global.js";
import { userClientT } from "../../typings/auth.js";

const auth = express();

auth.post(
  "/auth/signUp",
  roleProcess_HOMW("guest"),
  decryptBody_MW,
  async (req, res) => {
    console.log("Sign up requested by " + res.locals.auth.clientID);

    const data: postSignUpReqT = res.locals.parsedBody;

    if (data.username === undefined)
      return sendEncrypted(res, 400, {
        status: false,
        message: "Username is not defined.",
      });

    if (data.password === undefined)
      return sendEncrypted(res, 400, {
        status: false,
        message: "Password is not defined.",
      });

    if (data.rePassword === undefined)
      return sendEncrypted(res, 400, {
        status: false,
        message: "Password repeat is not defined.",
      });

    if (data.username.trim().length < 4)
      return sendEncrypted(res, 400, {
        status: false,
        message: "Username length cannot be smaller than 4.",
      });

    if (data.password.trim().length < 8)
      return sendEncrypted(res, 400, {
        status: false,
        message: "Password length cannot be smaller than 8.",
      });

    if (data.password.trim() !== data.rePassword.trim())
      return sendEncrypted(res, 400, {
        status: false,
        message: "Password do not match.",
      });

    const dbRes = await insertNewUser(
      data.username,
      await bcrypt.hash(data.password, 10)
    );

    if (!dbRes.status) {
      return sendEncrypted(res, 400, dbRes);
    }

    return sendEncrypted(res, 200, dbRes);
  }
);

auth.post(
  "/auth/signIn",
  roleProcess_HOMW("guest"),
  decryptBody_MW,
  async (req, res) => {
    console.log("Sign in requested by " + res.locals.auth.clientID);

    const data: postSignInReqT = res.locals.parsedBody;

    if (data.username === undefined)
      return sendEncrypted(res, 400, {
        status: false,
        message: "Username is not defined.",
      });

    if (data.password === undefined)
      return sendEncrypted(res, 400, {
        status: false,
        message: "Password is not defined.",
      });

    if (data.username.trim().length < 4)
      return sendEncrypted(res, 400, {
        status: false,
        message: "Username length cannot be smaller than 4.",
      });

    if (data.password.trim().length < 8)
      return sendEncrypted(res, 400, {
        status: false,
        message: "Password length cannot be smaller than 8.",
      });

    const dbRes = await getSessionIDIfUserExists(data.username, data.password);

    if (!dbRes.status) {
      return sendEncrypted(res, 400, dbRes);
    }

    return sendEncrypted(res, 200, dbRes);
  }
);

auth.get("/auth/verifySession", roleProcess_HOMW("user"), async (req, res) => {
  const auth = res.locals.auth as userClientT;

  console.log("Verify requested by " + auth.username);

  sendEncrypted(res, 200, {
    status: true,
    value: { userID: auth.userID, username: auth.username },
  } as doubleReturn<getVerifySessionResT>);
});

export { auth };
