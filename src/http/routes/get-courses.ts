import { courses, server } from "../../server.ts"

export function getCoursesList(){
  server.get('/courses', (request, reply) => {
    return reply.send({ courses })
  })
}
