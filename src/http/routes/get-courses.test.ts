import { test, expect } from 'vitest'
import request from 'supertest'
import { server } from '../../app.ts'
import { makeCourse } from '../../tests/factories/make-course.ts'
import { faker } from '@faker-js/faker'

test('get courses', async() => {

  await server.ready()

  const title = faker.lorem.words(4)

  await makeCourse(title)

  const response = await request(server.server)
    .get(`/courses?search=${title}`)
  
  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    total: 1,
    courses: [
      {
        id: expect.any(String),
        title: title,
        enrollments: 0
      }
    ]
  })
})

//todo: test enrollments, orderby, and pagination