import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import MoonLoader from "react-spinners/BarLoader";
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';


// register user graphql mutaion
const REGISTER_USER = gql`
    mutation register($username: String!, $email: String!, $password: String!, $confirmPassword: String!) {
        register(
            registerInput: {
                username: $username, email: $email, password: $password, confirmPassword: $confirmPassword
            }
        )
    }
`

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "purple",
    alignItems: "center"
  };
  

const Register = () => {
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        onCompleted: (data) => {
            console.log(data)
            if(data.register === "User created successfully...") {
                notify(data.register)
            }
        },
        onError(err) {
            errorNotice(err.message)
        },
        variables: values
    })

    //toast
    const notify =(val) => toast.success(val)
    const errorNotice = (val) => toast.error(val)

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
        {loading? <MoonLoader
        color="purple"
        loading={loading}
        cssOverride={override}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />: <h2 className='text-center font-medium text-2xl text-indigo-700'>Register</h2>}
      
      <form onSubmit={onSubmit}>
        <div className='flex mt-3 flex-col gap-1'>
            <label className='text-md text-slate-500'>username</label>
            <input className='p-3 bg-gray-900  rounded-lg text-slate-800 border border-indigo-400 focus:outline-none' name='username' value={values.username} type='text' placeholder='username' onChange={onChange}/>
        </div>
        <div className='flex mt-3 flex-col gap-1'>
            <label className='text-md text-slate-500'>emial</label>
            <input className='p-3 bg-gray-900  rounded-lg text-slate-800 border border-indigo-400 focus:outline-none' name='email' value={values.email}  type='email' placeholder='example@gmail.com' onChange={onChange}/>
        </div>
        <div className='flex mt-3 flex-col gap-1'>
            <label className='text-md text-slate-500'>password</label>
            <input className='p-3 bg-gray-900  rounded-lg text-slate-800 border border-indigo-400 focus:outline-none' name='password' value={values.password} type='password' placeholder='password' onChange={onChange}/>
        </div>
        <div className='flex mt-3 flex-col gap-1'>
            <label className='text-md text-slate-500'>confirmPassword</label>
            <input className='p-3 bg-gray-900  rounded-lg text-slate-800 border border-indigo-400 focus:outline-none' name='confirmPassword' value={values.confirmPassword}  type='password' placeholder='confirm password' onChange={onChange}/>
        </div>
        <p className='mt-2 text-slate-500'>Already have an account? <Link className='underline text-indigo-700' to='/'>Sign in</Link></p>
        <input className='py-2 bg-gray-900  mt-5 w-full px-6 hover:bg-indigo-500 cursor-pointer text-white rounded-lg' type='submit'/>
      </form>
    </div>
  )
}

export default Register
