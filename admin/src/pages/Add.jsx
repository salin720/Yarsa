import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api, img } from '../services/api.js';
import uploadIcon from '../assets/yarsa-logo.jpg';

const empty = {
    name: '',
    description: '',
    price: 25,
    category: 'Men',
    subCategory: 'Topwear',
    stock: 50,
    bestseller: false,
    featured: false,
};
export default function Add({ edit = false }) {
    const { id } = useParams();
    const nav = useNavigate();
    const [form, setForm] = useState(empty);
    const [sizes, setSizes] = useState([]);
    const [files, setFiles] = useState([null, null, null, null]);
    useEffect(() => {
        if (edit && id)
            api.get('/api/products/' + id).then((r) => {
                setForm(r.data);
                setSizes(r.data.sizes || []);
            });
    }, [edit, id]);
    const change = (e) =>
        setForm({
            ...form,
            [e.target.name]:
                e.target.type === 'checkbox'
                    ? e.target.checked
                    : e.target.value,
        });

    async function submit(e) {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        fd.set('sizes', JSON.stringify(sizes));
        files.filter(Boolean).forEach((f) => fd.append('images', f));
        try {
            if (edit) {
                await api.put('/api/products/' + id, fd);
                toast.success('Product updated');
            } else {
                await api.post('/api/products', fd);
                toast.success('Product added');
                setForm(empty);
                setSizes([]);
                setFiles([null, null, null, null]);
                e.currentTarget.reset();
            }
            nav('/list');
        } catch (e) {
            toast.error(e.response?.data?.message || 'Product save failed');
        }
    }

    return (
        <form className="add" onSubmit={submit}>
            <h1>{edit ? 'Edit Product' : 'Add Product'}</h1>
            <h2>Upload Image</h2>
            <div className="uploads">
                {files.map((f, i) => (
                    <label key={i}>
                        <img
                            src={
                                f
                                    ? URL.createObjectURL(f)
                                    : form.images?.[i]
                                      ? img(form.images[i])
                                      : uploadIcon
                            }
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const a = [...files];
                                a[i] = e.target.files[0];
                                setFiles(a);
                            }}
                        />
                    </label>
                ))}
            </div>
            <label>Product name</label>
            <input name="name" value={form.name} onChange={change} required />
            <label>Product description</label>
            <textarea
                name="description"
                value={form.description}
                onChange={change}
                required
            />
            <div className="triple">
                <p>
                    <label>Product category</label>
                    <select
                        name="category"
                        value={form.category}
                        onChange={change}
                    >
                        <option>Men</option>
                        <option>Women</option>
                        <option>Kids</option>
                    </select>
                </p>
                <p>
                    <label>Sub category</label>
                    <select
                        name="subCategory"
                        value={form.subCategory}
                        onChange={change}
                    >
                        <option>Topwear</option>
                        <option>Bottomwear</option>
                        <option>Winterwear</option>
                    </select>
                </p>
                <p>
                    <label>Product Price</label>
                    <input
                        name="price"
                        type="number"
                        value={form.price}
                        onChange={change}
                    />
                </p>
                <p>
                    <label>Stock</label>
                    <input
                        name="stock"
                        type="number"
                        value={form.stock}
                        onChange={change}
                    />
                </p>
            </div>
            <label>Product Sizes</label>
            <div className="sizes">
                {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                    <button
                        key={s}
                        type="button"
                        className={sizes.includes(s) ? 'active' : ''}
                        onClick={() =>
                            setSizes(
                                sizes.includes(s)
                                    ? sizes.filter((x) => x !== s)
                                    : [...sizes, s]
                            )
                        }
                    >
                        {s}
                    </button>
                ))}
            </div>
            <label className="check">
                <input
                    name="bestseller"
                    type="checkbox"
                    checked={!!form.bestseller}
                    onChange={change}
                />{' '}
                Add to bestseller
            </label>
            <label className="check">
                <input
                    name="featured"
                    type="checkbox"
                    checked={!!form.featured}
                    onChange={change}
                />{' '}
                Featured on home
            </label>
            <button className="black">{edit ? 'UPDATE' : 'ADD'}</button>
        </form>
    );
}
