import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const registeredApp = pgTable('registered_bmr_table', {
    id: text("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    userName: text("user_name").notNull(),
    password: text("password").notNull(),
    name: text("name").notNull(),
});

export type selectRegisteredAppType = InferSelectModel<typeof registeredApp>;
export type insertRegisteredAppType = InferInsertModel<typeof registeredApp>;