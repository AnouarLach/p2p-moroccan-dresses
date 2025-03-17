import { Request } from 'express';

export interface CustomRequest extends Request {
    user?: any;  // Of je kan dit specifieker maken met jouw JWT payload type
}