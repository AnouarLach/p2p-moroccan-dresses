import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetRequestDto } from './dto/reset-request.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}

    @Post('register')
    async register(@Body() dto: any) {
    console.log('🔑 Register request ontvangen:', dto);

    // Controleer of alle benodigde velden aanwezig zijn
    if (!dto.email || !dto.password || !dto.name || !dto.username) {
        console.error('❌ Fout: ontbrekende velden in request-body!', dto);
        throw new Error('❌ Fout: email, password, name en username zijn verplicht!');
    }

    console.log('✅ Alle velden correct ontvangen!');
    
    return this.usersService.createUser(dto.email, dto.password, dto.name, dto.username);
}


    @Post('login')
    async login(@Body() dto: LoginDto) {
        const user = await this.authService.validateUser(dto.email, dto.password);
        if (!user) return { message: 'Invalid credentials' };
        return this.authService.login(user);
    }

    @Post('reset-request')
    async resetRequest(@Body() dto: ResetRequestDto) {
        await this.authService.sendPasswordResetEmail(dto.email);
        return { message: 'If your email exists, you will receive a reset link.' };
    }

    @Post('reset-password')
    async resetPassword(@Body() dto: ResetPasswordDto) {
        await this.authService.resetPassword(dto.token, dto.newPassword);
        return { message: 'Password successfully updated.' };
    }
}
