import React from 'react';

function About () {
    return ( 
<div className='container '>
  <div className='row mt-4 mb-4 align-items-center'>
    <img src="media/images/image.png" alt="sdgimgs" className='' />

    <div className='col-8'><br />
      <h2>➡ Why EcoBridge?</h2>
      <ul className="ms-5" style={{ textAlign: 'justify', fontWeight: '500' }}>
         <li>
             In a world working hard to solve climate change, poverty, and inequality, countless people and organizations are creating real solutions — but these efforts are often isolated, disconnected, or hidden.
         </li>
         <li>
             <strong>EcoBridge</strong> is designed to break down silos and help changemakers collaborate.
         </li>
         <li>
             It’s more than a platform — it’s a bridge between innovators, NGOs, companies, and governments working toward the UN Sustainable Development Goals (SDGs).
         </li>
         <li>
            It enables users to share proven ideas, get matched with like-minded partners, and track real-world impact.
         </li>
         <li>
             <b>Let’s build a more sustainable world — not separately, but in collaboration.</b>
         </li>
      </ul>

    </div>

    <div className='col-4 d-flex justify-content-center align-items-center'>
       <img src="media/images/hand.png" className="img-fluid" style={{ height: '150px', width: 'auto' }} alt="Helping hands representing global partnerships"
       />
    </div>
  </div>
  
</div>

    );
}

export default About;