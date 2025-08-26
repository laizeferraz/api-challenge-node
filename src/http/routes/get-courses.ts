import { db } from "../../db/client.ts"
import { courses } from "../../db/schema.ts"
import {server } from "../../server.ts"

export function getCoursesList(){
  server.get('/courses', async(request, reply) => {
    const result = await db.select({
      id: courses.id,
      title: courses.title
    }).from(courses) 
    return reply.send({ courses: result })
  })
}
