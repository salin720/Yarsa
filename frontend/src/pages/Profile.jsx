import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api.js';
import { useStore } from '../context/StoreContext.jsx';

export default function Profile() {
    const { user, setUser } = useStore();
    const [profile, setProfile] = useState(user || {});
    useEffect(() => {
        api.get('/api/auth/profile')
            .then((r) => setProfile(r.data))
            .catch(() => {});
    }, []);

    async function save(e) {
        e.preventDefault();
        const r = await api.put(
            '/api/auth/profile',
            Object.fromEntries(new FormData(e.currentTarget))
        );
        setProfile(r.data);
        setUser(r.data);
        toast.success('Profile updated');
    }

    return (
        <section className="profile">
            <h1 className="page-title">MY PROFILE</h1>
            <form onSubmit={save}>
                <input
                    name="name"
                    defaultValue={profile.name}
                    placeholder="Name"
                />
                <input name="email" defaultValue={profile.email} disabled />
                <input
                    name="phone"
                    defaultValue={profile.phone}
                    placeholder="Phone"
                />
                <textarea
                    name="address"
                    defaultValue={profile.address}
                    placeholder="Address"
                />
                <button className="black">Save Profile</button>
            </form>
        </section>
    );
}
