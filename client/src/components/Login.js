import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import MoonLoader from "react-spinners/BarLoader";
import toast, { Toaster } from 'react-hot-toast';
import jwt_decode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../states/AuthSlice'

// register user graphql mutaion
const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login( email: $email, password: $password ) {
            id
            token
            
        }
    }
`

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "purple",
    alignItems: "center"
  };
  

const Login = () => {
    const [values, setValues] = useState({
        email: "",
        password: "",
    })

    // const loggedInUser = useSelector(state => state.auth.user)
    // console.log(loggedInUser)

    // create a dispatch function
    const dispatch = useDispatch()

    //navigation
    const navigate = useNavigate()

    const [addUser, { loading }] = useMutation(LOGIN_USER, {
        onCompleted: (data) => {
            localStorage.setItem('token', JSON.stringify(data.login.token));
            const user = jwt_decode(data.login.token);
            console.log(new Date(user.exp))
            localStorage.setItem("user", JSON.stringify(user));
            const persistedUser = JSON.parse(localStorage.getItem("user"));
            dispatch(loginUser({ user: persistedUser, isAuthenticated: true})); // Dispatch the user to the store
            notify(); // Notify about successful login
            navigate('/home');
        },
        onError(err) {
            console.log(err.graphQLErrors[0])
        },
        variables: values
    })

    // constaclty check if a user is authenticated
    // useEffect(() => {
    //     const persistedUser = JSON.parse(localStorage.getItem("user"));
    //     if(persistedUser !== null) {
    //         dispatch(loginUser({ user: persistedUser, isAuthenticated: true}));
    //         navigate('/home');
    //     }
    // },[dispatch, navigate])

    //toast
    const notify =() => toast.success("Login successful")

    const onChange = (event) => {
            setValues({...values, [event.target.name]:event.target.value})
        }

    const onSubmit = (event) => {
        event.preventDefault()
        addUser()
        // notify()
    }


  return (
    <div className='pt-12 h-screen max-w-md mx-auto'>
        <Toaster/>
     <h2 className='text-center font-medium text-2xl text-indigo-700'>Sign in</h2>
      
      <form onSubmit={onSubmit}>
        <div className='flex mt-3 flex-col gap-1'>
            <label className='text-md text-slate-500'>emial</label>
            <input className='p-3 bg-gray-800 rounded-lg text-slate-300 border border-indigo-400 focus:outline-none' name='email' value={values.email}  type='email' placeholder='example@gmail.com' onChange={onChange}/>
        </div>
        <div className='flex mt-3 flex-col gap-1'>
            <label className='text-md text-slate-500'>password</label>
            <input className='p-3 bg-gray-900 rounded-lg text-slate-300 border border-indigo-400 focus:outline-none' name='password' value={values.password} type='password' placeholder='password' onChange={onChange}/>
        </div>
        <p className='mt-2 text-slate-500'>Don't have an account? <Link className='underline text-indigo-800' to='/register'>Register</Link></p>
        {loading? <MoonLoader
        color="purple"
        loading={loading}
        cssOverride={override}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />: <input className='py-2 mt-5 w-full px-6 bg-indigo-800 hover:bg-indigo-700 cursor-pointer text-white rounded-lg' type='submit'/>}
        
      </form>
    </div>
  )
}

export default Login
