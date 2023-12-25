import { Mongoose } from 'mongoose';
import { MailListEntrySchema } from '../schemas/mailListEntry.schema';

export const mailListEntryProviders = [
  {
    provide: 'MAIL_LIST_ENTRY_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('MailListEntry', MailListEntrySchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
