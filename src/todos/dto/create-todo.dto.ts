import { IsNotEmpty, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsEmail()
  @IsNotEmpty()
  authorEmail: string;
}
