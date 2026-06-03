import type { Movie } from '@/types/tmdb';
import type { SwipeAction, SwipeHistory } from '@/types/supabase';
import { supabase } from './supabase';

export type { SwipeAction };

export async function saveSwipe(
  userId: string,
  movie: Movie,
  action: SwipeAction,
): Promise<void> {
  const { error } = await supabase.from('swipe_history').upsert(
    {
      user_id: userId,
      movie_id: movie.id,
      movie_title: movie.title,
      movie_poster_path: movie.poster_path,
      movie_vote_average: movie.vote_average,
      movie_release_date: movie.release_date ?? null,
      movie_genre_ids: movie.genre_ids ?? [],
      action,
    },
    { onConflict: 'user_id,movie_id' },
  );
  if (error) throw error;
}

export async function getSwipedMovieIds(userId: string): Promise<number[]> {
  const { data, error } = await supabase
    .from('swipe_history')
    .select('movie_id')
    .eq('user_id', userId);
  if (error) throw error;
  return (data ?? []).map((r) => r.movie_id);
}

export type SortMode = 'score' | 'latest' | 'genres';

export async function getLikedMovies(
  userId: string,
  sort: SortMode = 'score',
): Promise<SwipeHistory[]> {
  let query = supabase
    .from('swipe_history')
    .select('*')
    .eq('user_id', userId)
    .eq('action', 'like');

  if (sort === 'score') query = query.order('movie_vote_average', { ascending: false });
  else if (sort === 'latest') query = query.order('swiped_at', { ascending: false });
  else query = query.order('movie_genre_ids');

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getAllSwipes(userId: string): Promise<SwipeHistory[]> {
  const { data, error } = await supabase
    .from('swipe_history')
    .select('*')
    .eq('user_id', userId)
    .order('swiped_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
