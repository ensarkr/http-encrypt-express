type actorT = {
  id: number;
  gender: "male" | "female" | "N/A";
  name: string;
  department: string;
  avatarPath: string;
};

type movieT = {
  type: "movie";
  id: number;
  genres: string[];
  title: string;
  originalTitle: string;
  backdropPath: string;
  posterPath: string;
  voteAverage: number;
  releaseDate: string;
  overview: string;
  popularity: number;
};

type movieDetailT = movieT & {
  budget: number;
  productionCompanies: string[];
  productionCountries: string[];
  revenue: number;
  runtime: number;
  voteCount: number;
  images: string[];
  videos: { name: string; key: string; id: string }[];
  cast: (actorT & { character: string })[];
  similar: movieT[];
  reviews: { username: string; rating: number; content: string }[];
};

export { actorT, movieT, movieDetailT };
