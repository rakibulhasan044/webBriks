export interface IUser {
  id: string;
  name: string;
  email: string;
  photo: string | null;
}

export interface ILoginResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface IRegisterResponse {
  user: IUser;
}
