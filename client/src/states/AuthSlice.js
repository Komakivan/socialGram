import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isAuthenticated: false,
    posts: []
}

const AuthSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        loginUser: (state, action) => {
            // console.log(action.payload)
            state.user = action.payload.user
            state.isAuthenticated = true
        },
        logOut: (state, action) => {
            state.user = null;
            state.isAuthenticated = false;
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        newPost: (state, action) => {
            state.posts = [ action.payload.post, ...state.posts]
        },
        updateLikeCount: (state, action) => {
            const { likes, post } = action.payload;
            state.posts = state.posts.map((p) => {
                if (p.id === post.id) {
                    const updatedLikes = Array.isArray(likes) ? [...likes] : [];
                    return {
                        ...p,
                        likes: updatedLikes,
                        likesCount: updatedLikes.length
                    };
                }
                return p;
            });
        },
        updateCommentsCount: (state, action) => {
            const { post, comments} = action.payload;
            const updatedPosts = state.posts.map(p => {
            if (p.id === post.id) {
                const updatedPost = {
                    ...p,
                    commentsCount: p.commentsCount + 1,
                    comments:  comments.reverse()
                };
                return updatedPost;
            }
            return p;
    });
    return { ...state, posts: updatedPosts };
        }
    }
})


export const { loginUser, logOut, setPosts, newPost, updateLikeCount, updateCommentsCount } = AuthSlice.actions;

export default AuthSlice.reducer