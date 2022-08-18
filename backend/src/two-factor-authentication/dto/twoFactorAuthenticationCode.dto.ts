import { IsNotEmpty, IsString } from 'class-validator';

export class TwoFacAuthCodeDto {
  @IsString()
  @IsNotEmpty()
  twoFacAuthCode: string;
}