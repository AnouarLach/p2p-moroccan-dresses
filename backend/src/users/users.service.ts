import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async createUser(email: string, password: string, name: string, username: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.prisma.user.create({
            data: { email, password: hashedPassword, name, username }
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async updatePassword(email: string, newPassword: string): Promise<void> {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });
    }

    async setResetToken(email: string, token: string, expires: Date): Promise<void> {
        await this.prisma.user.update({
            where: { email },
            data: { resetToken: token, resetTokenExpires: expires }
        });
    }

    async findByResetToken(token: string): Promise<User | null> {
        const now = new Date();
        return this.prisma.user.findFirst({
            where: { resetToken: token, resetTokenExpires: { gt: now } }
        });
    }

    async clearResetToken(email: string): Promise<void> {
        await this.prisma.user.update({
            where: { email },
            data: { resetToken: null, resetTokenExpires: null }
        });
    }

    async updateProfile(email: string, updateData: Partial<User>): Promise<User> {
        if (updateData.username) {
            const existingUser = await this.prisma.user.findFirst({
                where: {
                    username: updateData.username,
                    email: { not: email }
                }
            });
            if (existingUser) {
                throw new Error('Deze gebruikersnaam is al in gebruik');
            }
        }

        if (updateData.phoneNumber && !/^\+?[0-9]{10,15}$/.test(updateData.phoneNumber)) {
            throw new Error('Telefoonnummer is niet geldig. Gebruik bijv. +32412345678');
        }

        return this.prisma.user.update({
            where: { email },
            data: updateData
        });
    }

    async changePassword(email: string, oldPassword: string, newPassword: string): Promise<void> {
        const user = await this.findByEmail(email);
        if (!user) throw new Error('Gebruiker niet gevonden');

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) throw new Error('Oud wachtwoord is onjuist');

        if (newPassword.length < 8) {
            throw new Error('Nieuw wachtwoord moet minstens 8 tekens bevatten');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });
    }

    async changeEmail(currentEmail: string, newEmail: string, password: string): Promise<void> {
        const user = await this.findByEmail(currentEmail);
        if (!user) throw new Error('Gebruiker niet gevonden');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Wachtwoord is onjuist');

        const existingUser = await this.findByEmail(newEmail);
        if (existingUser) {
            throw new Error('E-mailadres is al in gebruik');
        }

        await this.prisma.user.update({
            where: { email: currentEmail },
            data: { email: newEmail }
        });
    }
}
