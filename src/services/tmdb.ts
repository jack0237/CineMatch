import type { Genre, MovieCredits, MoviesPage, MovieVideosResponse, Movie } from '@/types/tmdb';

const BASE_URL = process.env.EXPO_PUBLIC_TMDB_BASE_URL ?? 'https://api.themoviedb.org/3';
const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY!);
  url.searchParams.set('language', 'fr-FR');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`TMDB error ${response.status}: ${endpoint}`);
  }
  return response.json() as Promise<T>;
}

export function getPopularMovies(page = 1): Promise<MoviesPage> {
  return fetchTMDB('/movie/popular', { page: String(page) });
}

export function discoverMovies(params: {
  page?: number;
  with_genres?: string;
  'vote_average.gte'?: string;
  'primary_release_date.gte'?: string;
  'primary_release_date.lte'?: string;
}): Promise<MoviesPage> {
  const stringParams: Record<string, string> = { page: String(params.page ?? 1) };
  if (params.with_genres) stringParams['with_genres'] = params.with_genres;
  if (params['vote_average.gte']) stringParams['vote_average.gte'] = params['vote_average.gte'];
  if (params['primary_release_date.gte']) stringParams['primary_release_date.gte'] = params['primary_release_date.gte'];
  if (params['primary_release_date.lte']) stringParams['primary_release_date.lte'] = params['primary_release_date.lte'];
  return fetchTMDB('/discover/movie', { ...stringParams, sort_by: 'popularity.desc' });
}

export function getMovieDetails(id: number): Promise<Movie> {
  return fetchTMDB(`/movie/${id}`);
}

export function getMovieCredits(id: number): Promise<MovieCredits> {
  return fetchTMDB(`/movie/${id}/credits`);
}

export function getMovieVideos(id: number): Promise<MovieVideosResponse> {
  return fetchTMDB(`/movie/${id}/videos`);
}

export function searchMovies(query: string, page = 1): Promise<MoviesPage> {
  return fetchTMDB('/search/movie', { query, page: String(page) });
}

export function getGenres(): Promise<{ genres: Genre[] }> {
  return fetchTMDB('/genre/movie/list');
}
