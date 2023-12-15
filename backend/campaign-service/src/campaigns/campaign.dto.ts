import { IsInt, IsMongoId, Length, Max, Min } from 'class-validator';

export class CreateCampaignDto {
  @Length(1, 50)
  readonly name: string;

  @IsInt()
  @Min(1)
  @Max(30)
  readonly monthlyMailFrequency: number;

  @IsMongoId()
  readonly mailListId: string;
}
