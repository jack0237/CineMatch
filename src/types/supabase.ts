export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      swipe_history: {
        Row: {
          action: 'like' | 'dislike'
          id: string
          movie_genre_ids: number[]
          movie_id: number
          movie_poster_path: string | null
          movie_release_date: string | null
          movie_title: string
          movie_vote_average: number
          swiped_at: string
          user_id: string
        }
        Insert: {
          action: 'like' | 'dislike'
          id?: string
          movie_genre_ids?: number[]
          movie_id: number
          movie_poster_path?: string | null
          movie_release_date?: string | null
          movie_title: string
          movie_vote_average?: number
          swiped_at?: string
          user_id: string
        }
        Update: {
          action?: 'like' | 'dislike'
          id?: string
          movie_genre_ids?: number[]
          movie_id?: number
          movie_poster_path?: string | null
          movie_release_date?: string | null
          movie_title?: string
          movie_vote_average?: number
          swiped_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<T extends keyof DefaultSchema['Tables']> =
  DefaultSchema['Tables'][T]['Row']

export type SwipeHistory = Tables<'swipe_history'>
export type Profile = Tables<'profiles'>
export type SwipeAction = 'like' | 'dislike'
