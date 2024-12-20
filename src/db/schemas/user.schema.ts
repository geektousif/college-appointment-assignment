import { pgTable, integer, text, pgEnum, uniqueIndex } from 'drizzle-orm/pg-core';
import { USER_ROLE } from '../../constants/enums';
import { timestamps } from '../helpers/column.helper';

export const roleEnum = pgEnum('role', [USER_ROLE.STUDENT, USER_ROLE.PROFESSOR]);

export const user = pgTable(
    'user',
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity({ increment: 1, startWith: 1000 }),
        name: text().notNull(),
        email: text().notNull().unique(),
        password: text().notNull(),
        role: roleEnum().notNull().default(USER_ROLE.STUDENT),
        ...timestamps,
    },
    (table) => {
        return {
            emailIdx: uniqueIndex('email_idx').on(table.email),
        };
    },
);
