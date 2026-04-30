import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import ProductCard from '../components/ProductCard.jsx';
import { useStore } from '../context/StoreContext.jsx';

export default function Wishlist(){
  const {wishlist,add,removeWish}=useStore();
  if(!wishlist.length) return <section className="wishlist-page empty-state"><FiHeart/><h1>Your wishlist is empty</h1><p>Save products you love and come back anytime.</p><Link className="black" to="/collection">Shop Collection</Link></section>;
  return <section className="wishlist-page"><div className="row between"><h1>My Wishlist</h1><Link to="/collection" className="soft-link">Continue shopping</Link></div><div className="grid products pro-products">{wishlist.map(p=><div className="wish-wrap" key={p._id}><ProductCard p={p}/><div className="wish-actions"><button onClick={()=>add(p,p.sizes?.[0]||'M')}><FiShoppingBag/> Add to Cart</button><button onClick={()=>removeWish(p._id)}><FiTrash2/> Remove</button></div></div>)}</div></section>;
}
