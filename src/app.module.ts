import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: 'SECRET_KEY',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
