import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const registeredApp = pgTable('registered_bmr_table', {
    id: uuid("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    userName: text("user_name").notNull(),
    password: text("password").notNull(),
    name: text("name").notNull(),
    token: varchar("token", { length: 9000 }).notNull(),
});

export type selectRegisteredAppType = InferSelectModel<typeof registeredApp>;
export type insertRegisteredAppType = InferInsertModel<typeof registeredApp>;