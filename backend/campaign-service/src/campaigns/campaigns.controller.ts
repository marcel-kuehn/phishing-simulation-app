import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './campaign.dto';
import { Campaign } from './campaign.schema';
import { DeleteResult } from 'mongodb';
import { ErrorTypes } from '../constants';
import mongoose from 'mongoose';
import { ValidateMongoId } from '../app.pipes';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AuthUserId } from 'src/auth/auth.decorators';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createCampaignDto: CreateCampaignDto,
    @AuthUserId() authUserId: mongoose.Types.ObjectId,
  ) {
    return this.campaignsService.create(authUserId, createCampaignDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', ValidateMongoId) id: mongoose.Types.ObjectId,
    @AuthUserId() authUserId: mongoose.Types.ObjectId,
  ): Promise<Campaign> {
    const campaign = await this.campaignsService.findOne(id);
    if (!campaign) throw new NotFoundException(ErrorTypes.DOCUMENT_NOT_FOUND);
    if (campaign.ownerId.toString() !== authUserId.toString())
      throw new ForbiddenException(ErrorTypes.NO_ACCESS_RIGHTS_TO_RESOURCE);

    return campaign;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ValidateMongoId) id: mongoose.Types.ObjectId,
    @AuthUserId() authUserId: mongoose.Types.ObjectId,
  ): Promise<DeleteResult> {
    const campaign = await this.campaignsService.findOne(id);
    if (!campaign) throw new NotFoundException(ErrorTypes.DOCUMENT_NOT_FOUND);
    if (campaign.ownerId.toString() !== authUserId.toString())
      throw new ForbiddenException(ErrorTypes.NO_ACCESS_RIGHTS_TO_RESOURCE);

    return this.campaignsService.remove(id);
  }
}
