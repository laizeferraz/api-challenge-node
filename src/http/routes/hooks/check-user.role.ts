import type { FastifyRequest, FastifyReply } from "fastify";
import { getAuthenticatedUser } from "../../../utils/get-authenticated-user.ts";

export function checkUserRole(role: string) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
  const user = getAuthenticatedUser(request)

  if (user.role !== role) {
    return reply.status(401).send()
  }
  }
}