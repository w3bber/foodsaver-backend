import { IsNotEmpty, IsString } from "class-validator";

export class RemoveDeviceTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}