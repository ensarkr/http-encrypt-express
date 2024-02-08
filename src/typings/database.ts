type dbDate = string;

type user_DB = {
  id: number;
  username: string;
  hashed_password: string;
  inserted_at: dbDate;
  request_count: number;
  total_movie_count: number;
};

type session_DB = {
  id: number;
  session_id: string;
  user_id: number;
  inserted_at: dbDate;
};

export { user_DB, session_DB };
