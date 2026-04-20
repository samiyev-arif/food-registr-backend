import { Controller, Post, Body, Delete, HttpException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDeliverDto, LoginMarketDto } from './dto/create-auth.dto';
import DeliverGuard from 'src/guards/deliverGuard';
import MarketGuard from 'src/guards/marketGuard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('deliver-login')
  async loginDeliver(@Body() dto: LoginDeliverDto) {
    try {
      const { token, message } = await this.authService.DElogin(dto);
      return { token, message };
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Post('market-login')
  async loginMarket(@Body() dto: LoginMarketDto) {
    try {
      const { token, message } = await this.authService.MAlogin(dto);
      return { token, message };
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @ApiBearerAuth()
  @Delete('deliver-logout')
  @UseGuards(DeliverGuard)
  async logoutDeliver() {
    return { message: 'deliver logout success' };
  }

  @ApiBearerAuth()
  @Delete('market-logout')
  @UseGuards(MarketGuard)
  async logoutMarket() {
    return { message: 'market logout success' };
  }
}
