import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { users } from "../../db/schema.ts"
import { db } from "../../db/client.ts"
import jwt from 'jsonwebtoken'
import z from "zod/v4"
import { eq } from "drizzle-orm"
import { verify } from "argon2"

export const loginRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/login', {
    schema: {
      tags: ['auth'],
      summary: 'Login',
      description: 'This route login an user',
      body: z.object({
        email: z.email(),
        password: z.string()
      }),
      response: {
        200: z.object({ token: z.string()}),
        400: z.object({message: z.string()}),
      }
    }
  }, async(request, reply) => {

  const { email, password} = request.body

  const result = await db
  .select()
  .from(users)
  .where(eq(users.email, email))

  if(result.length === 0) {
    return reply.status(400).send({message: 'Invalid credentials.'})
  }

  const user = result[0]

  const doesPasswordsMatch = await verify(user.password, password)

  if (!doesPasswordsMatch) {
    return reply.status(400).send({message: 'Invalid credentials.'})
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined.')
  }

  const token = jwt.sign({sub: user.id, role: user.role}, process.env.JWT_SECRET)

  return reply.status(200).send({ token})
})
}