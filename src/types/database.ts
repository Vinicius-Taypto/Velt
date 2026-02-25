export type Database = {
  public: {
    Tables: {
      quiz_questions: {
        Row: {
          id: string;
          question: string;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          correct_answer: 'a' | 'b' | 'c' | 'd';
          points: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          correct_answer: 'a' | 'b' | 'c' | 'd';
          points?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          option_a?: string;
          option_b?: string;
          option_c?: string;
          option_d?: string;
          correct_answer?: 'a' | 'b' | 'c' | 'd';
          points?: number;
          created_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          full_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_answers: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          selected_answer: 'a' | 'b' | 'c' | 'd';
          is_correct: boolean;
          answered_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          selected_answer: 'a' | 'b' | 'c' | 'd';
          is_correct: boolean;
          answered_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          question_id?: string;
          selected_answer?: 'a' | 'b' | 'c' | 'd';
          is_correct?: boolean;
          answered_at?: string;
        };
      };
      user_scores: {
        Row: {
          id: string;
          user_id: string;
          total_score: number;
          quiz_attempts: number;
          last_quiz_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_score?: number;
          quiz_attempts?: number;
          last_quiz_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total_score?: number;
          quiz_attempts?: number;
          last_quiz_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
