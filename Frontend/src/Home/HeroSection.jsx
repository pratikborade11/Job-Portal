import React from 'react';
import { FaBuilding, FaSuitcase, FaUsers, FaUserPlus } from "react-icons/fa";

export const HeroSection = () => {
    const details = [
        {
          id: 1,
          title: "1,23,441",
          subTitle: "Live Job",
          icon: <FaSuitcase />,
        },
        {
          id: 2,
          title: "91220",
          subTitle: "Companies",
          icon: <FaBuilding />,
        },
        {
          id: 3,
          title: "2,34,200",
          subTitle: "Job Seekers",
          icon: <FaUsers />,
        },
        {
          id: 4,
          title: "1,03,761",
          subTitle: "Employers",
          icon: <FaUserPlus />,
        },
      ];


    return (
        <div className='heroSection'>
           <div className="container">
           <div className="title">
                <h2>Step Into Your Future, </h2>
                <h2>Discover a Career You Love</h2>
                <p>Discover the Path to Your Ideal Job! Our job portal offers tailored job listings, expert career advice, and tools to help you navigate your career journey with confidence.</p>

            </div>
            <div className="image">
                <img src="/herosection.png" alt="hero" />
            </div>
           </div>
            <div className="details">
               {details.map((element) => {
            return (
              <div className="card" key={element.id}>
                <div className="icon">{element.icon}</div>
                <div className="content">
                  <p>{element.title}</p>
                  <p>{element.subTitle}</p>
                </div>
              </div>
            );
          })}
            </div>
        </div>
    );
};

