import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { CheckEmailDto } from './dto/check-email.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('check-email')
  async checkEmail(@Body() body: CheckEmailDto) {
    return this.authService.checkEmail(body.email);
  }

  @Post('signup')
  async signUp(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    const tempPassword = await this.authService.forgotPassword(body.email);
    return tempPassword;
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req: RequestWithUser) {
    return this.authService.getProfile(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('change-password')
  async changePassword(
    @Request() req: RequestWithUser,
    @Body() body: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.userId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('withdraw')
  async withdraw(
    @Request() req: RequestWithUser,
    @Body() body: { password: string },
  ) {
    return this.authService.withdraw(req.user.userId, body.password);
  }
}
