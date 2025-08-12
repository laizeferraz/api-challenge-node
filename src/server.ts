import fastify from 'fastify';
import { createCourse } from './http/routes/create-courses.ts';
import { getCoursesList } from './http/routes/get-courses.ts';
// import crypto from 'node:crypto';

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

export const courses = [
  { id: '1', title: 'Curso de Node.js' },
  { id: '2', title: 'Curso de React' },
  { id: '3', title: 'Curso de React Native' },
]

server.register(createCourse)
server.register(getCoursesList)

// server.get('/courses', (request, reply) => {
//   return reply.send({ courses })
// })

// server.post('/courses', (request, reply) => {
//   type Body = {
//     title: string
//   }

//   const courseId = crypto.randomUUID()

//   const body = request.body as Body
//   const courseTitle = body.title

//   if (!courseTitle) {
//     return reply.status(400).send({ message: 'Título obrigatório.' })
//   }

//   courses.push({ id: courseId, title: courseTitle })

//   return reply.status(201).send({ courseId })
// })

server.get('/courses/:id', (request, reply) => {
  type Params = {
    id: string
  }

  const params = request.params as Params
  const courseId = params.id

  const course = courses.find(course => course.id === courseId)

  if (course) {
    return { course }
  }

  return reply.status(404).send()
})


server.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!')
})