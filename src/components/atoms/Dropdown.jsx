/* eslint-disable react/prop-types */

import { useState } from "react";
import useClickOutside from '../../hook/useClickOutside';

export default function Dropdown({ children, trigger }) {
    const [show, setShow] = useState(false);
    const dropRef = useClickOutside(() => setShow(false))

    return (
        <div className="w-fit relative" ref={dropRef} onClick={() => setShow(curr => !curr)}>
            <div>{trigger}</div>
            {show && <ul className="min-w-max absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow overflow-hidden">{children}</ul>}
        </div>
    )
}

export function DropdownProfile({ children }) {
    return (
        <li className="flex gap-3 items-center pl-4 pr-8 py-2 text-gray-800 m-3 rounded-lg cursor-pointer">{children}</li>
    )
}

export function DropdownItem({ children, onClick }) {
    return (
        <li onClick={onClick} className="flex gap-3 items-center px-12 py-2 text-gray-800 hover:bg-red-50 m-3 rounded-lg cursor-pointer">{children}</li>
    )
}