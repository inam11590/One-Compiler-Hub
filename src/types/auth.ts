export interface UserProfile {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthUserSession {
  id: string;
  email: string | null;
  email_confirmed_at: string | null;
  profile: UserProfile | null;
}
