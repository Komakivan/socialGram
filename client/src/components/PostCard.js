import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { updateLikeCount } from '../states/AuthSlice';
import Comment from './Comment.component';

// like a post
const LIKE_POST = gql`
   mutation likePost($postId: ID!) {
        likePost(postId: $postId ) {
            # body
            # #
            # id
            # author
            # # authorId
            # likes {
                author
                createdAt
            # }
        }
    }
`

const FOLLOW_USER = gql`
    mutation followUser($userId: ID!) {
        followUser(userId: $userId) {
                userId
                createdAt
            
        }
    }
`

const PostCard = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [follwed, setFollwed] = useState(false);

    // query posts from store
    const user = useSelector(state => state.auth.user)
    // console.log(user)
    const isFollowing = user.followers?.find(user => user.userId === post.authorId)

    // const posts = useSelector(state => state.auth.posts)
    // console.log("state posts",posts)

    // dispatch function
    const dispatch = useDispatch()

    // LIKING A POST
    const [likePost] = useMutation(LIKE_POST, {
        onCompleted: (data) => {
            // console.log("data", data)
            const likes = data.likePost;
            // console.log("likes", likes)
            dispatch(updateLikeCount({ likes: likes, post: post }));
            setLiked(!liked);
        },
        onError: (err) => {
            console.log(err);
        },
        // variables: { postId },
    });

    // FOLLOW A USER
        const [followUser] = useMutation(FOLLOW_USER, {
            onCompleted: (data) => {
                console.log(data.followUser);
                setFollwed(data.followUser);
            },
            onError(err) {
                console.log(err);
            }
        })

    // function to handle following user
    const handleFollowingUser = (id) => {
        followUser({ variables: { userId: id }})
    }

    const handleLikePost = async (id) => {
        try {
            await likePost({ variables: { postId: id } })
        } catch (error) {
            console.log(error);
        }
    }

    const commentPost = () => {
        //do something
        setIsClicked(!isClicked)
    }

    return (
        <div className='max-w-md xl:max-w-xl mt-3 pt-1 pl-3 pr-3 pb-3 rounded border border-gray-400 leading-normal'>
            <span className='flex py-2 items-center justify-between'>
                <p className={`text-slate-600 inline bg-gray-400 rounded-lg w-${post.author.length} font-mono`}>@{post.author}</p>
                {user.id === post.authorId? "":<button onClick={()=>handleFollowingUser(post.authorId)} className='bg-purple-300 rounded text-slate-600 p-1'>
                     
                    {isFollowing? "following" : <ion-icon name="person-add-outline"></ion-icon>}
                    </button>}

            </span>
            <p className='text-slate-400 font-mono'>{post.body}</p>
            <div className='flex gap-5 pb-1 mt-4 text-slate-700 text-lg'>
                <span className='flex items-center gap-1'>
                    <span className='cursor-pointer text-indigo-500' onClick={() => handleLikePost(post.id)}>
                        {post.liked === false && post.liker === user.id && !liked? <ion-icon name="heart-outline"></ion-icon>: <ion-icon name="heart"></ion-icon>}
                        
                    </span>
                    <p className='text-slate-500'>{post.likes.length}</p>
                </span>
                <span className='flex items-center gap-1'>
                    <span className='cursor-pointer text-indigo-600' onClick={commentPost}>
                        <ion-icon name="chatbox-ellipses-outline"></ion-icon>
                    </span>
                    <p className='text-slate-500'>{post.commentsCount ? post.commentsCount.toString() : ""}</p>
                </span>
                <p className='text-slate-400'>{moment(post.createdAt).fromNow()}</p>
            </div>
            {isClicked && <Comment post={post} />}
        </div>
    )
}

export default PostCard;
