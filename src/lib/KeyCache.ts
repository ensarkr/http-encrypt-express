import NodeCache from "node-cache";
import { ecdhDataT } from "../typings/ecdh.js";
import { doubleReturn } from "../typings/global.js";

const clientIDExpireSecond = 60 * 60 * 2;

class KeyCache {
  constructor() {
    this.cache = new NodeCache();
  }

  private cache: NodeCache;

  createItem(ecdhData: ecdhDataT): doubleReturn<undefined> {
    this.cache.set(ecdhData.clientID, ecdhData, clientIDExpireSecond);

    return { status: true };
  }

  resetTimer(clientID: string): doubleReturn<undefined> {
    const res = this.cache.ttl(clientID, clientIDExpireSecond);

    return res
      ? { status: true }
      : {
          status: false,
          message: "Client id not found.",
          actions: ["resetKeyExchange"],
        };
  }

  getItem(clientID: string): doubleReturn<ecdhDataT> {
    const ecdhData = this.cache.get(clientID) as ecdhDataT | undefined;

    if (ecdhData !== undefined) {
      this.resetTimer(clientID);

      return {
        status: true,
        value: ecdhData,
      };
    } else
      return {
        status: false,
        message: "Client id not found.",
        actions: ["resetKeyExchange"],
      };
  }
}

const keyCache = new KeyCache();

export { keyCache };
