import { Module, forwardRef } from '@nestjs/common';
import { MailListsController } from './mailLists.controller';
import { MailListsService } from './services/mailLists.service';
import { mailListsProviders } from './providers/mailLists.providers';
import { DatabaseModule } from '../database/database.module';
import { CampaignsModule } from './../campaigns/campaigns.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => CampaignsModule)],
  controllers: [MailListsController],
  providers: [MailListsService, ...mailListsProviders],
  exports: [MailListsService],
})
export class MailListsModule {}
