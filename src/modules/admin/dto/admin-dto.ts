import { IsString } from 'class-validator';

export class Data {
  @IsString()
  id: string;

  @IsString()
  value: string;
}