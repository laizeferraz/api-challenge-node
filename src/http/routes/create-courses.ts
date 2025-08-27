import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { courses } from "../../db/schema.ts"
import { db } from "../../db/client.ts"
import z from "zod/v4"

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/courses', {
    schema: {
      tags: ['courses'],
      summary: 'Create a course',
      description: 'This route receives a title and create a new course in the database.',
      body: z.object({
        title: z.string().min(5, 'Title must have at least 5 chararacters.')
      }),
      response: {
        201: z.object({courseId: z.uuid()}).describe('Course successfully created!') //to bocumented on swagger
      }
    }
  }, async(request, reply) => {

  const courseTitle = request.body.title

  const result = await db
  .insert(courses)
  .values({title: courseTitle})
  .returning()
  return reply.status(201).send({ courseId: result[0].id})
})
}