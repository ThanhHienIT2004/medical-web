import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_KEY') || 'your-secret-key',
        signOptions: { 
          expiresIn: configService.get<string>('ACCESS_TOKEN_KEY') || '1d'
        },
      }),
    }),
  ],
  providers: [AuthResolver, AuthService, PrismaService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
