const postResolvers = require('./postResolvers');
const userResolvers = require('./userResolvers')
const commentResolvers = require('../resolvers/commentResolvers')

const resolvers = {
    Post: {
        likesCount: (parent) => parent.likes.length,
        commentsCount: (parent) => parent.comments.length
    },
    Query: {
        ...postResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentResolvers.Mutation
    }
}

module.exports = resolvers;