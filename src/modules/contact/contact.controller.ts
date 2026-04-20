import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException } from '@nestjs/common';
import { ContactService } from './contact.service';
import MarketGuard from 'src/guards/marketGuard';
import type { Request } from 'express';
import { message } from 'telegraf/filters';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { MessageDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @ApiBearerAuth()
  @UseGuards(MarketGuard)
  @Post()
  @ApiOperation({summary : `market/deliverga message yuborish`})
  async sendMessage(@Req() req : any, @Body() body: MessageDto){
    try {
      return await this.contactService.create(req.market.id, body)
    } catch (error) {
      console.log(error)
      throw new HttpException(error.message , error.status ||500)
    }
  }

  @ApiBearerAuth()
  @UseGuards(MarketGuard)
  @Get('chat')
  @ApiOperation({summary : `market/chatni ko'rish`})
  async getByOwner(
    @Req() req : any
  ){
    try {
      return await this.contactService.findOwnChat(req.market.id)
    } catch (error) {
      throw new HttpException(error.message , error.status||500)
    }
  }
}
