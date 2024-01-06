import { Module } from '@nestjs/common';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { campaignsProviders } from './campaigns.providers';
import { DatabaseModule } from '../database/database.module';
import { MailListsModule } from '../mailLists/mailLists.module';

@Module({
  imports: [DatabaseModule, MailListsModule],
  controllers: [CampaignsController],
  providers: [CampaignsService, ...campaignsProviders],
  exports: [CampaignsService],
})
export class CampaignsModule {}
