import React from "react";

export default function SidebarRow({ Icon, title }) {
    return (
        <div className="flex items-center justify-center md:justify-start space-x-2 py-4 md:p-4 hover:bg-gray-200 rounded-xl cursor-pointer group whitespace-nowrap">
            <Icon className="h-8 w-8 text-gray-500 group-hover:text-blue-500" />
            <p className="hidden sm:inline-flex font-medium">{title}</p>
        </div>
    );
}
