const { model, Schema } = require('mongoose');


const postSchema = new Schema({
    body: String,
    author: String,
    authorId: String,
    comments: [
        {
            body: String,
            author: String,
            authorName: String,
            createdAt: String
        }
    ],
    liked: Boolean,
    liker: String,
    likes: [
        {
            author: String,
            createdAt: String
        }
    ],
    createdAt: String
    
}, { timestamps: true } )


const Post = model('Post', postSchema);

module.exports = Post;