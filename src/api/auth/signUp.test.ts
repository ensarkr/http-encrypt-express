import { keySetup_TEST } from "../../tests/setup";
import { cleanup_TEST } from "../../tests/cleanup";
import {
  defaultBadResponseT,
  postSignUpReqT,
  postSignUpResT,
} from "../../typings/requests";
import { testUserData } from "../../tests/testDatas";
import { doubleReturn } from "../../typings/global";
import { API_URL } from "../../envExtractor";

const testURL = API_URL + "/auth/signUp";

describe("sign up", () => {
  let setup: Awaited<ReturnType<typeof keySetup_TEST>>;

  const testBody: postSignUpReqT = {
    username: testUserData.username,
    password: testUserData.password,
    rePassword: testUserData.rePassword,
  };

  beforeAll(async () => {
    setup = await keySetup_TEST();
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

  test("sign up works", async () => {
    const res = await fetch(testURL, {
      method: "POST",
      headers: {
        "Content-Type": "text/html",
        "X-Client-ID": setup.clientID,
      },
      body: setup.encrypt(testBody),
    });

    const data = await setup.responseBodyConverter<
      doubleReturn<postSignUpResT>
    >(res);

    if (!data.status) throw data.message;

    expect(data.value.username).toEqual(testBody.username);
    expect(typeof data.value.sessionID).toEqual("string");
    expect(data.wasResponseEncrypted).toBe(true);
  });

  test("sign up again with same name gives error", async () => {
    const res = await fetch(testURL, {
      method: "POST",
      headers: {
        "Content-Type": "text/html",
        "X-Client-ID": setup.clientID,
      },
      body: setup.encrypt(testBody),
    });

    const data = await setup.responseBodyConverter<defaultBadResponseT>(res);

    expect(data).toEqual({
      status: false,
      message: "This username cannot be used.",
      wasResponseEncrypted: true,
    });
  });
});
