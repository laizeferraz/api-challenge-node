import { server } from "../../server.ts"
import { courses } from "../../db/schema.ts"
import { db } from "../../db/client.ts"

export function createCourse() {
  server.post('/courses', async(request, reply) => {
  type Body = {
    title: string
  }

  const body = request.body as Body
  const courseTitle = body.title

  if (!courseTitle) {
    return reply.status(400).send({ message: 'Title is mandatory.' })
  }

  const result = await db
  .insert(courses)
  .values({
    title: courseTitle
  })
  .returning()
  return reply.status(201).send({ courseId: result[0].id})
})
}