import React, { useContext, useState } from 'react';
import { Context } from '../main';
import axios from 'axios';
import toast from "react-hot-toast";
import { Navigate , Link} from 'react-router-dom'
import { FaPencilAlt, FaRegUser } from 'react-icons/fa';
import {MdOutlineMailOutline} from "react-icons/md"
import {FaPhoneFlip} from "react-icons/fa6"
import { RiLock2Fill } from 'react-icons/ri';


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
  
    const { isAuthorized, setIsAuthorized } = useContext(Context);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
          const { data } = await axios.post(
            "http://localhost:4500/api/v1/user/login",
            { email, password, role },
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          toast.success(data.message);

          setEmail("");
          setPassword("");
          setRole("");
          setIsAuthorized(true);
        } catch (error) {
          toast.error(error.response.data.message);
        }
      };
    
    if (isAuthorized) {
        return <Navigate to={'/'} />
    }
    return (
        <>
            <div className="authPage">
                <div className="container">
                    <div className="header">
                        <h3>Login to your account</h3>
                    </div>
                    <form action="">
                        <div className="inputTag">
                            <label>Login As</label>

                            <div>
                                <select value={role} onChange={(e) => setRole(e.target.value)}>
                                    <option value="">Select Role</option>
                                    <option value="Employer">Employer</option>
                                    <option value="Job Seeker">Job Seeker</option>
                                </select>
                                <FaRegUser />
                            </div>
                        </div>

                        <div className="inputTag">
                            <label>Email</label>

                            <div>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='pratik@gmail.com' />
                                <MdOutlineMailOutline />
                            </div>
                        </div>
 
                        <div className="inputTag">
                            <label>Password</label>

                            <div>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                                <RiLock2Fill />
                            </div>
                        </div>

                        <button onClick = {handleLogin} type ="submit"> Login</button>
                        <Link to={'/register'}>Haven't registered yet?</Link>
                    </form>
                </div>
                <div className="banner">
                    <div>
                    <h5>Let's Start your journey</h5>
                    <p>Thank you for being part of our community. Your presence enriches our shared experiences. Let's continue this journey together!</p>
                    <img src="/login.png" alt="login"/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;