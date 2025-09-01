import { db } from "./client.ts"
import { courses, enrollments, users } from "./schema.ts"
import {faker} from "@faker-js/faker"
import { hash } from "argon2"

async function seed() {

  const passwordHash = await hash('123654')

  const insertUsers = await db.insert(users).values([
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: passwordHash,
      role: 'student'
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: passwordHash,
      role: 'student'
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: passwordHash,
      role: 'student'
    },
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