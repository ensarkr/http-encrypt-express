import { movieT, actorT, movieDetailT } from "../typings/tmdb.js";

function convertDBtoNormalMovie(movie: any): movieT {
  return {
    type: "movie",
    id: movie.id,
    genres: movie.genre_ids
      .map((e: number) => getMovieGenre(e))
      .filter((e: null) => e !== null),
    title: movie.title,
    originalTitle: movie.original_title,
    backdropPath: movie.backdrop_path,
    releaseDate: movie.release_date,
    posterPath: movie.poster_path,
    voteAverage: movie.vote_average,
    overview: movie.overview,
    popularity: movie.popularity,
  };
}

function convertDBtoNormalActor(actor: any): actorT {
  return {
    id: actor.id,
    gender:
      actor.gender === "1" ? "female" : actor.gender === "2" ? "male" : "N/A",
    department: actor.known_for_department,
    name: actor.name,
    avatarPath: actor.profile_path,
  };
}

function convertDBtoNormalMovieDetail(movieDetail: any): movieDetailT {
  return {
    type: "movie",
    id: movieDetail.id,
    releaseDate: movieDetail.release_date,
    genres: movieDetail.genres
      .map((e: { id: number }) => getMovieGenre(e.id))
      .filter((e: null) => e !== null),
    title: movieDetail.title,
    originalTitle: movieDetail.original_title,
    backdropPath: movieDetail.backdrop_path,
    posterPath: movieDetail.poster_path,
    voteAverage: movieDetail.vote_average,
    budget: movieDetail.budget,
    cast: [
      ...(movieDetail.credits.cast as any[]).map((e) => {
        return { ...convertDBtoNormalActor(e), character: e.character };
      }),
      ...(movieDetail.credits.crew as any[]).map((e) => {
        return { ...convertDBtoNormalActor(e), character: e.character };
      }),
    ],
    images: (movieDetail.images.backdrops as any[]).map((e) => {
      return e.file_path;
    }),
    overview: movieDetail.overview,
    popularity: movieDetail.popularity,
    productionCompanies: movieDetail.production_companies.map(
      (e: { name: any }) => e.name
    ),
    productionCountries: movieDetail.production_countries.map(
      (e: { name: any }) => e.name
    ),
    revenue: movieDetail.revenue,
    reviews: movieDetail.reviews.results
      .map(
        (e: {
          author_details: { username: any; rating: any };
          content: any;
        }) => {
          return {
            username: e.author_details.username,
            rating: e.author_details.rating,
            content: e.content,
          };
        }
      )
      .slice(0, 3),
    runtime: movieDetail.runtime,
    similar: movieDetail.similar.results.map((e: any) =>
      convertDBtoNormalMovie(e)
    ),
    videos: (movieDetail.videos.results as any[])
      .filter((e) => e.site === "YouTube")
      .map((e) => {
        return {
          id: e.id,
          key: e.key,
          name: e.name,
        };
      }),
    voteCount: movieDetail.vote_count,
  };
}

function getMovieGenre(id: number): string | null {
  if (genreIds[id as keyof typeof genreIds] === undefined) return null;
  return genreIds[id as keyof typeof genreIds];
}

export {
  convertDBtoNormalMovie,
  convertDBtoNormalActor,
  convertDBtoNormalMovieDetail,
};

const genreIds = {
  10759: "Action & Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  10762: "Kids",
  9648: "Mystery",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
  37: "Western",
  28: "Action",
  12: "Adventure",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
};
