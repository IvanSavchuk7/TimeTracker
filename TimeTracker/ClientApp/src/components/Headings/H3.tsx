import React from 'react';

export const H3 = ({ value }: { value: string }) => {
    return (
        <div>
            <h3 className="heading-text__h3">{value}</h3>
        </div>
    );
};