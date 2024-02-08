import express from "express";
import {
  postHandshakeReqT,
  postHandshakeResT,
} from "../../typings/requests.js";
import { createServerPublicKeyAndClientID } from "../../functions/keyExchange.js";
import { doubleReturn } from "../../typings/global.js";

const handshake = express();

handshake.post("/handshake", (req, res) => {
  console.log("Handshake requested.");

  const data = req.body as postHandshakeReqT;
  const keyRes = createServerPublicKeyAndClientID(data.clientPublicKey);

  if (!keyRes.status) {
    res.json(keyRes).status(500).end();
  } else
    res
      .json(keyRes as doubleReturn<postHandshakeResT>)
      .status(200)
      .end();
});

export { handshake };
