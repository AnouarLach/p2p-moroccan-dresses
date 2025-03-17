import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';  // ✅ Voeg JwtModule toe

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [
    PrismaModule, 
    JwtModule.register({  // ✅ Hier registreren we JWT
      secret: process.env.JWT_SECRET || 'your_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class UsersModule {}  // ✅ Nu is JWT beschikbaar in UsersModule!
