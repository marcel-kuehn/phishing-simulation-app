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
  ConflictException,
} from '@nestjs/common';
import { MailListsService } from '../services/mailLists.service';
import { CreateMailListDto } from '../dtos/mailList.dto';
import { MailList } from '../schemas/mailList.schema';
import { ErrorTypes } from '../../constants';
import mongoose from 'mongoose';
import { ValidateMongoId } from '../../app.pipes';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { AuthUserId } from '../../auth/auth.decorators';
import { CampaignsService } from '../../campaigns/campaigns.service';
import { MailListEntriesService } from '../services/mailListEntries.service';

@Controller('mail-lists')
export class MailListsController {
  constructor(
    private readonly mailListsService: MailListsService,
    @Inject(CampaignsService)
    private readonly campaignsService: CampaignsService,
    @Inject(MailListEntriesService)
    private readonly mailListEntriesService: MailListEntriesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createMailListDto: CreateMailListDto,
    @AuthUserId() authUserId: mongoose.Types.ObjectId,
  ) {
    return this.mailListsService.create(authUserId, createMailListDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', ValidateMongoId) id: mongoose.Types.ObjectId,
    @AuthUserId() authUserId: mongoose.Types.ObjectId,
  ): Promise<MailList> {
    const mailList = await this.mailListsService.findOne(id);
    if (!mailList) throw new NotFoundException(ErrorTypes.DOCUMENT_NOT_FOUND);
    if (mailList.ownerId.toString() !== authUserId.toString())
      throw new ForbiddenException(ErrorTypes.NO_ACCESS_RIGHTS_TO_RESOURCE);

    return mailList;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ValidateMongoId) id: mongoose.Types.ObjectId,
    @AuthUserId() authUserId: mongoose.Types.ObjectId,
  ): Promise<void> {
    const mailList = await this.mailListsService.findOne(id);
    if (!mailList) throw new NotFoundException(ErrorTypes.DOCUMENT_NOT_FOUND);
    if (mailList.ownerId.toString() !== authUserId.toString())
      throw new ForbiddenException(ErrorTypes.NO_ACCESS_RIGHTS_TO_RESOURCE);

    const campaigns = await this.campaignsService.find(id);
    if (campaigns.length > 0)
      throw new ConflictException(
        ErrorTypes.DELETE_BLOCKED_BY_DEPENDENT_RESOURCE,
      );

    await this.mailListEntriesService.delete(id);
    await this.mailListsService.deleteOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', ValidateMongoId) id: mongoose.Types.ObjectId,
    @Body() createMailListDto: CreateMailListDto,
    @AuthUserId() authUserId: mongoose.Types.ObjectId,
  ): Promise<MailList> {
    const mailList = await this.mailListsService.findOneAsDocument(id);
    if (!mailList) throw new NotFoundException(ErrorTypes.DOCUMENT_NOT_FOUND);
    if (mailList.toJSON().ownerId.toString() !== authUserId.toString())
      throw new ForbiddenException(ErrorTypes.NO_ACCESS_RIGHTS_TO_RESOURCE);

    return this.mailListsService.update(mailList, createMailListDto);
  }
}
