import { compare, genSalt, hash } from "bcrypt";
import { User } from "../models/User";
import { UserToken } from "../models/UserToken";
import { AuthServiceInterface, LoginInterface } from "../types/AuthType";
import { JwtEncode } from "../utils/JwtUtils";

export const AuthService: AuthServiceInterface = {
  async register(email: string, password: string, name: string): Promise<User> {
    if (!email) throw "email is required.";
    if (
      !email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    )
      throw "email is invalid.";
    if (!password) throw "password is required.";
    if (!name) throw "name is required.";

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
    if (
      !email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    )
      throw "email is invalid.";
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
