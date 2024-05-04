import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import toast from 'react-hot-toast';
import { FaCheck, FaCross } from 'react-icons/fa6';
import { RxCross2 } from 'react-icons/rx';
import { Context } from '../main';
import { useNavigate } from "react-router-dom";


const MyJobs = () => {
    const [myjobs, setMyJobs] = useState([]);
    const [editingMode, setEditingMode] = useState(null);

    const { isAuthorized, user } = useContext(Context);

    const navigateTo = useNavigate();

    //Fetching All Jobs of an employer
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await axios.get("http://localhost:4500/api/v1/user/getMyJobs",
                    { withCredentials: true }
                );
                setMyJobs(data.myjobs);
            } catch (error) {
                toast.error(error.message.data.message);
                setMyJobs([]);
            }
        };
        fetchJobs();
    }, []);

    if (!isAuthorized || (user && user.role !== "Employer")) {
        navigateTo("/");
    }

    //For enable ediding the job
    const handleEnableEdit = (jobId) => {
        setEditingMode(jobId);
    }

    //For disable ediding the job
    const handleDisableEdit = (jobId) => {
        setEditingMode(null);
    }

    //Function for editing the job

    const handleUpdateJob = async (jobId) => {
        const updatedJob = myjobs.find((job) => job._id === jobId);
        await axios
            .put(`http://localhost:4500/api/v1/user/updatejob/${jobId}`, updatedJob, {
                withCredentials: true,
            })
            .then((res) => {
                toast.success(res.data.message);
                setEditingMode(null);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    //For Deleteing the job
    const handleDeleteJob = async (jobId) => {
        await axios.delete(`http://localhost:4500/api/v1/user/deletejob/${jobId}`, {
            withCredentials: true,
        }).then((res) => {
            toast.success(res.data.message);
            setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
        })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    const handleInputChange = (jobId, field, value) => {
        // Update the job object in the jobs state with the new value
        setMyJobs((prevJobs) =>
            prevJobs.map((job) =>
                job._id === jobId ? { ...job, [field]: value } : job
            )
        );
    };

    return (
        <>
            <div className="myJobs page">
                <div className="container">
                    <h3>Your Posted Jobs</h3>
                     <hr />
                    {
                        myjobs.length > 0 ? (
                            <>
                                <div className="banner">
                                    {
                                        myjobs.map(element => {
                                            return (
                                                <div className="card" key={element._id}>
                                                    <div className="content">
                                                        <div className="short_fields">
                                                            <div>
                                                                <span>Title :</span>
                                                                <input type="text" disabled={editingMode !== element._id ? true : false} value={element.title} onChange={(e) => handleInputChange(element._id, "title", e.target.value)} />
                                                            </div>

                                                            <div>
                                                                <span>Country :</span>
                                                                <input type="text" disabled={editingMode !== element._id ? true : false} value={element.country} onChange={(e) => handleInputChange(element._id, "country", e.target.value)} />
                                                            </div>

                                                            <div>
                                                                <span>City :</span>
                                                                <input type="text" disabled={editingMode !== element._id ? true : false} value={element.city} onChange={(e) => handleInputChange(element._id, "city", e.target.value)} />
                                                            </div>

                                                            <div>
                                                                <span>Category :</span>
                                                                <select value={element.category} onChange={(e) => handleInputChange(element._id, "category", e.target.value)} disabled={editingMode !== element._id ? true : false}>
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

                                                            <div>
                                                                <span>Salary :{
                                                                    element.fixedSalary ? (<input type='number' value={element.fixedSalary} onChange={(e) => handleInputChange(element._id, "fixedSalary", e.target.value)} disabled={editingMode !== element._id ? true : false} />)
                                                                        : <div>
                                                                            <input type='number' value={element.salaryFrom} onChange={(e) => handleInputChange(element._id, "salaryFrom", e.target.value)} disabled={editingMode !== element._id ? true : false} />
                                                                            <input type='number' value={element.salaryTo} onChange={(e) => handleInputChange(element._id, "salaryTo", e.target.value)} disabled={editingMode !== element._id ? true : false} />
                                                                        </div>
                                                                } </span>
                                                            </div>

                                                            <div>
                                                                {" "}
                                                                <span>Expired:</span>
                                                                <select
                                                                    value={element.expired}
                                                                    onChange={(e) =>
                                                                        handleInputChange(
                                                                            element._id,
                                                                            "expired",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        editingMode !== element._id ? true : false
                                                                    }
                                                                >
                                                                    <option value={true}>TRUE</option>
                                                                    <option value={false}>FALSE</option>
                                                                </select>
                                                            </div>


                                                        </div>
                                                        <div className="long_field">
                                                            <div>
                                                                <span>Description : </span>
                                                                <textarea rows="5" disabled={editingMode !== element._id ? true : false} value={element.description} onChange={(e) => handleInputChange(element._id, "description", e.target.value)} />
                                                            </div>
                                                            <div>
                                                                <span>Location : </span>
                                                                <textarea rows="5" disabled={editingMode !== element._id ? true : false} value={element.location} onChange={(e) => handleInputChange(element._id, "location", e.target.value)} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="button_wrapper">
                                                        <div className="edit_btn_wrapper">
                                                            {
                                                                editingMode === element._id ? (
                                                                    <>
                                                                        <button onClick={() => handleUpdateJob(element._id)} className='check_btn'><FaCheck /></button>
                                                                        <button onClick={() => handleDisableEdit(element._id)} className='cross_btn'>&times;</button>

                                                                    </>
                                                                ) : (
                                                                    <button onClick={() => handleEnableEdit(element._id)} className='edit_btn'>Edit</button>
                                                                )
                                                            }
                                                        </div>
                                                        <button onClick={() => handleDeleteJob(element._id)} className='delete_btn'>Delete</button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </>
                        ) : (
                            <p>You Haven't posted any Job yet!!</p>
                        )
                    }
                </div>
            </div>
        </>
    );
};
export default MyJobs;
