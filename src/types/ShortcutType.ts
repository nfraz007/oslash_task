import { Shortcut } from "../models/Shortcut";
import { User } from "../models/User";
import { UserToken } from "../models/UserToken";

export type ShortcutServiceInterface = {
  create(
    user: User,
    shortlink: string,
    url: string,
    description: string,
    tags: string
  ): Promise<Shortcut>;
  getAllByUser(user: User, params: GetAllByUserParams): Promise<Shortcut[]>;
  update(user: User, id: string, data: any): Promise<void>;
  delete(user: User, id: string): Promise<void>;
};

export type GetAllByUserParams = {
  sortBy?: string;
  sortType?: string;
  search?: string;
};

export type LoginInterface = {
  user: User;
  userToken: UserToken;
};
