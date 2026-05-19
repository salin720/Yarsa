import React from 'react';
import contact from '../assets/frontend_assets/contact_img.png';

export default function Contact() {
    return <section className="about"><h1 className="page-title">CONTACT US</h1><img src={contact}/>
        <div><h2>Our Store</h2><p>Kathmandu, Nepal</p><p>Tel: +977-9800000000</p><p>Email: yarsa@gmail.com</p>
            <h2>Careers at YARSA</h2>
            <button>Explore Jobs</button>
        </div>
    </section>
}
