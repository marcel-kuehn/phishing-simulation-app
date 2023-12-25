import { Inject, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { DeleteResult } from 'mongodb';
import { CreateMailListDto } from './../dtos/mailList.dto';
import { MailList } from './../schemas/mailList.schema';

@Injectable()
export class MailListsService {
  constructor(
    @Inject('MAIL_LIST_MODEL')
    private readonly mailListModel: mongoose.Model<MailList>,
  ) {}

  async create(
    ownerId: mongoose.Types.ObjectId,
    createMailListDto: CreateMailListDto,
  ): Promise<MailList> {
    return this.mailListModel.create({
      ownerId,
      ...createMailListDto,
    });
  }

  async update(
    mailList: mongoose.Document<MailList>,
    createMailListDto: CreateMailListDto,
  ): Promise<MailList> {
    for (const property of Object.keys(createMailListDto)) {
      mailList[property] = createMailListDto[property];
    }

    return (await mailList.save()).toJSON();
  }

  async findOne(id: mongoose.Types.ObjectId): Promise<MailList | null> {
    return this.mailListModel.findOne({ _id: id }).lean().exec();
  }

  async find(ownerId: mongoose.Types.ObjectId): Promise<MailList[]> {
    return this.mailListModel.find({ ownerId }).lean().exec();
  }

  async findOneAsDocument(id: mongoose.Types.ObjectId): Promise<mongoose.Document<MailList> | null> {
    return this.mailListModel.findOne({ _id: id })
  }

  async deleteOne(id: mongoose.Types.ObjectId): Promise<DeleteResult> {
    return this.mailListModel.deleteOne({ _id: id });
  }
}
