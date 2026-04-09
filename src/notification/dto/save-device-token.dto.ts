import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class SaveDeviceTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsString()
  @IsIn(['ios', 'android', 'web'])
  platform: 'ios' | 'android' | 'web';
}