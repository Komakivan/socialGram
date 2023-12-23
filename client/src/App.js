import { useEffect } from 'react';
import { Routes, Route, useNavigate} from 'react-router-dom'
import HomePage from './pages/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { useDispatch } from 'react-redux';
import { loginUser } from './states/AuthSlice';

export default function App() {

    const dispatch = useDispatch()

    const navigate = useNavigate()

      // constaclty check if a user is authenticated
      useEffect(() => {
        const persistedUser = JSON.parse(localStorage.getItem("user"));
        if(persistedUser !== null && Date.now() <= (persistedUser.exp *1000)) {
            dispatch(loginUser({ user: persistedUser, isAuthenticated: true}));
            navigate('/home');
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // navigate('/');
        }
    },[dispatch,navigate])

  return (
    <div className=' w-full'>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route element={<ProtectedRoute/>}>
          <Route path='/home' element={<HomePage/>}/>
        </Route>
      </Routes>
    </div>
  );
}