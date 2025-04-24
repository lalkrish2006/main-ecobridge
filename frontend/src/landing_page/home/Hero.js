import React from 'react';

function Hero () {
    return ( 
        <div className="position-relative ">
             <img 
                  src="media/images/ori.png" 
                  alt="Sdg17img" 
                  className="img-fluid w-100"/>
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center">
                <div className="text-center text-white">
                    <h2 className="display-4 fw-bold">Collaborate. Create. Contribute</h2>
                    <p className="lead">Your voice. Your vision. Your impact</p>
                    <a href="#learn-more" className="btn btn-outline-light mt-3">Learn More</a>
                </div>
            </div>

        </div>
    );
}

export default Hero;