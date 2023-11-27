const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose');
require('dotenv').config();

//realtive import
const typeDefs = require('./src/graphql/typeDefs')
const resolvers = require('./src/graphql/resolvers/index')


const server = new ApolloServer({
    typeDefs,
    resolvers,
    // context: ({ req, res }) => ({ req })
  
})

async function startServer () {
    // wait for the database connection
    await mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log("database connection established...")
    }).catch((err) => console.log(err))
    const { url } = await startStandaloneServer(server, {
        listen: { port: 8000 },
        // this context is anything before the apollo server
        context: ({ req, res }) => ({ req })
    })
    console.log(`Server started at ${url}`)
}

startServer();
