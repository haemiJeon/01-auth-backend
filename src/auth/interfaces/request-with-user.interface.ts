export interface RequestWithUser {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}
