import { Inject, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { DeleteResult } from 'mongodb';
import { CreateMailListEntryDto } from '../dtos/mailListEntry.dto';
import { MailListEntry } from '../schemas/mailListEntry.schema';

@Injectable()
export class MailListEntriesService {
  constructor(
    @Inject('MAIL_LIST_ENTRY_MODEL')
    private readonly mailListEntryModel: mongoose.Model<MailListEntry>,
  ) {}

  async create(
    mailListId: mongoose.Types.ObjectId,
    createMailListEntryDto: CreateMailListEntryDto,
  ): Promise<{
    _id: mongoose.Types.ObjectId;
    mailListId: mongoose.Types.ObjectId;
    email: string;
    isVerified: boolean;
    isUnsubscribed: boolean;
  }> {
    const result = await this.mailListEntryModel.create({
      mailListId,
      ...createMailListEntryDto,
    });

    return {
      _id: result._id as mongoose.Types.ObjectId,
      mailListId: result.mailListId as mongoose.Types.ObjectId,
      email: result.email,
      isVerified: result.isVerified,
      isUnsubscribed: result.isUnsubscribed,
    };
  }

  async find(mailListId: mongoose.Types.ObjectId): Promise<
    {
      _id: mongoose.Types.ObjectId;
      email: string;
      isVerified: boolean;
      isUnsubscribed: boolean;
    }[]
  > {
    return this.mailListEntryModel
      .find({ mailListId })
      .select<{
        _id: mongoose.Types.ObjectId;
        email: string;
        isVerified: boolean;
        isUnsubscribed: boolean;
      }>(['_id', 'email', 'isVerified', 'isUnsubscribed'])
      .lean()
      .exec();
  }

  async deleteOne(id: mongoose.Types.ObjectId): Promise<DeleteResult> {
    return this.mailListEntryModel.deleteOne({ _id: id });
  }

  async delete(mailListId: mongoose.Types.ObjectId): Promise<DeleteResult> {
    return this.mailListEntryModel.deleteMany({ mailListId });
  }
}
