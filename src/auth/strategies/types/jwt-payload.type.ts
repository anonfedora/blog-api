import { UserDocument } from "src/user/schemas/user.schema";

export type JwtPayloadType = {
    id: UserDocument["id"];
};
