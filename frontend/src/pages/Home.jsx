import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {api} from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import Title from '../components/Title.jsx';
import heroBanner from '../assets/hero-banner.jpg';

export default function Home() {
    const [latest, setLatest] = useState([]);
    const [best, setBest] = useState([]);

    useEffect(() => {
        api.get('/api/products?limit=10').then(r => setLatest(r.data.items));
        api.get('/api/products?bestseller=true&limit=5').then(r => setBest(r.data.items));
    }, []);

    return (
        <>
            <div className="home-container">
                <Link to="/collection" className="premium-hero">
                    <img src={heroBanner} alt="YARSA collection banner" />
                </Link>
            </div>

            <Title>LATEST COLLECTIONS</Title>

            <div className="grid products">
                {latest.map(p => <ProductCard key={p._id} p={p} />)}
            </div>

            <Title>BEST SELLERS</Title>

            <div className="grid products five">
                {best.map(p => <ProductCard key={p._id} p={p} />)}
            </div>
        </>
    );
}