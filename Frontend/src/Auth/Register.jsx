import React, { useContext, useState } from 'react';
import { Context } from '../main';
import axios from 'axios';
import toast from "react-hot-toast";
import { Navigate , Link} from 'react-router-dom'
import { FaPencilAlt, FaRegUser } from 'react-icons/fa';
import {MdOutlineMailOutline} from "react-icons/md"
import {FaPhoneFlip} from "react-icons/fa6"
import { RiLock2Fill } from 'react-icons/ri';


const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("");

    const { isAuthorized, setAuthorized, user, setUser } = useContext(Context);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
          const { data } = await axios.post(
            "http://localhost:4500/api/v1/user/register",
            { name, phone, email, role, password },
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          toast.success(data.message);
          setName("");
          setEmail("");
          setPassword("");
          setPhone("");
          setRole("");
          setIsAuthorized(true);
        } catch (error) {
          toast.error(error.response.data.message);
        }
      };
    
    if (isAuthorized) {
        return <Navigate to={"/"} />
    }
    return (
        <>
            <div className="authPage">
                <div className="container">
                    <div className="header">
                        <h3>Create a new account</h3>
                    </div>
                    <form action="">
                        <div className="inputTag">
                            <label>Regsiter As</label>

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
                            <label>Name</label>

                            <div>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Pratik Borade' />
                                <FaPencilAlt />
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
                            <label>Phone</label>

                            <div>
                                <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='1234567890' />
                                <FaPhoneFlip />
                            </div>
                        </div>

                        <div className="inputTag">
                            <label>Password</label>

                            <div>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                                <RiLock2Fill />
                            </div>
                        </div>

                        <button onClick = {handleRegister}  type ="submit"> Register</button>
                        <Link to={'/login'}>Login Now</Link>
                    </form>
                </div>
                <div className="banner">
                    <div>
                    <h5>Let's Start your journey</h5>
                    <p>Thank you for being part of our community. Your presence enriches our shared experiences. Let's continue this journey together!</p>
                    <img src="/register.jpeg" alt="register"/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;