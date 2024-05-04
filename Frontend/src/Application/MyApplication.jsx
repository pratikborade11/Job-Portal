import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { jsPDF } from "jspdf";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";
import ConfirmDialog from "./ConfirmDialog"; // Import the new component


const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);


  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    try {
      if (user && user.role === "Employer") {
        axios
          .get("http://localhost:4500/api/v1/user/employer/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      } else {
        axios
          .get("http://localhost:4500/api/v1/user/jobseeker/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    navigateTo("/");
  }

  const deleteApplication = (id) => {
    try {
      axios
        .delete(`http://localhost:4500/api/v1/user/delete/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          toast.success(res.data.message);
          setApplications((prevApplication) =>
            prevApplication.filter((application) => application._id !== id)
          );
          closeConfirmDialog();

        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  // const openConfirmDialog = (id) => {
  //   setSelectedApplicationId(id);
  //   setConfirmOpen(true);
  // };

  // const closeConfirmDialog = () => {
  //   setConfirmOpen(false);
  // };

 



  return (
    <section className="my_applications page">
      {user && user.role === "Job Seeker" ? (
        <div className="container">
          <h3>My Applications</h3>
          <hr />
          {applications.length <= 0 ? (
            <>
              {" "}
              <h4>No Applications Found</h4>{" "}
            </>
          ) : (
            applications.map((element) => {
              return (
                <JobSeekerCard
                  element={element}
                  key={element._id}
                  deleteApplication={deleteApplication}
                  openModal={openModal}
                  
                />
              );
            })
          )}
        </div>
      ) : (
        <div className="container">
          <h3>Applications From Job Seekers</h3>
          <hr />
          {applications.length <= 0 ? (
            <>
              <h4>No Applications Found</h4>
            </>
          ) : (
            applications.map((element) => {
              return (
                <EmployerCard
                  element={element}
                  key={element._id}
                  openModal={openModal}
                  deleteApplication={() => openConfirmDialog(element._id)}
                  
                />
              );
            })
          )}
        </div>
      )}
      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
      )}
      
    </section>
  );
};

export default MyApplications;

const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
          <p>
            <span>Name:</span> {element.name}
          </p>
          <p>
            <span>Email:</span> {element.email}
          </p>
          <p>
            <span>Phone:</span> {element.phone}
          </p>
          <p>
            <span>Address:</span> {element.address}
          </p>
          <p>
            <span>CoverLetter:</span> {element.coverLetter}
          </p>
          <p className="status">
            <span>Status:</span>  
                {
                  element.status === "Selected" ? (
                    <span className="status-selected">{element.status}</span>
                  ) : element.status === "Rejected" ? (
                    <span className="status-rejected">{element.status}</span>

                  ) : (
                    <span className="status-applied">{element.status}</span>
                  )
                }
               
          </p>
        </div>
        <div className="resume">
        <button onClick={() => openModal(element.resume.url)}>View Resume</button>
        </div>
        <div className="btn_area">
          <button onClick={() => deleteApplication(element._id)}>
            Delete Application
          </button>
        </div>
      </div>
    </>
  );
};

const EmployerCard = ({ element, openModal }) => {
    const downloadResumeAsPdf = async (imageUrl, filename = "resume.pdf") => {
        try {
          const response = await fetch(imageUrl);
          if (!response.ok) throw new Error("Network response was not ok");
          
          const blob = await response.blob();
          const reader = new FileReader();
    
          reader.onloadend = () => {
            // Creating a new PDF and adding the image
            const pdf = new jsPDF({
              orientation: "portrait",
            });
    
            // This assumes the image is not wider than the PDF page width
            const imgProps = pdf.getImageProperties(reader.result);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(reader.result, "JPEG", 0, 0, pdfWidth, pdfHeight);
            
            // Save the PDF
            pdf.save(filename);
          };
    
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error("Failed to download the file:", error);
        }
      };
      const updateApplicationStatus = async (applicationId, newStatus) => {
        try {
          const response = await fetch(`http://localhost:4500/api/v1/user/applications/${applicationId}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
            credentials: 'include', // If you're using credentials like cookies
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
          toast.success('Update successful:', data);
          // Add any other logic after successful update, like refreshing data or showing a message
        } catch (error) {
          console.error('Error updating application status:', error.message);
          // Handle errors, possibly showing an error message to the user
        }
      };
      
        // Function to call when status change button is clicked
        const handleChangeStatus = async (newStatus) => {
          await updateApplicationStatus(element._id, newStatus);
          // Optionally refresh the applications list here to reflect the status change
        };
      
  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
          <p>
            <span>Name:</span> {element.name}
          </p>
          <p>
            <span>Email:</span> {element.email}
          </p>
          <p>
            <span>Phone:</span> {element.phone}
          </p>
          <p>
            <span>Address:</span> {element.address}
          </p>
          <p>
            <span>CoverLetter:</span> {element.coverLetter}
          </p>
        </div>
        <div className="resume">
           <button onClick={() => openModal(element.resume.url)}>View Resume</button>
        </div>
        <div className="quick-btn">
        <div className="download">
          <button  onClick={() => downloadResumeAsPdf(element.resume.url, `${element.name}_resume.pdf`)}>
            Download Resume
          </button>
        </div>
        <div className="select">
          {/* Existing buttons */}
          <button   onClick={() => handleChangeStatus('Selected')}>Select</button>
          
        </div >
        <div className="reject">
        <button  onClick={() => handleChangeStatus('Rejected')}>Reject</button>
        </div>
        </div>
      </div>
    </>
  );

      }