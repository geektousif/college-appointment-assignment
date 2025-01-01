import { USER_ROLE } from '../../constants/enums';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: USER_ROLE;
}
