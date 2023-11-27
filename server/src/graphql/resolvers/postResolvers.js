const Post = require('../../models/posts/post.model');
const verifyToken = require('../../utils/checkAuth');




const resolvers = {
    Query: {
        getPosts: async () => {
            try {
                const posts = await Post.find({}).sort({ createdAt: -1 });
                return posts
            } catch (error) {
                throw new Error(error)
            }
        },
        getPost: async (_, { postId }) => {
            try {
                const post = await Post.findById(postId);
                if(post) {
                    return post
                } else {
                    throw new Error("No post found")
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    },

    Mutation: {
        createPost: async (_, { body }, context) => {
            // we want to make sure that only authenticated users can create a new post
            const user = verifyToken(context);
            console.log("user: ",user);
            try {
                const newPost = new Post({
                    body: body,
                    liked: false,
                    liker: "",
                    author: user.username,
                    authorId: user.id,
                    createdAt: new Date().toISOString(),
                })
                const post = await newPost.save();
                // console.log("post: ",post);
                return post
            } catch (error) {
                throw new Error(error)
            }
        },
        deletePost: async(_, { postId }, context) => {
            const user = verifyToken(context);
            // console.log("user: ", user)
            try {
                const post = await Post.findById(postId);
                // console.log("post: ", post)
                if(!post) {
                    throw new Error("No post found")
                }
                if(post.author === user.id) {
                    await Post.findByIdAndDelete(postId);
                    return "Post deleted successfully"
                } else {
                    throw new Error("You are not allowed to delete this post")
                }
            } catch (error) {
                throw new Error(error)
            }
        },
        likePost: async (_, { postId }, context) => {
            const { id } = verifyToken(context);
            try {
                const post = await Post.findById(postId);
                if (post) {
                    const like = post.likes.find((l) => l.author.toString() === id);
                    if (like) {
                        // Unlike the post
                        post.likes = post.likes.filter((l) => l.author.toString() !== id);
                        post.liked = false;
                        post.liker = id;
                    } else {
                        // Like the post
                        post.likes.push({
                            author: id,
                            createdAt: new Date().toISOString(),
                        });
                        post.liked = true;
                        post.liker = "";
                    }
                    const updatedPost = await post.save();
                    return updatedPost.likes;
                } else {
                    throw new Error("No post found");
                }
            } catch (error) {
                throw new Error(error.message); // Make sure to throw the error message
            }
        }
    }
}

module.exports = resolvers