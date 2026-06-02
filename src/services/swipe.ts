import type { Movie } from '@/types/tmdb';
import { supabase } from './supabase';

export type SwipeAction = 'like' | 'dislike';

export async function saveSwipe(
  userId: string,
  movie: Movie,
  action: SwipeAction,
): Promise<void> {
  const { error } = await supabase.from('swipe_history').upsert({
    user_id: userId,
    movie_id: movie.id,
    movie_title: movie.title,
    movie_poster_path: movie.poster_path,
    movie_vote_average: movie.vote_average,
    action,
  }, { onConflict: 'user_id,movie_id' });

  if (error) throw error;
}

export async function getSwipedMovieIds(userId: string): Promise<number[]> {
  const { data, error } = await supabase
    .from('swipe_history')
    .select('movie_id')
    .eq('user_id', userId);

  if (error) throw error;
  return (data ?? []).map((row) => row.movie_id as number);
}

export async function getLikedMovies(userId: string) {
  const { data, error } = await supabase
    .from('swipe_history')
    .select('*')
    .eq('user_id', userId)
    .eq('action', 'like')
    .order('movie_vote_average', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getAllSwipes(userId: string) {
  const { data, error } = await supabase
    .from('swipe_history')
    .select('*')
    .eq('user_id', userId)
    .order('swiped_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}
