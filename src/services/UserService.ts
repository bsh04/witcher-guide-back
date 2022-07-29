import User from "../schemas/user";
import { jwtSignIn } from "../helpers/jwtSignIn";
import bcrypt from "bcrypt";
import { UserI, ViewUserI } from "../static/interfaces/entity";

export class UserService {
  async registration(data: UserI): Promise<ViewUserI> {
    const { password, login } = data;

    if (!password) {
      throw new Error("bad params");
    }

    const isExistUser = await User.findOne({login}) !== null;
    if (isExistUser) {
      throw new Error("Exist user with this login");
    }

    const user = new User({
      password,
      login,
    });

    user.token = jwtSignIn(String(user._id), login);

    await user.save();

    return {
      login,
      token: user.token,
      id: user.id,
    }
  }

  async login(data: UserI) {
    const { login, password } = data;

    if (!(login && password)) {
      throw new Error("bad params");
    }

    const user = await User.findOne({ login });

    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new Error("Incorrect login or password");
    }

    user.token = jwtSignIn(String(user._id), login);

    return {
      login,
      token: user.token,
      id: user.id,
    }
  }

  async getUsers(): Promise<Array<ViewUserI>> {
    const users: Array<UserI> = await User.find({})
    return users.map((item) => ({login: item.login, id: item.id}))
  }
}