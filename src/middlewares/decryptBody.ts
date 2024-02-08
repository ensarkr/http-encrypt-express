import { NextFunction, Request, Response } from "express";
import { authT } from "../typings/auth.js";
import { keyCache } from "../lib/KeyCache.js";
import { decryptHexAndIVHex } from "../functions/httpEncryption.js";

function decryptBody_MW(req: Request, res: Response, next: NextFunction) {
  const auth: authT | undefined = res.locals.auth;

  if (auth === undefined) {
    throw "Role not processed.";
  }

  if (auth.status === "unknown") {
    throw "Role level not sufficient.";
  }

  console.log("Decrypting body. clientId = " + auth.clientID);

  const ecdh = keyCache.getItem(auth.clientID);

  if (!ecdh.status) {
    return res
      .status(401)
      .json({
        status: false,
        message: "Decryption failed. Client id is invalid.",
        actions: ["resetKeyExchange"],
      })
      .end();
  }

  if (typeof req.body !== "string" || !req.body.includes(".")) {
    return res
      .status(403)
      .json({
        status: false,
        message: "Decryption failed. Encrypted body is invalid.",
        actions: ["resetKeyExchange"],
      })
      .end();
  }

  const decryptedMessageRes = decryptHexAndIVHex(
    res.locals.auth.clientID,
    req.body
  );

  if (!decryptedMessageRes.status)
    return res.status(400).json(decryptedMessageRes).end();

  res.locals.parsedBody = JSON.parse(decryptedMessageRes.value);

  next();
  return;
}

export { decryptBody_MW };
