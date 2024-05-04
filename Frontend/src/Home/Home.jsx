import React, { useContext } from 'react';
import { Context } from '../main';
import {Navigate} from 'react-router-dom';
import {HeroSection} from "./HeroSection";
import {HowItWorks} from "./HowItWorks";
import {Popularcategories} from "./Popularcategories";
import { LogoSlider } from './LogoSlider';


const Home = () => {
    const {isAuthorized} = useContext(Context);
    if(!isAuthorized){
        return <Navigate to={"/login"} />
    }
    return (
    <section className='homePage page'>
       <HeroSection />
       <HowItWorks />
       <Popularcategories />
       <LogoSlider />

    </section>
    );
};

export default Home;