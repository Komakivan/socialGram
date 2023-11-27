const Post = require('../../models/posts/post.model');
const verifyToken = require('../../utils/checkAuth')
const { GraphQLError } = require('graphql')


const resolver = {
    Mutation: {
        // create a new comment
        createComment: async (_, { postId, body }, context) => {
            try {
                const user = verifyToken(context)
                // console.log("user: ", user)
                const post = await Post.findById(postId);
                // console.log("post: ", post)
                if(body.trim() === '') {
                    throw new GraphQLError("Comment should not be empty")
                }
                if(post) {
                    const newComment = {
                        author: user.id,
                        body: body,
                        authorName: user.username,
                        createdAt: new Date().toISOString(),
                    }
                    post.comments.push(newComment);
                    await post.save()
                    return post
                } else {
                    throw new GraphQLError("Couldn't find a the post")
                }
            } catch (error) {
                throw new GraphQLError(error)
            }
        },
        // deleting a comment
    deleteComment: async (_, { commentId, postId }, context) => {
        const { id } = verifyToken(context);
        try {
            const post = await Post.findById(postId);
            if (post) {
                const commentIndex = post.comments.findIndex(comment => comment.id === commentId);
                if (commentIndex !== -1 && post.comments[commentIndex].author === id) {
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                } else {
                    throw new Error("Comment not found or you are not authorized to delete this comment.");
                }
                return post;
            } else {
                throw new Error("No post found");
            }
        } catch (error) {
            throw new Error(error);
        }
    },
    





    }
}

module.exports = resolver