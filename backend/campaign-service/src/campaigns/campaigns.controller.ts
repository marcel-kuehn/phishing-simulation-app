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
  Put,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './campaign.dto';
import { Campaign } from './campaign.schema';
import { DeleteResult } from 'mongodb';
import { ErrorTypes } from '../constants';
import mongoose from 'mongoose';
import { ValidateMongoId } from '../app.pipes';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AuthUserId } from '../auth/auth.decorators';
import { MailListsService } from '../mailLists/services/mailLists.service';

@Controller('campaigns')
export class CampaignsController {
  constructor(
    private readonly campaignsService: CampaignsService,
    @Inject(MailListsService)
    private readonly mailListService: MailListsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createCampaignDto: CreateCampaignDto,
    @AuthUserId() authUserId: mongoose.Types.ObjectId,
  ) {
    const mailList = await this.mailListService.findOne(
      new mongoose.Types.ObjectId(createCampaignDto.mailListId),
    );
    if (!mailList)
      throw new BadRequestException(ErrorTypes.DEPENDEND_DOCUMENT_NOT_FOUND);
    if (mailList.ownerId.toString() !== authUserId.toString())
      throw new ForbiddenException(
        ErrorTypes.NO_ACCESS_RIGHTS_TO_DEPENDENT_RESOURCE,
      );

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

    return this.campaignsService.deleteOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', ValidateMongoId) id: mongoose.Types.ObjectId,
    @Body() createCampaignDto: CreateCampaignDto,
    @AuthUserId() authUserId: mongoose.Types.ObjectId,
  ): Promise<Campaign> {
    const campaign = await this.campaignsService.findOneAsDocument(id);
    if (!campaign) throw new NotFoundException(ErrorTypes.DOCUMENT_NOT_FOUND);
    if (campaign.toJSON().ownerId.toString() !== authUserId.toString())
      throw new ForbiddenException(ErrorTypes.NO_ACCESS_RIGHTS_TO_RESOURCE);

    const mailList = await this.mailListService.findOne(
      new mongoose.Types.ObjectId(createCampaignDto.mailListId),
    );
    if (!mailList)
      throw new BadRequestException(ErrorTypes.DEPENDEND_DOCUMENT_NOT_FOUND);
    if (mailList.ownerId.toString() !== authUserId.toString())
      throw new ForbiddenException(
        ErrorTypes.NO_ACCESS_RIGHTS_TO_DEPENDENT_RESOURCE,
      );

    return (
      await this.campaignsService.update(campaign, createCampaignDto)
    ).toJSON();
  }
}
