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

    // 비밀번호 암호화 (보안 강도: 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    return {
      message: '회원가입 성공',
      userEmail: email,
      secret: hashedPassword,
    };
  }
}
