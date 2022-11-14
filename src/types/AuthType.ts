import { User } from "../models/User";
import { UserToken } from "../models/UserToken";

export type AuthServiceInterface = {
  register(email: string, password: string, name: string): Promise<User>;
  encryptPassword(password: string): Promise<string>;
  login(email: string, password: string): Promise<LoginInterface>;
  logout(user: User): Promise<void>;
};

export type LoginInterface = {
  user: User;
  userToken: UserToken;
};
