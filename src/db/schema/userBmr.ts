import { numeric, pgTable, text } from "drizzle-orm/pg-core";
import { registeredApp } from "./registered";

export const userBmr = pgTable("user_value_bmr_table", {
    id: numeric("id").primaryKey(),
    createdAt: text("created_at").notNull(),
    userName: text("user_name").notNull(),
    weight: text("weight").notNull(),
    height: text("height").notNull(),
    age: text("age").notNull(),
    tokenUser: text("token_user").notNull().references(
        () => registeredApp.id
    )
});
