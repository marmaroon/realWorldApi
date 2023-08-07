export interface UserResponseInterface {
  user: {
    id?: number;
    username: string;
    email: string;
    bio: string;
    image: string | null;
    token: string;
  };
}
