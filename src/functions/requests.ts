import { TMDB_API_KEY } from "../envExtractor.js";
import { doubleReturn } from "../typings/global.js";
import { getRandomMoviesResT } from "../typings/requests.js";
import { movieDetailT, movieT } from "../typings/tmdb.js";
import { convertDBtoNormalMovieDetail } from "./conversion.js";

async function requestMovieDetails(
  id: number
): Promise<doubleReturn<movieDetailT>> {
  try {
    const url = `https://api.themoviedb.org/3/movie/${id}?append_to_response=images,videos,credits,similar,reviews`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: TMDB_API_KEY,
      },
    };

    const res = await fetch(url, options);
    const data = await res.json();

    if (data.success !== false) {
      if (data.adult === true)
        return { status: false, message: "Fetch error. 0W0" };

      return {
        status: true,
        value: convertDBtoNormalMovieDetail(data),
      };
    } else {
      return { status: false, message: "Fetch error." };
    }
  } catch (error) {
    return { status: false, message: "Fetch error." };
  }
}

async function requestTenRandomMovie(): Promise<doubleReturn<movieDetailT[]>> {
  try {
    const randomMovies: movieDetailT[] = [];

    const res = await fetch("https://api.themoviedb.org/3/movie/latest", {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: TMDB_API_KEY,
      },
    });
    const data: movieT = await res.json();

    const latestMovieID = data.id;

    for (let i = 0, tryLimit = 30; i < 10 && tryLimit !== 0; i++, tryLimit--) {
      const randomMovieID = Math.round(Math.random() * latestMovieID);

      const randomMovieRes = await requestMovieDetails(randomMovieID);

      if (!randomMovieRes.status) {
        i--;
        continue;
      }

      randomMovies.push(randomMovieRes.value);
    }

    if (randomMovies.length !== 0) {
      return {
        status: true,
        value: randomMovies,
      };
    } else {
      return { status: false, message: "TMDB error." };
    }
  } catch (error) {
    return { status: false, message: "Fetch error." };
  }
}

export { requestTenRandomMovie };
