import { test, expect } from 'vitest'
import request from 'supertest'
import { server } from '../../app.ts'
import { makeCourse } from '../../tests/factories/make-course.ts'

test('get course by id', async() => {

  await server.ready()

  const course = await makeCourse()

  const response = await request(server.server)
    .get(`/courses/${course.id}`)
  
  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    course: {
      id: expect.any(String),
      title: expect.any(String),
      description: null
    }
  })
})

test('return 404 for course not found', async() => {

  await server.ready()

  const response = await request(server.server)
    .get(`/courses/0dab9342-ec8d-4f4e-a409-d7a1fa54f336`)
  
  expect(response.status).toEqual(404)
})