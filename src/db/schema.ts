import { integer, jsonb, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export type AttemptAnswer = { q: string; c: number; a: number | null; ch: number; t: number };

export const attempts = pgTable("attempts", {
  id: serial("id").primaryKey(),
  deviceId: text("device_id").notNull(),
  mode: text("mode").notNull(),
  scope: text("scope").notNull(),
  total: integer("total").notNull(),
  correct: integer("correct").notNull(),
  durationSec: integer("duration_sec").notNull().default(0),
  answers: jsonb("answers").$type<AttemptAnswer[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: serial("id").primaryKey(),
    deviceId: text("device_id").notNull(),
    questionId: text("question_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("bookmarks_device_q").on(t.deviceId, t.questionId)],
);

export const topicNotes = pgTable(
  "topic_notes",
  {
    id: serial("id").primaryKey(),
    deviceId: text("device_id").notNull(),
    topicKey: text("topic_key").notNull(),
    body: text("body").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("notes_device_topic").on(t.deviceId, t.topicKey)],
);
