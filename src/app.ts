import fastify from 'fastify';
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod';
import { fastifySwagger } from '@fastify/swagger';
import { createCourseRoute } from './http/routes/create-courses.ts';
import { getCoursesListRoute } from './http/routes/get-courses.ts';
import { getCourseByIdRoute } from './http/routes/get-course-by-id.ts';
import scalarAPIReference from '@scalar/fastify-api-reference'; //use it instead of swagger ui because it has a better ui

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>()

if (process.env.NODE_ENV === 'development') {
  server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Node.js challenge',
      version: '1.0.0'
    }
  },
  transform: jsonSchemaTransform
})

server.register(scalarAPIReference, {
  routePrefix: '/docs',
  configuration: {
    theme: 'kepler'
  }
})
}

server.setSerializerCompiler(serializerCompiler) //to convert output data in a different format
server.setValidatorCompiler(validatorCompiler) //to validate entry data


server.register(createCourseRoute)
server.register(getCoursesListRoute)
server.register(getCourseByIdRoute)

export { server }