import React from 'react';

export default function Title({ children }) {
    return (
        <div className="section-box">
            <h2>{children}</h2>
        </div>
    );
}