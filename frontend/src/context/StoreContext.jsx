import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const C = createContext();

export const useStore = () => useContext(C);

/* ---------------- SAFE JSON ---------------- */
const safeParse = (value, fallback) => {
    try {
        return JSON.parse(value || JSON.stringify(fallback));
    } catch {
        return fallback;
    }
};

/* ---------------- USER KEY ---------------- */
const getUserKey = (user) => {
    return user?._id || user?.email || 'guest';
};

export function StoreProvider({ children }) {
    const [user, setUser] = useState(() => safeParse(localStorage.user, null));

    const currentUserKey = getUserKey(user);

    /* ---------------- CART INIT ---------------- */
    const [cart, setCart] = useState(() => {
        const savedUser = safeParse(localStorage.user, null);
        const key = getUserKey(savedUser);
        return safeParse(localStorage.getItem(`cart_${key}`), []);
    });

    /* ---------------- WISHLIST INIT ---------------- */
    const [wishlist, setWishlist] = useState(() => {
        const savedUser = safeParse(localStorage.user, null);
        const key = getUserKey(savedUser);
        return safeParse(localStorage.getItem(`wishlist_${key}`), []);
    });

    /* ---------------- SYNC ON USER CHANGE ---------------- */
    useEffect(() => {
        const key = getUserKey(user);

        setCart(safeParse(localStorage.getItem(`cart_${key}`), []));
        setWishlist(safeParse(localStorage.getItem(`wishlist_${key}`), []));
    }, [user]);

    /* ---------------- SAVE CART ---------------- */
    useEffect(() => {
        localStorage.setItem(`cart_${currentUserKey}`, JSON.stringify(cart));
    }, [cart, currentUserKey]);

    /* ---------------- SAVE WISHLIST ---------------- */
    useEffect(() => {
        localStorage.setItem(
            `wishlist_${currentUserKey}`,
            JSON.stringify(wishlist)
        );
    }, [wishlist, currentUserKey]);

    /* ---------------- SAVE USER ---------------- */
    useEffect(() => {
        if (user) {
            localStorage.user = JSON.stringify(user);
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    /* ---------------- COUNTERS ---------------- */
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    const wishCount = wishlist.length;

    /* ---------------- ADD TO CART ---------------- */
    const add = (product, size = 'M') => {
        setCart((c) => {
            const existing = c.find(
                (x) => x.product === product._id && x.size === size
            );

            if (existing) {
                return c.map((x) =>
                    x === existing ? { ...x, quantity: x.quantity + 1 } : x
                );
            }

            return [
                ...c,
                {
                    product: product._id,
                    name: product.name,

                    /* ✅ SAFE IMAGE HANDLING FIX */
                    image: Array.isArray(product.images)
                        ? product.images[0]
                        : product.images || '',

                    price: product.price,
                    size,
                    quantity: 1,
                },
            ];
        });

        toast.success('Added to cart');
    };

    /* ---------------- UPDATE CART ---------------- */
    const update = (i, q) => {
        setCart((c) =>
            c
                .map((x, idx) => (idx === i ? { ...x, quantity: +q } : x))
                .filter((x) => x.quantity > 0)
        );

        toast.info('Cart updated');
    };

    /* ---------------- REMOVE ITEM ---------------- */
    const remove = (i) => {
        setCart((c) => c.filter((_, idx) => idx !== i));
        toast.warn('Removed from cart');
    };

    /* ---------------- CLEAR CART ---------------- */
    const clear = () => setCart([]);

    /* ---------------- TOTAL PRICE ---------------- */
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    /* ---------------- WISHLIST TOGGLE ---------------- */
    const toggleWish = (p) => {
        setWishlist((w) => {
            const exists = w.some((x) => x._id === p._id);

            toast[exists ? 'info' : 'success'](
                exists ? 'Removed from wishlist' : 'Added to wishlist'
            );

            if (exists) {
                return w.filter((x) => x._id !== p._id);
            }

            return [
                {
                    _id: p._id,
                    name: p.name,
                    price: p.price,
                    images: p.images,
                    category: p.category,
                    subCategory: p.subCategory,
                    ratingAvg: p.ratingAvg,
                    ratingCount: p.ratingCount,
                    sizes: p.sizes,
                    bestseller: p.bestseller,
                },
                ...w,
            ];
        });
    };

    /* ---------------- CHECK WISHLIST ---------------- */
    const inWish = (id) => wishlist.some((x) => x._id === id);

    /* ---------------- REMOVE FROM WISHLIST ---------------- */
    const removeWish = (id) => {
        setWishlist((w) => w.filter((x) => x._id !== id));
        toast.info('Removed from wishlist');
    };

    return (
        <C.Provider
            value={{
                cart,
                count,
                add,
                update,
                remove,
                clear,
                total,
                user,
                setUser,
                wishlist,
                wishCount,
                toggleWish,
                inWish,
                removeWish,
            }}
        >
            {children}
        </C.Provider>
    );
}
