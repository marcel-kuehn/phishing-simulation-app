import { Mongoose } from 'mongoose';
import { MailListSchema } from '../schemas/mailList.schema';

export const mailListsProviders = [
  {
    provide: 'MAIL_LIST_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('MailList', MailListSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
