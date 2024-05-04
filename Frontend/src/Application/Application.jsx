import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../main";


const Application = () => {
    const [name, setName] = useState("");
    const [email,setEmail] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [phone,setPhone] = useState("");
    const [address,setAddress] = useState("");
    const [resume,setResume] = useState(null);

    const {isAuthorized , user} = useContext(Context);

    const navigateTo = useNavigate();

    //Function to handle file input change
    const handleFileChange = (event) =>{
        const resume = event.target.files[0];
        setResume(resume);
    };

    const {id} = useParams();

    const handleApplication = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("address", address);
        formData.append("coverLetter", coverLetter);
        formData.append("resume", resume);
        formData.append("jobId", id);
    
        try {
          const { data } = await axios.post(
            "http://localhost:4500/api/v1/user/application/post",
            formData,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setName("");
          setEmail("");
          setCoverLetter("");
          setPhone("");
          setAddress("");
          setResume("");
          toast.success(data.message);
          navigateTo("/job/getall");
        } catch (error) {
          toast.error(error.response.data.message);
        }
      };

    if(!isAuthorized || user && user.role === "Employer"){
        navigateTo("/");
    }
    return (
        
           <section className="application">
            <div className="container">
                <h3>Application Form</h3>
                <br />
                <hr />
                <form onSubmit={handleApplication}>
                    <input type="text" placeholder="Enter Name" value={name} onChange={(e)=> setName(e.target.value)}/>
                    <input type="email" placeholder="Enter Email" value={email} onChange={(e)=> setEmail(e.target.value)}/>
                    <input type="number" placeholder="Enter Mobile number" value={phone} onChange={(e)=> setPhone(e.target.value)}/>
                    <input type="text" placeholder="Enter Address" value={address} onChange={(e)=> setAddress(e.target.value)}/>
                    <textarea placeholder="Why Should we Hire you for this job?" value={coverLetter} onChange={(e)=> setCoverLetter(e.target.value)}></textarea>
                    <div>
                        <label style={{textAlign:"start", display : "block" , fontSize:"20px"}}>Upload Resume</label>
                        <input type="file"  accept=".jpg  , .png , .webp" onChange={handleFileChange} style={{width:"100%"}}/>
                    </div>
                    <button type="submit">Send Application</button>

                </form>

                </div>
                </section> 
        
    );
};

export default Application;