import fastify from 'fastify';
import { createCourse } from './http/routes/create-courses.ts';
import { getCoursesList } from './http/routes/get-courses.ts';
import { db } from './db/client.ts';
import { courses } from './db/schema.ts';
import { eq } from 'drizzle-orm';

export const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
})

server.register(createCourse)
server.register(getCoursesList)

server.get('/courses/:id', async(request, reply) => {
  type Params = {
    id: string
  }

  const params = request.params as Params
  const courseId = params.id

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


server.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!')
})