import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            console.log('❌ Gebruiker niet gevonden');
            return null;
        }

        console.log(`🔍 Wachtwoord controleren voor ${email}`);
        console.log(`👉 Ingevoerde wachtwoord: ${password}`);
        console.log(`🔐 Gehashte wachtwoord uit DB: ${user.password}`);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`✅ Vergelijking resultaat:`, isMatch);

        if (!isMatch) {
            console.log('❌ Wachtwoord komt niet overeen');
            return null;
        }

        console.log('✅ Wachtwoord is correct!');
        return user;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async sendPasswordResetEmail(email: string) {
        console.log(`Reset-request gestart voor: ${email}`);

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 30 * 60 * 1000);  // 30 minuten geldig

        try {
            await this.usersService.setResetToken(email, token, expires);
            console.log(`Token gegenereerd en opgeslagen: ${token}`);
        } catch (error) {
            console.error(`Fout bij setResetToken voor ${email}:`, error);
            throw new Error('Kon reset token niet opslaan.');
        }

        const resetLink = `http://localhost:3000/reset-wachtwoord?token=${token}`;
        console.log(`Development reset link (geen email): ${resetLink}`);

        // Als je email écht wilt versturen
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            console.log(`Probeer e-mail te verzenden naar ${email}...`);

            const nodemailer = await import('nodemailer');

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            try {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Wachtwoordherstel',
                    text: `Klik hier om je wachtwoord te resetten: ${resetLink}`,
                });
                console.log(`E-mail verzonden naar ${email}`);
            } catch (error) {
                console.error(`Fout bij verzenden e-mail naar ${email}:`, error);
                throw new Error('Kon de e-mail niet versturen.');
            }
        } else {
            console.warn('EMAIL_USER of EMAIL_PASS niet ingesteld. E-mail wordt overgeslagen.');
        }
    }

    async resetPassword(token: string, newPassword: string) {
        console.log(`Reset-password gestart voor token: ${token}`);

        const user = await this.usersService.findByResetToken(token);

        if (!user) {
            console.error(`Geen user gevonden voor token: ${token}`);
            throw new BadRequestException('Invalid or expired token');
        }

        console.log(`User gevonden: ${user.email}, wachtwoord wordt aangepast`);

        await this.usersService.updatePassword(user.email, newPassword);

        await this.usersService.clearResetToken(user.email);


        console.log(`Wachtwoord succesvol aangepast voor gebruiker: ${user.email}`);
    }
}