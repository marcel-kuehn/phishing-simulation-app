import { Module, forwardRef } from '@nestjs/common';
import { MailListsController } from './controllers/mailLists.controller';
import { MailListsService } from './services/mailLists.service';
import { mailListsProviders } from './providers/mailLists.providers';
import { DatabaseModule } from '../database/database.module';
import { CampaignsModule } from './../campaigns/campaigns.module';
import { mailListEntryProviders } from './providers/mailListEntry.providers';
import { MailListEntriesController } from './controllers/mailListEntries.controller';
import { MailListEntriesService } from './services/mailListEntries.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => CampaignsModule)],
  controllers: [MailListsController, MailListEntriesController],
  providers: [
    MailListsService,
    MailListEntriesService,
    ...mailListsProviders,
    ...mailListEntryProviders,
  ],
  exports: [MailListsService, MailListEntriesService],
})
export class MailListsModule {}
