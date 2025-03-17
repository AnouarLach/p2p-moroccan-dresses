export class User {
    id: number;
    email: string;
    password: string;  // hashed
    name: string;
    resetToken?: string | null;
    resetTokenExpires?: Date | null;    
}
