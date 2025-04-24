import React from 'react';
import Hero from './Hero';
import Events from './Events';
import About from './About';
import FeaturedProjects from './FeaturedProject';
import { BubbleChart } from './BubbleChart';

function HomePage () {
    return (
        <>
           <Hero/>
           <About/>
           <Events/>
           <BubbleChart/>
           <FeaturedProjects/>
        </>
     );
}

export default HomePage;