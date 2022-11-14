import { compare, genSalt, hash } from "bcrypt";
import { User } from "../models/User";
import { UserToken } from "../models/UserToken";
import { JwtEncode } from "../utils/JwtUtils";

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

export const AuthService = {
  async register(email: string, password: string, name: string): Promise<User> {
    if (!email) throw "email is required.";
    if (!password) throw "password is required.";
    if (!name) throw "name is required";

    // check email exist
    const users: User[] = await User.findAll({
      raw: true,
      where: {
        email,
      },
    });
    if (users.length) throw "sorry, email already exist.";

    const user: User = await User.create({
      email,
      password: await this.encryptPassword(password),
      name,
    });
    return user.toJSON();
  },
  async encryptPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return await hash(password, salt);
  },
  async login(email: string, password: string): Promise<LoginInterface> {
    if (!email) throw "email is required.";
    if (!password) throw "password is required.";

    // check email exist
    const users: User[] = await User.findAll({
      raw: true,
      where: {
        email,
      },
    });
    if (!users.length) throw "sorry, email or password is invalid.";
    const user: User = users[0];
    if (!(await compare(password, user.password)))
      throw "sorry, email or password is invalid.";

    const token: string = JwtEncode(user);
    const userToken: UserToken = await UserToken.create({
      userId: user.id,
      token,
    });

    return {
      user,
      userToken: userToken.toJSON(),
    };
  },
  async logout(user: User): Promise<void> {
    await UserToken.destroy({
      where: {
        userId: user.id,
      },
    });
  },
};
