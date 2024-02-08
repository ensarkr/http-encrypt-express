import { NextFunction, Request, Response } from "express";
import { guestClientT, unknownClientT, userClientT } from "../typings/auth.js";
import { keyCache } from "../lib/KeyCache.js";
import { defaultBadResponseT } from "../typings/requests.js";
import { decryptHexAndIVHex } from "../functions/httpEncryption.js";
import { getUserViaSessionID } from "../functions/database.js";

function roleProcess_HOMW(role: "unknown" | "guest" | "user") {
  switch (role) {
    case "unknown":
      return unknownCheck_MW;
    case "guest":
      return guestCheck_MW;
    case "user":
      return userCheck_MW;
  }
}

function unknownCheck_MW(req: Request, res: Response, next: NextFunction) {
  console.log("Unknown role procession.");

  res.locals.auth = {
    status: "unknown",
  } as unknownClientT;
  next();
}

function guestCheck_MW(req: Request, res: Response, next: NextFunction) {
  console.log("Guest role procession.");

  if (
    req.headers["x-client-id"] === undefined ||
    !keyCache.getItem(req.headers["x-client-id"] as string).status
  ) {
    res
      .status(400)
      .json({
        status: false,
        message: "X-Client-ID header not found.",
        actions: ["resetKeyExchange"],
      } as defaultBadResponseT)
      .end();
    return;
  }

  res.locals.auth = {
    status: "guest",
    clientID: req.headers["x-client-id"],
  } as guestClientT;
  next();
}

async function userCheck_MW(req: Request, res: Response, next: NextFunction) {
  console.log("User role procession.");

  if (
    req.headers["x-client-id"] === undefined ||
    !keyCache.getItem(req.headers["x-client-id"] as string).status
  ) {
    return res
      .status(400)
      .json({
        status: false,
        message: "X-Client-ID header not found.",
        actions: ["resetKeyExchange"],
      } as defaultBadResponseT)
      .end();
  }

  if (req.headers["authorization"] === undefined) {
    return res
      .status(401)
      .json({
        status: false,
        message: "Authorization header not found.",
      } as defaultBadResponseT)
      .end();
  }

  const sessionIDRes = decryptHexAndIVHex(
    req.headers["x-client-id"] as string,
    req.headers["authorization"]
  );

  if (!sessionIDRes.status) {
    return res
      .status(401)
      .json(sessionIDRes as defaultBadResponseT)
      .end();
  }

  const user = await getUserViaSessionID(sessionIDRes.value);

  if (!user.status) {
    return res
      .status(401)
      .json(user as defaultBadResponseT)
      .end();
  }

  res.locals.auth = {
    status: "user",
    clientID: req.headers["x-client-id"],
    userID: user.value.id,
    username: user.value.username,
  } as userClientT;
  next();
}

export { roleProcess_HOMW };
