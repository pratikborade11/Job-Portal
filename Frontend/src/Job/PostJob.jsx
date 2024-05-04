import React, { useContext, useState } from 'react';
import { Context } from '../main';
import axios from 'axios';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const PostJob = () => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [location, setLocation] = useState("");
    const [salaryFrom, setSalaryFrom] = useState("");
    const [salaryTo, setSalaryTo] = useState("");
    const [fixedSalary, setFixedSalary] = useState("");
    const [salaryType, setSalaryType] = useState("default");

    const { isAuthorized, user } = useContext(Context);
    const navigateTo = useNavigate();

    const handleJobPost = async (e) => {
        e.preventDefault();
        if (salaryType === "Fixed Salary") {
            setSalaryFrom("");
            setSalaryTo("");
        }
        else if (salaryType === "Ranged Salary") {
            setFixedSalary("");
        }
        else {
            setSalaryFrom("");
            setSalaryTo("");
            setFixedSalary("");
        }

        await axios.post(
            "http://localhost:4500/api/v1/user/post",
            fixedSalary.length >= 4 ? {title, category,description, country, city, location, fixedSalary}
                : {title, category, country, city, location,description, salaryFrom, salaryTo},
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ).then((res) => {
        toast.success(res.data.message)
        navigateTo("/job/getall");
        }
    )
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    if (!isAuthorized || (user && user.role !== "Employer")) {
        navigateTo("/");
    }
    return (
        <>
            <div className="job_post page">
                <div className="container">
                    <h3>POST NEW JOB</h3>
                    <form action="" onSubmit={handleJobPost}>
                        <div className="wrapper">
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Job Title' />

                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="">Select Category</option>
                                <option value="Software Development">Software Development</option>
                                <option value="Web Development">Web Development</option>
                                <option value="Database Administration">Database Administration</option>
                                <option value="Network Engineering">Network Engineering</option>
                                <option value="Cyber Security">Cyber Security</option>
                                <option value="Data Science">Data Science</option>
                                <option value="Cloud Computing">Cloud Computing</option>
                                <option value="AI/Machine Learning">AI/Machine Learning</option>
                                <option value="IT Support">IT Support</option>
                                <option value="System Administration">System Administration</option>
                                <option value="Project Management">Project Management</option>
                                <option value="Quality Assurance">Quality Assurance</option>
                                <option value="UI/UX Design">UI/UX Design</option>
                                <option value="Technical Writing">Technical Writing</option>
                                <option value="IT Consulting">IT Consulting</option>
                                <option value="Blockchain Development">Blockchain Development</option>
                            </select>
                        </div>
                        <div className="wrapper">
                        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder='Country' />

                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder='City' />

                        </div>
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder='Location' />

                        <div className="salary_wrapper">
                            <select value={salaryType} onChange={(e)=>setSalaryType(e.target.value)}>
                                <option value="default">Enter Salary Type</option>
                                <option value="Fixed Salary">Fixed Salary</option>
                                <option value="Ranged Salary">Ranged Salary</option>
                            </select>
                        <div>
                        {
                            salaryType === "default" ? (<p>PleaseProvide salary type *</p>)
                                                    : 
                                                        salaryType === "Fixed Salary" ? (
                                                            <input type="number" placeholder='Enter Fixed Salary' value={fixedSalary} onChange={(e)=>setFixedSalary(e.target.value)}/>
                                                        ) : (
                                                            <div className="ranged_salary">
                                                                <input type="number" placeholder='Salary From' value={salaryFrom} onChange={(e)=>setSalaryFrom(e.target.value)}/>
                                                                <input type="number" placeholder='Salary To' value={salaryTo} onChange={(e)=>setSalaryTo(e.target.value)}/>
                                                            </div>
                                                        )
                                                    
                        }
                        </div>
                    </div>
                    <textarea rows="10" value={description} onChange={(e)=> setDescription(e.target.value)} placeholder='Enter Job Description' />

                    <button type='submit'>create Job</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PostJob;