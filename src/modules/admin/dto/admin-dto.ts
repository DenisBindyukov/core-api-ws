import { IsBoolean, IsString } from 'class-validator';

export class Data {
  @IsString()
  id: string;

  @IsBoolean()
  value: boolean;
}