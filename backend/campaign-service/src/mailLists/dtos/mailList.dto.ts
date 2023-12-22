import { Length } from 'class-validator';

export class CreateMailListDto {
  @Length(1, 50)
  readonly name: string;
}
