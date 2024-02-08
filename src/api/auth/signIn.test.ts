import { insertTestUser_TEST, keySetup_TEST } from "../../tests/setup";
import { cleanup_TEST } from "../../tests/cleanup";
import {
  defaultBadResponseT,
  postSignInReqT,
  postSignInResT,
} from "../../typings/requests";
import { testUserData } from "../../tests/testDatas";
import { doubleReturn } from "../../typings/global";
import { API_URL } from "../../envExtractor";

const testURL = API_URL + "/auth/signIn";

describe("sign in", () => {
  let setup: Awaited<ReturnType<typeof keySetup_TEST>>;

  const testBody: postSignInReqT = {
    username: testUserData.username,
    password: testUserData.password,
  };

  beforeAll(async () => {
    setup = await keySetup_TEST();
    await insertTestUser_TEST();
  });

  afterAll(async () => {
    await cleanup_TEST(["deleteTestUser"]);
  });

  test("no client id", async () => {
    const res = await fetch(testURL, {
      method: "POST",
      headers: {
        "Content-Type": "text/html",
      },
      body: setup.encrypt(testBody),
    });

    const data = await setup.responseBodyConverter<defaultBadResponseT>(res);

    expect(data).toEqual({
      status: false,
      message: "X-Client-ID header not found.",
      actions: ["resetKeyExchange"],
      wasResponseEncrypted: false,
    });
  });

  test("sign in with wrong password gives error", async () => {
    const res = await fetch(testURL, {
      method: "POST",
      headers: {
        "Content-Type": "text/html",
        "X-Client-ID": setup.clientID,
      },
      body: setup.encrypt(testBody),
    });

    const data = await setup.responseBodyConverter<
      doubleReturn<postSignInResT>
    >(res);

    if (!data.status) throw data.message;

    expect(data.value.username).toEqual(testBody.username);
    expect(typeof data.value.sessionID).toEqual("string");
    expect(data.wasResponseEncrypted).toBe(true);
  });

  test("sign in works", async () => {
    const res = await fetch(testURL, {
      method: "POST",
      headers: {
        "Content-Type": "text/html",
        "X-Client-ID": setup.clientID,
      },
      body: setup.encrypt({
        ...testBody,
        password: "wrongPassword",
      } as postSignInReqT),
    });

    const data = await setup.responseBodyConverter<
      doubleReturn<postSignInResT>
    >(res);

    expect(data).toEqual({
      status: false,
      message: "Username or password is wrong.",
      actions: ["signOut"],
      wasResponseEncrypted: true,
    } as typeof data);
  });
});
