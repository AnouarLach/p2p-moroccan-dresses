import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeEmailDto } from './dto/change-email.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // ✅ Profiel ophalen (deze ontbrak!)
    @UseGuards(JwtAuthGuard)
    @Get('profile')  // 👈 Deze regel toevoegen!
    async getProfile(@Request() req): Promise<User | null> {
        return this.usersService.findByEmail(req.user.email);
    }

    // Profiel updaten
    @UseGuards(JwtAuthGuard)
    @Patch('profile')
    async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
        return this.usersService.updateProfile(req.user.email, updateProfileDto);
    }

    // Wachtwoord wijzigen  
    @UseGuards(JwtAuthGuard) 
    @Patch('change-password')
    async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
        return this.usersService.changePassword(
            req.user.email,
            changePasswordDto.oldPassword,
            changePasswordDto.newPassword
        );
    }

    // E-mail wijzigen (met huidige wachtwoord)
    @UseGuards(JwtAuthGuard)
    @Patch('change-email')
    async changeEmail(@Request() req, @Body() changeEmailDto: ChangeEmailDto) {
        return this.usersService.changeEmail(
            req.user.email,
            changeEmailDto.newEmail,
            changeEmailDto.password
        );
    }
}
