interface User {
    name: string;
    email: string;
    password: string;
    role: string;
}

export default {
    A1: {
        name: 'A1',
        email: 'A1@email.com',
        password: 'password',
        role: 'student',
    },
    A2: {
        name: 'A2',
        email: 'A2@email.com',
        password: 'password',
        role: 'student',
    },
    P1: {
        name: 'P1',
        email: 'P1@email.com',
        password: 'password',
        role: 'professor',
    },
} as Record<string, User>;
