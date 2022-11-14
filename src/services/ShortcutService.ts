import { compare, genSalt, hash } from "bcrypt";
import { Shortcut } from "../models/Shortcut";
import { User } from "../models/User";
import { UserToken } from "../models/UserToken";
import { JwtEncode } from "../utils/JwtUtils";

export type ShortcutServiceInterface = {
  create(
    user: User,
    shortlink: string,
    url: string,
    description: string,
    tags: string
  ): Promise<Shortcut>;
};

export type LoginInterface = {
  user: User;
  userToken: UserToken;
};

export const ShortcutService = {
  async create(
    user: User,
    shortlink: string,
    url: string,
    description: string,
    tags: string = ""
  ): Promise<Shortcut> {
    if (!user) throw "user is required.";
    if (!shortlink) throw "shortlink is required.";
    if (!url) throw "url is required.";
    if (!description) throw "description is required";

    // check shortlinks for unique
    const userId = user.id;
    const shortcuts: Shortcut[] = await Shortcut.findAll({
      raw: true,
      where: {
        userId,
      },
    });
    if (shortcuts.length) throw "sorry, shortlink should be unique.";

    const shortcut: Shortcut = await Shortcut.create({
      userId,
      shortlink,
      url,
      description,
      tags,
    });
    return shortcut.toJSON();
  },
};
