import { Module } from '@nestjs/common';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { campaignsProviders } from './campaigns.providers';
import { DatabaseModule } from './../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CampaignsController],
  providers: [CampaignsService, ...campaignsProviders],
})
export class CampaignsModule {}
