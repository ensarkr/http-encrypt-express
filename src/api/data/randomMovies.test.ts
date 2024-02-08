import { API_URL } from "../../envExtractor";
import { cleanup_TEST } from "../../tests/cleanup";
import { keySetup_TEST, insertTestUser_TEST } from "../../tests/setup";
import { testUserData } from "../../tests/testDatas";
import { doubleReturn } from "../../typings/global";
import {
  defaultBadResponseT,
  getRandomMoviesResT,
} from "../../typings/requests";

const testURL = API_URL + "/data/randomMovies";

describe("random movies", () => {
  let setup: Awaited<ReturnType<typeof keySetup_TEST>>;

  beforeAll(async () => {
    setup = await keySetup_TEST();
    await insertTestUser_TEST();
  });

  afterAll(async () => {
    await cleanup_TEST(["deleteTestUser"]);
  });

  test("no client id", async () => {
    const res = await fetch(testURL, {
      method: "GET",
    });

    const data = await setup.responseBodyConverter<defaultBadResponseT>(res);

    expect(data).toEqual({
      status: false,
      message: "X-Client-ID header not found.",
      actions: ["resetKeyExchange"],
      wasResponseEncrypted: false,
    });
  });

  test("wrong session id", async () => {
    const res = await fetch(testURL, {
      method: "GET",
      headers: {
        "X-Client-ID": setup.clientID,
        Authorization: setup.encryptString("wrong session id"),
      },
    });

    const data = await setup.responseBodyConverter<defaultBadResponseT>(res);

    expect(data).toEqual({
      status: false,
      message: "Session ID is invalid.",
      actions: ["signOut"],
      wasResponseEncrypted: false,
    });
  });

  test("random movies returned", async () => {
    const res = await fetch(testURL, {
      method: "GET",
      headers: {
        "X-Client-ID": setup.clientID,
        Authorization: setup.encryptString(testUserData.sessionID),
      },
    });

    const data = await setup.responseBodyConverter<
      doubleReturn<getRandomMoviesResT>
    >(res);

    if (!data.status) throw data.message;

    expect(data.value.randomMovies !== undefined).toBe(true);
    expect(data.value.randomMovies.length !== 0).toBe(true);
    expect(data.value.totalRequestedMovieCount).toBe(10);
    expect(typeof data.value.randomMovies[0].id).toBe("number");
  }, 10000);
});
