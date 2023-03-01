// Require the framework and instantiate it
import Fastify from 'fastify';
import mercurius from 'mercurius';

const fastify = Fastify({ logger: true });

// Declare a route
fastify.get('/books', (req, reply) => {
    reply.send([
      { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
      { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
      { id: 3, title: '1984', author: 'George Orwell' },
    ])
  })

fastify.register(mercurius, {
    schema: `
        type Book {
            id: ID!
            title: String!
            author: String!
        }

        type Query {
            books: [Book!]!
        }
    `,
    resolvers: {
        Query: {
        books: async () => {
            const res = await fastify.inject({
            method: 'GET',
            url: '/books'
            })
            return res.json()
        }
        }
    }
})
  

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
};
start();