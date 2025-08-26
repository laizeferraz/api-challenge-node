import {drizzle} from 'drizzle-orm/node-postgres'

export const db = drizzle(process.env.DATABASE_URL, {
  //logger:true displays the executed query in the terminal 
  logger: true
})