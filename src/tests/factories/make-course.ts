import { faker } from "@faker-js/faker";
import { db } from "../../db/client.ts";
import { courses } from "../../db/schema.ts";

export async function makeCourse(title?: string) {
  const result = await db.insert(courses).values({
    title: title ?? faker.lorem.words(4)
  }).returning()

  return result[0]
}