import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { api } from '../services/api.js';
import logo from '../assets/yarsa-logo.jpg';

const getImageUrl = (path) => {
    if (!path) return logo;
    if (path.startsWith('http')) return path;
    return `http://localhost:5001${path}`;
};

export default function List() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const load = async (pg = 1, more = false) => {
        try {
            const res = await api.get('/api/products?page=' + pg + '&limit=20');

            setProducts((prev) =>
                more ? [...prev, ...res.data.items] : res.data.items
            );
            setPage(pg);
            setPages(res.data.pages);
        } catch (err) {
            console.log(err);
            toast.error('Failed to load products');
        }
    };

    useEffect(() => {
        load();
    }, []);

    async function del(id) {
        if (!confirm('Delete product?')) return;

        try {
            await api.delete('/api/products/' + id);
            toast.success('Product deleted');
            load();
        } catch (err) {
            console.log(err);
            toast.error('Delete failed');
        }
    }

    return (
        <>
            <h1>All Products List</h1>

            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((p) => (
                        <tr key={p._id}>
                            <td>
                                <img
                                    src={getImageUrl(p.images?.[0])}
                                    alt=""
                                    className="product-thumb"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = logo;
                                    }}
                                />
                            </td>

                            <td>{p.name}</td>
                            <td>{p.category}</td>
                            <td>${p.price}</td>
                            <td>{p.stock}</td>

                            <td className="actions">
                                <Link to={'/edit/' + p._id}>
                                    <FiEdit2 />
                                </Link>

                                <button onClick={() => del(p._id)}>
                                    <FiTrash2 />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {page < pages && (
                <button className="black" onClick={() => load(page + 1, true)}>
                    Load More
                </button>
            )}
        </>
    );
}
