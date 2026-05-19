import React from 'react';
import {Link} from 'react-router-dom';
import {FiShoppingBag, FiHeart} from 'react-icons/fi';
import {img} from '../services/api.js';
import {useStore} from '../context/StoreContext.jsx';

function Stars({value = 0}) {
    const full = Math.round(Number(value) || 0);
    return <span className="mini-stars">{[1, 2, 3, 4, 5].map(i => <span key={i}
                                                                        className={i <= full ? 'on' : ''}>★</span>)}</span>
}

export default function ProductCard({p}) {
    const {add, toggleWish, inWish} = useStore();
    const firstSize = p.sizes?.[0] || 'M';
    return <article className="product-card"><Link to={'/product/' + p._id} className="product-media"
                                                   aria-label={p.name}><img src={img(p.images?.[0])} alt={p.name}
                                                                            loading="lazy"/>{p.bestseller &&
        <span className="badge">Best Seller</span>}
        <button type="button" className={'wish ' + (inWish(p._id) ? 'active' : '')} onClick={(e) => {
            e.preventDefault();
            toggleWish(p)
        }}><FiHeart/></button>
    </Link>
        <div className="product-info"><p className="product-meta">{p.category} • {p.subCategory}</p><Link
            to={'/product/' + p._id}><h3>{p.name}</h3></Link>
            <div className="rating-row"><Stars
                value={p.ratingAvg}/><b>{p.ratingAvg || 0}</b><small>({p.ratingCount || 0})</small></div>
            <div className="price-row"><b>Rs{p.price}</b>
                <button type="button" onClick={() => add(p, firstSize)}><FiShoppingBag/> Add</button>
            </div>
        </div>
    </article>;
}
