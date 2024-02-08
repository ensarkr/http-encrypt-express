type authT = unknownClientT | guestClientT | userClientT;

type unknownClientT = {
  status: "unknown";
};
type guestClientT = {
  status: "guest";
  clientID: string;
};

type userClientT = {
  status: "user";
  clientID: string;
  userID: number;
  username: string;
};

export { authT, guestClientT, unknownClientT, userClientT };
