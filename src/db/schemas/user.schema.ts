import { pgTable, integer, text, pgEnum, uniqueIndex } from 'drizzle-orm/pg-core';
import { USER_ROLE } from '../../constants/enums';
import { timestamps } from '../helpers/column.helper';

export const roleEnum = pgEnum('role', [USER_ROLE.STUDENT, USER_ROLE.PROFESSOR]);

export const user = pgTable(
    'user',
    {
        id: integer('id').primaryKey().generatedAlwaysAsIdentity({ increment: 1, startWith: 1000 }),
        name: text('name').notNull(),
        email: text('email').notNull().unique(),
        password: text('password').notNull(),
        role: roleEnum().notNull().default(USER_ROLE.STUDENT),

        refreshToken: text('refresh_token'),
        ...timestamps,
    },
    (table) => {
        return {
            emailIdx: uniqueIndex('email_idx').on(table.email),
        };
    },
);
