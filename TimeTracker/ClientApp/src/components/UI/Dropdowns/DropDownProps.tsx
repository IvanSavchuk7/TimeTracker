import React from "react";

export interface DropDownProps {
    options: { value: any, name: string }[],
    title: string,
    onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void | null,
    register?: any
}