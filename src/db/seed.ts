import { db } from "./client.ts"
import { courses, enrollments, users } from "./schema.ts"
import {faker} from "@faker-js/faker"

async function seed() {
  const insertUsers = await db.insert(users).values([
    {name: faker.person.fullName(), email: faker.internet.email()},
    {name: faker.person.fullName(), email: faker.internet.email()},
    {name: faker.person.fullName(), email: faker.internet.email()},
  ]).returning()

  const insertCourses = await db.insert(courses).values([
    {title: faker.lorem.words(4)},
    {title: faker.lorem.words(4)}
  ]).returning()

  await db.insert(enrollments).values([
    {courseId: insertCourses[0].id, userId: insertUsers[0].id},
    {courseId: insertCourses[0].id, userId: insertUsers[1].id},
    {courseId: insertCourses[1].id, userId: insertUsers[2].id}
  ])
  
}

seed()