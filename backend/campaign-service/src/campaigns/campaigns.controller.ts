import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './campaign.dto';
import { Campaign } from './campaign.schema';
import { DeleteResult } from 'mongodb';
import { ErrorTypes } from 'src/errors/errors.constants';
import { AuthUserId } from 'src/auth/auth.decorators';
import mongoose from 'mongoose';
import { ValidateMongoId } from 'src/app.pipes';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  async create(
    @AuthUserId() userId: mongoose.Types.ObjectId,
    @Body() createCampaignDto: CreateCampaignDto,
  ) {
    return this.campaignsService.create(userId, createCampaignDto);
  }

  @Get(':id')
  async findOne(
    @AuthUserId() userId: mongoose.Types.ObjectId,
    @Param('id', ValidateMongoId) id: mongoose.Types.ObjectId,
  ): Promise<Campaign> {
    const campaign = await this.campaignsService.findOne(id);
    if (!campaign) throw new NotFoundException(ErrorTypes.DOCUMENT_NOT_FOUND);
    if (campaign.ownerId.toString() !== userId.toString())
      throw new ForbiddenException(ErrorTypes.NO_ACCESS_RIGHTS_TO_RESOURCE);

    return campaign;
  }

  @Delete(':id')
  async remove(
    @AuthUserId() userId: mongoose.Types.ObjectId,
    @Param('id', ValidateMongoId) id: mongoose.Types.ObjectId,
  ): Promise<DeleteResult> {
    const campaign = await this.campaignsService.findOne(id);
    if (!campaign) throw new NotFoundException(ErrorTypes.DOCUMENT_NOT_FOUND);
    if (campaign.ownerId.toString() !== userId.toString())
      throw new ForbiddenException(ErrorTypes.NO_ACCESS_RIGHTS_TO_RESOURCE);

    return this.campaignsService.remove(id);
  }
}
