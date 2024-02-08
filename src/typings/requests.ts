import { movieDetailT } from "./tmdb.js";

type defaultBadResponseT = {
  status: false;
  message: string;
  actions?: ("resetKeyExchange" | "signOut")[];
};

type postHandshakeReqT = {
  clientPublicKey: string;
};

type postHandshakeResT = {
  clientID: string;
  serverPublicKeyHex: string;
};

type postSignUpReqT = {
  username: string;
  password: string;
  rePassword: string;
};

type postSignUpResT = {
  userID: number;
  username: string;
  sessionID: string;
};

type postSignInReqT = {
  username: string;
  password: string;
};

type postSignInResT = {
  userID: number;
  username: string;
  sessionID: string;
};

type getVerifySessionResT = {
  userID: number;
  username: string;
};

type getRandomMoviesResT = {
  totalRequestedMovieCount: number | null;
  randomMovies: movieDetailT[];
};

export {
  postHandshakeReqT,
  postHandshakeResT,
  postSignUpReqT,
  postSignUpResT,
  defaultBadResponseT,
  postSignInReqT,
  postSignInResT,
  getRandomMoviesResT,
  getVerifySessionResT,
};
