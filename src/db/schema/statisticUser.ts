import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, serial, text, varchar, real, integer, timestamp } from "drizzle-orm/pg-core";

export const statisticUserApp = pgTable('statistic_user', {
    id: serial('id').primaryKey(),
    token: varchar('token', { length: 255 }).notNull(),
    email: text('email').notNull(),
    name: text('name').notNull(),

    // Liste / Array in Postgres con Drizzle (.array())
    list_weight: real('list_weight').array().notNull(),
    list_height: real('list_height').array().notNull(),
    list_age: integer('list_age').array().notNull(),
    list_activity: text('list_activity').array().notNull(),
    list_bmr: real('list_bmr').array().notNull(),

    // Medie numeriche
    average_weight: real('average_weight').notNull(),
    average_height: real('average_height').notNull(),
    average_age: integer('average_age').notNull(),
    average_activity: text('average_activity').notNull(),
    average_bmr: real('average_bmr').notNull(),

    // Data e ordinamento
    creations_date: timestamp('creations_date', { withTimezone: true }).notNull().defaultNow(),
    list_order: integer('list_order').array().notNull(),
});

// Tipi TypeScript utili da usare nelle tue Server Actions o API Routes di Next.js
export type StatisticUser = InferSelectModel<typeof statisticUserApp>;
export type NewStatisticUser = InferInsertModel<typeof statisticUserApp>;