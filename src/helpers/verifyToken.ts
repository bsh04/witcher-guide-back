import { TOKEN_KEY } from "../static/constants";
import { verify } from "jsonwebtoken";

export const verifyToken = (req: any, res: any, next: any) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    req.user = verify(token, TOKEN_KEY!);
  } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid Token");
  }
  return next();
};
