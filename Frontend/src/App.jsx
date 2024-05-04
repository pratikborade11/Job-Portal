import React , {useEffect , useContext} from 'react';
import './App.css'
import { Context } from './main'; 
import { BrowserRouter , Routes , Route } from 'react-router-dom';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Navbar from './Layout/Navbar';
import Footer from './Layout/Footer';
import Home from './Home/Home'; 
import Jobs from './Job/Jobs';
import MyJobs from './Job/MyJobs';
import JobDetails from './Job/JobDetails';
import PostJob from './Job/PostJob';
import Application from './Application/Application';
import MyApplication from './Application/MyApplication';
import NotFound from './NotFound/NotFound';
import axios from "axios";
import { Toaster } from "react-hot-toast";


const App = () => {

  const {isAuthorized , setIsAuthorized , user , setUser} = useContext(Context);

  //fetching data when user is login or authorized
  useEffect(()=>{
    const fetchUser = async()=>{
      try{
        const response =await axios.get("http://localhost:4500/api/v1/user/getuser ", {withCredentials : true});
        setUser(response.data.user);
        setIsAuthorized(true); 
      } catch(error){
        setIsAuthorized(false);
      }
    };
    fetchUser(); 
  } , [isAuthorized , setIsAuthorized, setUser]);

  return (
    <>
  <BrowserRouter>
  <Navbar />
      <Routes>
        <Route path="/login" element ={<Login />} />
        <Route path="/register" element ={<Register />} />
        <Route path="/" element ={<Home />} />
        <Route path="/job/getall" element ={<Jobs />} />
        <Route path="/job/:id" element ={<JobDetails />} />
        <Route path ="/job/post" element = {<PostJob />} />
        <Route path ="/job/me" element = {<MyJobs />} />
        <Route path="/application/:id" element ={<Application />} />
        <Route path="/application/me" element ={<MyApplication />} />
        <Route path= "*" element={<NotFound/>} />
        </Routes>
        <Footer />
        <Toaster />
  </BrowserRouter>
    </>
  );
};

export default App;