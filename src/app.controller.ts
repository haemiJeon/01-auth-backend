import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import bcrypt from 'bcrypt';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

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

    // TODO: 이미 존재하는 이메일이면 에러

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return {
      message: '회원가입 성공',
      user,
    };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return { message: '존재하지 않는 이메일입니다.' };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return { message: '비밀번호가 일치하지 않습니다.' };
    }

    return {
      message: '로그인 성공',
      user: { id: user.id, email: user.email },
    };
  }
}
