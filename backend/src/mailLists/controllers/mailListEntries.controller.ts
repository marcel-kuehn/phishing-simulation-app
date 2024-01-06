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
import { MailListsService } from '../services/mailLists.service';
import { MailListEntriesService } from '../services/mailListEntries.service';
import { CreateMailListEntryDto } from '../dtos/mailListEntry.dto';
import { ErrorTypes } from '../../constants';
import mongoose from 'mongoose';
import { ValidateMongoId } from '../../app.pipes';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { AuthUserId } from '../../auth/auth.decorators';

@Controller('mail-lists/:mailListId/entries')
export class MailListEntriesController {
  constructor(
    private readonly mailListEntriesService: MailListEntriesService,
    private readonly mailListsService: MailListsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createMailListEntryDto: CreateMailListEntryDto,
    @AuthUserId() authUserId: mongoose.Types.ObjectId,
  ) {
    return this.mailListEntriesService.create(
      authUserId,
      createMailListEntryDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async findOne(
    @Param('mailListId', ValidateMongoId) mailListId: mongoose.Types.ObjectId,
    @AuthUserId() authUserId: mongoose.Types.ObjectId,
  ): Promise<
    {
      _id: mongoose.Types.ObjectId;
      email: string;
      isVerified: boolean;
      isUnsubscribed: boolean;
    }[]
  > {
    const mailList = await this.mailListsService.findOne(mailListId);
    if (!mailList)
      throw new NotFoundException(ErrorTypes.DEPENDEND_DOCUMENT_NOT_FOUND);
    if (mailList.ownerId.toString() !== authUserId.toString())
      throw new ForbiddenException(ErrorTypes.NO_ACCESS_RIGHTS_TO_RESOURCE);

    return this.mailListEntriesService.find(mailListId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':entryId')
  async remove(
    @Param('mailListId', ValidateMongoId) mailListId: mongoose.Types.ObjectId,
    @Param('mailListId', ValidateMongoId) entryId: mongoose.Types.ObjectId,
    @AuthUserId() authUserId: mongoose.Types.ObjectId,
  ): Promise<void> {
    const mailList = await this.mailListsService.findOne(mailListId);
    if (!mailList) throw new NotFoundException(ErrorTypes.DOCUMENT_NOT_FOUND);
    if (mailList.ownerId.toString() !== authUserId.toString())
      throw new ForbiddenException(ErrorTypes.NO_ACCESS_RIGHTS_TO_RESOURCE);

    await this.mailListEntriesService.deleteOne(entryId);
  }
}
