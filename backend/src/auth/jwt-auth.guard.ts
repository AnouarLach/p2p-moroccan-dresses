import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomRequest } from './custom-request.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<CustomRequest>();
        console.log('Incoming request headers:', request.headers);

        const authHeader = request.headers.authorization;
        if (!authHeader) {
            console.log('❌ Geen Authorization header gevonden!');
            return false;
        }

        const token = authHeader.split(' ')[1];
        console.log('🔑 Extracted token:', token);

        try {
            const decoded = this.jwtService.verify(token);
            console.log('✅ JWT decoded:', decoded);

            request.user = decoded;
            return true;
        } catch (e) {
            console.log('❌ JWT verificatie mislukt:', e.message);
            return false;
        }
    }
}