import { AuthUser } from '../../interfaces/utils/auth.user.interface';

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}
