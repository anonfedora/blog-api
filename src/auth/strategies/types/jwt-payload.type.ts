import { UserDocument } from "src/user/schemas/user.schema";

export type JwtPayloadType = {
  sub: UserDocument["id"];
  username: UserDocument["username"];
  role: UserDocument["role"];
};
