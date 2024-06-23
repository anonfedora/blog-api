import { SetMetadata } from "@nestjs/common";
export const PUBLIC_KEY = "isPublic";
export const ROLES_KEY = "roles";

export const Public = () => SetMetadata(PUBLIC_KEY, true);
