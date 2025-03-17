import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule, 
    UsersModule, 
    JwtModule.register({  // ✅ Voeg dit toe!
      secret: process.env.JWT_SECRET || 'your_secret_key', 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
