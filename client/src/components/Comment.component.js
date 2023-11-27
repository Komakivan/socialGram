import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { toast, Toaster} from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { updateCommentsCount } from '../states/AuthSlice';
import BarLoader from 'react-spinners/BarLoader';
import moment from 'moment';

// graphql to create a comment
const CREATE_COMMENT = gql`
    mutation createComment($postId: ID!, $body: String!) {
        createComment(postId: $postId, body: $body) {
                comments {
                    body
                    id
                    author
                    authorName
                    createdAt
                }
        }
    }
`

const Comment = ({ post }) => {
    const [value, setValue] = useState({ body: ""})

    // grab comments from the posts
    const comments = post.comments

    // get posts from store
    // const posts = useSelector(state => state.auth.posts)



    // a dispatch function
    const dispatch = useDispatch()


    // create a notification function
    const commentCreated = () => toast.success("Comment created")
    const errorFeedBack = () => toast.error("session expired")

    const [ createComment, { loading }] = useMutation(CREATE_COMMENT, {
        onCompleted: (data) => {
            console.log(data.createComment.comments)
            dispatch(updateCommentsCount({comments:data.createComment.comments, post: post}))
            commentCreated()
        },
        onError(err) {
            if(err.message === "TokenExpiredError: jwt expired") {
                errorFeedBack();
            }
            // console.log(err)
        }
    })

    const onSubmit = (e) => {
        e.preventDefault()
        createComment({ variables: { postId: post.id, body: value.body}})
        setValue({ body: ""})
        
    }

  return (
    <div class="mx-auto items-center justify-center p-3 mt-4 mb-4 max-w-lg">
        <Toaster/>
        {loading && <BarLoader
        color="green"
        loading={loading}
        // cssOverride={override}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />}
      
        <form onSubmit={onSubmit} className="w-full max-w-xl bg-gray-800 rounded-lg px-4 pt-2">
            <div className="flex flex-wrap -mx-3 mb-6">
                <h2 className="px-4 pt-3 pb-2 text-gray-600 text-lg">Add a new comment</h2>
                <div className="w-full md:w-full px-3 mb-2 mt-2">
                    <textarea value={value.body} className="bg-gray-800 rounded border border-gray-400 leading-normal
                     resize-none w-full h-20 py-2 text-slate-300 px-3 font-medium placeholder-gray-700 focus:outline-none"
                      name="body" placeholder='Type Your Comment' required onChange={e => setValue({body: e.target.value})}></textarea>
                </div>
                <div className="w-full flex items-start md:w-full px-3">
                    <div className="flex items-start w-1/2 text-gray-700 px-2 mr-auto">
                    </div>
                    <div className="-mr-1">
                    <input type='submit' className="bg-purple-200 rounded text-slate-700 p-1 cursor-pointer mr-1" value='Post Comment' />
                    </div>
                </div>
            </div>
      </form>
        {comments? comments.map((comment, index) => (
            <div className='mb-2 rounded grid grid-cols-2 border-indigo-200 pl-3 border-l-2 items-start gap-12' key={index}>
                <span>
                    <p className='text-slate-500 text-xs' >{comment.body}</p>
                    <p className='text-slate-400 text-sm italic py-1'>@{comment.authorName? comment.authorName: ""}</p>
                </span>
                <p className='text-slate-400 text-xs py-1'>{moment(comment.createdAt).from()}</p>
            </div>
        )): "This post has no comments"}
    </div>
  )
}

export default Comment
