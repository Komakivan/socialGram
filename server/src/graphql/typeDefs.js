const gql = require('graphql-tag');

const typeDefs = gql`
    type Query {
        getPosts: [Post]!
        getPost(postId: ID!): Post!
    }

    type Post {
        id: ID!
        body: String!
        author: String!
        authorId: ID!
        liked: Boolean!
        liker: ID!
        comments: [Comment]!
        likes: [Like]!
        likesCount: Int!
        commentsCount: Int!
        createdAt: String!
    }

    type Comment {
        id: ID!
        author: String!
        authorName: String!
        body: String!
        createdAt: String!
    }

    type Like {
        author: String!
        createdAt: String!
    }

    type Following {
        userId: ID!
        createdAt: String!
    }

    type Mutation {
        register(registerInput: RegisterInput): String!
        login(email: String!, password: String!): User!
        createPost(body: String!): Post!
        deletePost(postId: ID!): String!
        createComment( postId: ID!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likePost(postId: ID!): [Like]! 
        followUser(userId: ID!): Following!
        # No need for unlike post because likePost will act as atoggle to like and unlike
    }

    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }

    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        followers: [Following]!
    }

    type Subscription {
        newPost: Post!
    }
`

module.exports = typeDefs