import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiShoppingBag, FiUser, FiHeart } from 'react-icons/fi';
import { api, img } from '../services/api.js';
import { useStore } from '../context/StoreContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

function StarInput({ value, onChange }) {
    return (
        <div className="star-input" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    type="button"
                    key={n}
                    className={n <= value ? 'active' : ''}
                    onClick={() => onChange(n)}
                >
                    ★
                </button>
            ))}
        </div>
    );
}

function Stars({ value = 0 }) {
    const full = Math.round(Number(value) || 0);
    return (
        <span className="big-stars">
            {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={n <= full ? 'on' : ''}>
                    ★
                </span>
            ))}
        </span>
    );
}

export default function Product() {
    const { id } = useParams();
    const [p, setP] = useState(null);
    const [rel, setRel] = useState([]);
    const [size, setSize] = useState('M');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const { add, user, toggleWish, inWish } = useStore();

    useEffect(() => {
        api.get('/api/products/' + id).then((r) => {
            setP(r.data);
            setSize(r.data.sizes?.[0] || 'M');
            api.get(
                '/api/products?category=' + r.data.category + '&limit=5'
            ).then((x) => setRel(x.data.items.filter((i) => i._id !== id)));
        });
    }, [id]);
    if (!p) return null;

    async function review(e) {
        e.preventDefault();
        if (!user || !localStorage.getItem('token'))
            return toast.error('Please login to write a review');
        try {
            const r = await api.post('/api/products/' + id + '/reviews', {
                rating,
                comment,
            });
            setP(r.data);
            setComment('');
            setRating(5);
            toast.success('Review added');
        } catch (e) {
            toast.error(e.response?.data?.message || 'Review failed');
        }
    }

    return (
        <>
            <section className="product-detail">
                <div className="thumbs">
                    {p.images.map((x, i) => (
                        <img key={i} src={img(x)} alt={p.name} />
                    ))}
                </div>
                <img className="main-img" src={img(p.images[0])} alt={p.name} />
                <div className="info">
                    <p className="product-kicker">
                        {p.category} / {p.subCategory}
                    </p>
                    <h1>{p.name}</h1>
                    <p className="stars">
                        <Stars value={p.ratingAvg} /> <b>{p.ratingAvg || 0}</b>{' '}
                        ({p.ratingCount || 0} real reviews)
                    </p>
                    <h2>Rs{p.price}</h2>
                    <p>{p.description}</p>
                    <h3>Select Size</h3>
                    <div className="sizes">
                        {p.sizes.map((s) => (
                            <button
                                key={s}
                                className={size === s ? 'active' : ''}
                                onClick={() => setSize(s)}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    <div className="product-actions">
                        <button className="black" onClick={() => add(p, size)}>
                            <FiShoppingBag /> ADD TO CART
                        </button>
                        <button
                            className={
                                'outline-wish ' +
                                (inWish(p._id) ? 'active' : '')
                            }
                            onClick={() => toggleWish(p)}
                        >
                            <FiHeart /> Wishlist
                        </button>
                    </div>
                    <ul>
                        <li>100% original product.</li>
                        <li>Cash on delivery and eSewa payment available.</li>
                        <li>Easy return and exchange within 7 days.</li>
                    </ul>
                </div>
            </section>
            <section className="reviews pro-reviews">
                <div className="reviews-summary">
                    <div>
                        <h2>Customer Reviews</h2>
                        <p>
                            Real customer ratings update instantly after
                            submission.
                        </p>
                        <div>
                            <Stars value={p.ratingAvg} />
                        </div>
                    </div>
                    <strong>
                        {p.ratingAvg || 0}
                        <span>/5</span>
                    </strong>
                </div>
                <form onSubmit={review} className="review-form pro-review-form">
                    <div className="review-rating-box">
                        <label>Your Rating</label>
                        <StarInput value={rating} onChange={setRating} />
                    </div>
                    <input
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write a helpful review for this product"
                        required
                    />
                    <button>Submit Review</button>
                </form>
                <div className="review-list">
                    {p.reviews?.length ? (
                        p.reviews.map((r) => (
                            <article key={r._id} className="review-card">
                                <div className="avatar">
                                    <FiUser />
                                </div>
                                <div>
                                    <div className="review-card-head">
                                        <b>{r.name}</b>
                                        <Stars value={r.rating} />
                                    </div>
                                    <p>{r.comment}</p>
                                    <small>
                                        {r.createdAt
                                            ? new Date(
                                                  r.createdAt
                                              ).toLocaleDateString()
                                            : ''}
                                    </small>
                                </div>
                            </article>
                        ))
                    ) : (
                        <p className="empty-review">
                            No reviews yet. Be the first customer to review this
                            item.
                        </p>
                    )}
                </div>
            </section>
            <h2 className="title">
                RELATED PRODUCTS
                <i />
            </h2>
            <div className="grid products pro-products five">
                {rel.map((x) => (
                    <ProductCard key={x._id} p={x} />
                ))}
            </div>
        </>
    );
}
