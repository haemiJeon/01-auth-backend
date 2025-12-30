import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import bcrypt from 'bcrypt';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('hello')
  getHelloMsg(): string {
    return '안녕하세요!';
  }

  @Post('signup')
  async signUp(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(email);
    console.log(hashedPassword);

    return {
      message: '회원가입 성공',
      userEmail: email,
      secret: hashedPassword,
    };
  }
}
