import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import Title from '../components/Title.jsx';
import { api } from '../services/api.js';

const categories = ['Men', 'Women', 'Kids'];
const types = ['Topwear', 'Bottomwear', 'Winterwear'];

export default function Collection() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [filters, setFilters] = useState({
        category: '',
        subCategory: '',
        sort: '',
        search: '',
    });

    const load = async (pg = 1, more = false) => {
        const q = new URLSearchParams({ page: pg, limit: 20 });

        Object.entries(filters).forEach(([k, v]) => {
            if (v) q.set(k, v);
        });

        try {
            const r = await api.get('/api/products?' + q.toString());

            setProducts((prev) =>
                more ? [...prev, ...r.data.items] : r.data.items
            );

            setPages(r.data.pages);
            setPage(pg);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        load(1, false);
    }, [filters]);

    const choose = (name, value) =>
        setFilters((prev) => ({
            ...prev,
            [name]: prev[name] === value ? '' : value,
        }));

    return (
        <section className="collection pro-collection">
            <aside className="filters pro-filters">
                <div className="filter-head">
                    <h2>Filters</h2>
                    <button
                        onClick={() =>
                            setFilters({
                                category: '',
                                subCategory: '',
                                sort: '',
                                search: '',
                            })
                        }
                    >
                        Reset
                    </button>
                </div>

                <div className="search-box">
                    <input
                        value={filters.search}
                        placeholder="Search product..."
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                search: e.target.value,
                            })
                        }
                    />
                </div>

                <div className="filter-group">
                    <h3>Categories</h3>
                    <div className="chips">
                        {categories.map((x) => (
                            <button
                                key={x}
                                className={
                                    filters.category === x ? 'selected' : ''
                                }
                                onClick={() => choose('category', x)}
                            >
                                {x}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <h3>Type</h3>
                    <div className="chips vertical">
                        {types.map((x) => (
                            <button
                                key={x}
                                className={
                                    filters.subCategory === x ? 'selected' : ''
                                }
                                onClick={() => choose('subCategory', x)}
                            >
                                {x}
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            <div className="collection-main">
                <div className="row between collection-topbar">
                    <Title>ALL COLLECTIONS</Title>

                    <select
                        value={filters.sort}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                sort: e.target.value,
                            })
                        }
                    >
                        <option value="">Sort: Relevant</option>
                        <option value="low-high">Price: Low to High</option>
                        <option value="high-low">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                    </select>
                </div>

                <div className="grid products pro-products">
                    {products.map((p) => (
                        <ProductCard key={p._id} p={p} />
                    ))}
                </div>

                {page < pages && (
                    <button
                        className="load"
                        onClick={() => load(page + 1, true)}
                    >
                        Load More Products
                    </button>
                )}
            </div>
        </section>
    );
}
