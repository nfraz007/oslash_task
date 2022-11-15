import connection from "../database";
import { Shortcut } from "../models/Shortcut";
import { User } from "../models/User";
import { UserToken } from "../models/UserToken";
import { AuthService } from "../services/AuthService";
import { LoginInterface } from "../types/AuthType";

export const GetLoginUser = async () => {
  const email: string = "test@gmail.com";
  const password: string = "123456";
  const name: string = "Test User";

  await User.destroy({ truncate: true });

  await AuthService.register(email, password, name);
  const result: LoginInterface = await AuthService.login(email, password);

  return {
    id: result.user.id,
    token: result.userToken.token,
  };
};
