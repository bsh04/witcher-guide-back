import { sign } from "jsonwebtoken";
import { EXPIRES_IN, TOKEN_KEY } from "../static/constants";

export const jwtSignIn = (user_id: string, login: string) => {
  if (!TOKEN_KEY) {
    return
  }
  return sign(
    { user_id, login },
    TOKEN_KEY,
    {
      expiresIn: EXPIRES_IN
    }
  );
}