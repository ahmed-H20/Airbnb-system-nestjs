import { IsMongoId, IsNotEmpty } from "class-validator";
export class FollowParamDto {
    @IsMongoId()
    following: string;
}
