import React,{ useEffect } from 'react';
import { useQuery } from '@apollo/client';
import MoonLoader from "react-spinners/FadeLoader";
// import gql from 'graphql-tag'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { FETCH_POSTS } from '../graphql/queries'
import { logOut, setPosts  } from '../states/AuthSlice';
import CreatePost from '../components/createPost';


//override loader css
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "gray",
  alignItems: "center"
};



const HomePage = () => {

    const { loading, data } = useQuery(FETCH_POSTS);

    const posts = data?.getPosts;
    // console.log(posts);

    const postData = useSelector(state => state.auth.posts)
    // console.log(postData)

    //dispatch function
    const dispatch = useDispatch();

 


    //navigation
    const navigate = useNavigate();


    // listener to set posts
    useEffect(() =>{
      dispatch(setPosts({ posts: posts}))
    },[dispatch, posts]);

    

    //function to logout
    const logoutUser = () => {
      dispatch(logOut());
      localStorage.removeItem('user');
      navigate('/');
    }

  return (
    <div className='max-w-md h-screen xl:max-w-xl lg:max-w-lg mx-auto pt-10'>
        <h2 className='text-purple-300 text-2xl flex gap-6 items-center justify-center font-mono font-semibold text-center'>Apollo GraphQl<span onClick={logoutUser} className='text-red-400 cursor-pointer underline text-sm'>Sign out</span></h2>
        {/* <button onClick={() => navigate('/create-post')} className='bg-indigo-500 text-white py-2 px-6 rounded-lg'>new post</button> */}
        <CreatePost/>
        {loading && <MoonLoader
        color="gray"
        loading={loading}
        cssOverride={override}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />}
        <div className='p-4'>
           {postData? postData.map((post,index) => (
            <PostCard key={index}  post={post}/>
           )):""}
        </div>
      </div>
  )
}

export default HomePage
