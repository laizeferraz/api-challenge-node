import z from "zod/v4"
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../../db/client.ts"
import { courses } from "../../db/schema.ts"
import { eq } from 'drizzle-orm';
import { checkJWTRequest } from "./hooks/check-jwt-request.ts";
import { getAuthenticatedUser } from "../../utils/get-authenticated-user.ts";

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/courses/:id', {
    preHandler: [
      checkJWTRequest
    ],
    schema: {
      tags: ['courses'],
      summary: 'Get a course by ID',
      description: 'This route gets a specific course by its ID.',
      params: z.object({
        id: z.uuid()
      }),
    response: {
      200: z.object({
        course:z.object({
            id: z.uuid(),
            title: z.string(),
            description: z.string().nullable()
        })
      }),
      404: z.null().describe('Course not found.')
    }
  }
}, async(request, reply) => {

  getAuthenticatedUser(request) //to guarantee that the user exists and is authenticated to have access to this route

  const courseId = request.params.id

  const result = await db
  .select()
  .from(courses)
  .where(eq(courses.id, courseId))

  //select() always returns an array, so check the length and return the first item in the array.
  if (result.length > 0) {
    return { course: result[0] }
  }

  return reply.status(404).send()
})
}