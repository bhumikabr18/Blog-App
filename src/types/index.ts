export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  created_at: string;
};

export type Blog = {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  // Join with profiles
  author?: Profile;
};

export type Session = {
  user: {
    id: string;
    email: string;
  } | null;
};

export type AuthError = {
  message: string;
};