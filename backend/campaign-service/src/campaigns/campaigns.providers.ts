import { Mongoose } from 'mongoose';
import { CampaignSchema } from './campaign.schema';

export const campaignsProviders = [
  {
    provide: 'CAMPAIGN_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('Campaign', CampaignSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
