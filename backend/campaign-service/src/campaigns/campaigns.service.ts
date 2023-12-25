import { Inject, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { DeleteResult } from 'mongodb';
import { CreateCampaignDto } from './campaign.dto';
import { Campaign } from './campaign.schema';

@Injectable()
export class CampaignsService {
  constructor(
    @Inject('CAMPAIGN_MODEL')
    private readonly campaignModel: mongoose.Model<Campaign>,
  ) {}

  async create(
    ownerId: mongoose.Types.ObjectId,
    createCampaignDto: CreateCampaignDto,
  ): Promise<Campaign> {
    return this.campaignModel.create({
      ownerId,
      ...createCampaignDto,
    });
  }

  async update(
    campaign: mongoose.Document<Campaign>,
    createCampaignDto: CreateCampaignDto,
  ): Promise<mongoose.Document<Campaign>> {
    for (const property of Object.keys(createCampaignDto)) {
      campaign[property] = createCampaignDto[property];
    }

    return await campaign.save();
  }

  async findOne(id: mongoose.Types.ObjectId): Promise<Campaign | null> {
    return this.campaignModel.findOne({ _id: id }).lean().exec();
  }

  async findOneAsDocument(
    id: mongoose.Types.ObjectId,
  ): Promise<mongoose.Document<Campaign> | null> {
    return this.campaignModel.findOne({ _id: id });
  }

  async deleteOne(id: mongoose.Types.ObjectId): Promise<DeleteResult> {
    return this.campaignModel.deleteOne({ _id: id });
  }

  async find(mailListId: mongoose.Types.ObjectId): Promise<Campaign[]> {
    return this.campaignModel.find({ mailListId }).lean().exec();
  }
}
