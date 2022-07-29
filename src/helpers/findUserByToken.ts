import { verify } from "jsonwebtoken";
import User from "../schemas/user";
import { UserI } from "../static/interfaces/entity";

const { TOKEN_KEY } = process.env;

export const findUserByToken = async (token: string) => {
  const jwtUser: any = verify(token, TOKEN_KEY!) as UserI | string;
  const user: UserI | null = await User.findOne({ login: jwtUser.login });
  return { user, jwtUser };
};
