import { faker } from "@faker-js/faker";
import { db } from "../../db/client.ts";
import { users } from "../../db/schema.ts";
import { randomUUID } from "node:crypto";
import { hash } from "argon2";
import jwt from "jsonwebtoken"

export async function makeUser(role?: 'admin' | 'student') {
  const passwordBeforeHash = randomUUID()
  const result = await db.insert(users).values({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: await hash(passwordBeforeHash),
    role
  }).returning()

  return {
    user: result[0],
    passwordBeforeHash
  }
}

export async function makeAuthenticatedUser(role: 'admin' | 'student') {
  const { user } = await makeUser(role)

    if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined.')
  }

  const token = jwt.sign({sub: user.id, role: user.role}, process.env.JWT_SECRET)

  return { user, token }
}