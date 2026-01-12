import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async checkEmail(email: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    return { exists: !!existingUser };
  }

  async signUp(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return {
      message: '회원가입 성공',
      user: { email: user.email, id: user.id },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    const tempPassword = randomBytes(4).toString('hex');
    const hashedTempPassword = await bcrypt.hash(tempPassword, 10);

    await this.prisma.user.update({
      where: { email },
      data: {
        password: hashedTempPassword,
        isTemporary: true,
      },
    });

    // 실제 서비스에서는 여기서 이메일을 발송해야 합니다.
    console.log(
      `[Email 전송 시뮬레이션] 수신자: ${email}, 임시 비밀번호: ${tempPassword}`,
    );

    return {
      message:
        '임시 비밀번호가 이메일로 전송되었습니다. 확인 후 로그인해주세요.',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('존재하지 않는 이메일입니다.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      message: '로그인 성공',
      access_token: token,
      mustChangePassword: user.isTemporary,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return {
      message: '인증 성공!',
      user: {
        email: user.email,
        id: user.id,
      },
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      throw new BadRequestException('현재 비밀번호가 일치하지 않습니다.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, isTemporary: false },
    });

    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
  }
}
