import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const LogoSlider= () => {
const [settings] = useState({

infinite: true,
slidesToShow: 3,
slidesToScroll: 1,
autoplay: true,
speed: 3000,
cssEase: "linear"
});
const images = [

"https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-suite-everything-you-need-know-about-google-newest-0.png", 
"https://s3-alpha.figma.com/hub/file/2747494711/resized/800x480/31b6ad5c-b404-4086-a685-89b1d5294f1c-cover.png", 
"https://www.drupal.org/files/styles/grid-4-2x/public/infosys-logo-PNG.png?itok=aCLUpIQT", 
"https://companieslogo.com/img/orig/TCS.NS-7401f1bd.png?t=1631949260",
"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/566px-Wipro_Primary_Logo_Color_RGB.svg.png",
"https://winjit.com/wp-content/uploads/2022/02/Winjit-Logo-High-Resolution.png",
"https://cdn.apna.co/employerDashboard_FE/employer_logos_2024_v1/tm.svg",
"https://cdn.apna.co/employerDashboard_FE/employer_logos_2024_v1/byjus.png",
"https://cdn.apna.co/employerDashboard_FE/employer_logos_2024_v1/paytm.svg"
];
return (
<div className="slidelogo">
<h3>TOP COMPANIES</h3>
<Slider className="Slider" {...settings}>
{images.map((image, index) => (
<div key={index} className="container">
<img src={image} alt="logo" />
</div>
))}
</Slider>
</div>
);
};