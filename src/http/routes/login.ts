import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { users } from "../../db/schema.ts"
import { db } from "../../db/client.ts"
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
      // response: {
      //   201: z.object({courseId: z.uuid()}).describe('Course successfully created!') //to bocumented on swagger
      // }
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

  return reply.status(200).send({ message: 'ok'})
})
}