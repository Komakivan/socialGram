import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import ClipLoader from 'react-spinners/FadeLoader';
import {toast, Toaster} from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { newPost } from '../states/AuthSlice';

// create a new post mutation
const CREATE_POST = gql`
    mutation createPost($body: String!) {
      createPost(body: $body) {
        id
        body
        author
        authorId
        createdAt
        likes {
            author
        }
        comments {
          body
        }
      }
    }
`

const CreatePost = () => {
  const [values, setValues] = useState({ body: ""})
  const [img, setImg] = useState(null)


  // let's reconstruct the payload
  const payload = { ...values, file: img }

  const [createPost, { loading}] = useMutation(CREATE_POST, {
    onCompleted: (data) => {
      // console.log(data.createPost);
      dispatch(newPost({ post: data.createPost}))
      notify()
    },
    onError(err)  {
      if(err.message === "TokenExpiredError: jwt expired") {
        errorNotice("session expired");
      }
    },
    variables: values
  })

  //disoatch function
  const dispatch = useDispatch()


  // notifications
  const notify = () => toast.success("post created successfully")
  const errorNotice = (val) => toast.error(val)

  // form submission
    const onSubmit = (e) => {
    e.preventDefault();
        createPost();

        // reset the form
        setValues({ body: ""});
    }

    // get the body of the post
    const onChange = (e) => {
      setValues({body: e.target.value});
    }

    // handle file upload
    const onUpload = (e) => {
      const file = e.target.files[0];
      if(!file) return
      setImg(file)
      console.log(payload)
    }

  return (
    <div className='mt-3 mb-3 pt-1 pl-4 max-w-md xl:max-w-xl '>
      <Toaster/>
      <div className='text-center'>
        {loading && <ClipLoader
          color="gray"
          loading={loading}
          // cssOverride={override}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />}
      </div>
      <form onSubmit={onSubmit} className="max-w-md xl:max-w-xl bg-sate-700 rounded-lg px-4 pt-2">
            <div className="flex flex-wrap -mx-3 mb-6">
                <h2 className="px-4 pt-3 pb-2 text-gray-300 text-lg">Add a new post</h2>
                <div className="w-full md:w-full justify-between gap-1 flex px-3 mb-2 mt-2">
                  <div className=''>
                    <textarea value={values.body} className="rounded  text-gray-600 border border-gray-400 leading-normal
                     resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-500 focus:outline-none"
                      name="body" placeholder='Type something...' required onChange={onChange}></textarea>
                      <span className='flex gap-6'>
                      <input className='border p-1 rounded-md border-cyan-800' type='file' onChange={onUpload}/>
                      <input type='submit' className=" bg-purple-300 rounded text-slate-700 p-1 cursor-pointer" value='new post' />
                      </span>
                      </div>
                      <div className="-mr-1 flex">
                    </div>
                </div>
            </div>
      </form>
      {/* <form className='flex justify-between items-center gap-4' onSubmit={onSubmit}>
        <input className='border p-4 border-indigo-500 text-slate-600 font-mono w-full' value={values.body} onChange={onChange}/>
        <input className='py-2 px-6 mt-3 bg-indigo-600 text-white rounded-lg' type='submit'/>
      </form> */}
    </div>
  )
}

export default CreatePost
