import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../../db/client.ts"
import { courses, enrollments } from "../../db/schema.ts"
import z from "zod/v4";
import { and, asc, count, eq, ilike, SQL } from "drizzle-orm";
import { checkJWTRequest } from "./hooks/check-jwt-request.ts";
import { checkUserRole } from "./hooks/check-user.role.ts";

export const getCoursesListRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/courses', {
    preHandler: [
      checkJWTRequest,
      checkUserRole('admin')
    ],
    schema: {
      tags: ['courses'],
      summary: 'Get all courses',
      description: 'This route gets a list of all courses.',
      querystring: z.object({
        search: z.string().optional(),
        orderBy: z.enum(['id', 'title']).optional().default('id'),
        page: z.coerce.number().optional().default(1) //everything in an URL is a string. That's the reason for using coerce here.
      }),
      response: {
        200: z.object({
          courses: z.array(
            z.object({
              id: z.uuid(),
              title: z.string(),
              enrollments: z.number()
          })),
          total: z.number(),
        })
      }
    }
  }, async(request, reply) => {
    const { search, orderBy, page } = request.query

    const conditions: SQL[] = []

    if(search) {
      conditions.push(ilike(courses.title, `%${search}%`)) //ilike is not case sensitive and where accepts undefined. The % is used to search for a specific word. It can be in the end (search for the word that starts with it) or in the begining (search for the word that ends with it). 
    }

    const [result, total] = await Promise.all([
      db
        .select({
        id: courses.id,
        title: courses.title,
        enrollments: count(enrollments.id)
        })
        .from(courses)
        .leftJoin(enrollments, eq(enrollments.courseId, courses.id))
        .orderBy(asc(courses[orderBy]))
        .offset((page - 1 ) * 2)
        .limit(10)
        .where(and(...conditions))
        .groupBy(courses.id),

      db.$count(courses, and(...conditions))//for the frontend to display how many pages/items we have. It works as a metadata. The AND to guarantee all conditions are satisfied.
    ])
    return reply.send({ courses: result, total })
  })
}
