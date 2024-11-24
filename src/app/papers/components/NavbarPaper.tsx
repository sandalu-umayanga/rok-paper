"use client";

import React, { useState } from "react";
import { useApplicationContext } from "./ApplicationContext";

const NavbarPaper: React.FC = () => {
    const { applicationNumber, seatNumber } = useApplicationContext();
    const [zoom, setZoom] = useState<number>(1); // State for zoom level

    // Function to handle zoom changes
    const handleZoomChange = (value: number) => {
        const newZoom = Math.max(0.5, Math.min(value, 2)); // Clamping zoom between 50% and 200%
        setZoom(newZoom);
        document.body.style.zoom = `${newZoom}`;
    };

    return (
        <div>
        {/* Navbar Section */}
        <div className="flex flex-col items-center justify-between bg-[#EEF1F4] p-2 border-b-2 border-gray-300 shadow w-full">
            {/* Top Section with Logo, Application No, and Seat No */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full px-4">
                {/* Left Section: EPS-TOPIK Logo */}
                <div className="flex flex-col md:flex-row md:items-center">
                    <h1 className="text-lg font-extrabold tracking-wide text-[#333333]">EPS-TOPIK</h1>
                </div>

                {/* Middle Section: Centered Text */}
                <div className="hidden md:flex flex-grow justify-center">
                    <span className="text-lg md:text-md text-[#333333] font-bold">
                        Test of proficiency in Korean
                    </span>
                </div>

                {/* Middle Section for Small Screens */}
                <div className="flex md:hidden justify-center my-2">
                    <span className="text-sm font-medium text-center">Test of proficiency in Korean</span>
                </div>

                {/* Right Section: Application and Seat Information with Zoom Controls */}
                <div className="flex flex-col items-center md:items-end gap-2">
                    {/* Application and Seat Number */}
                    <div className="flex items-center border border-gray-400 px-3 py-1 rounded bg-white">
                        <span className="text-xs text-[#666666] font-semibold mr-2">Application No.</span>
                        <span className="border border-gray-300 px-2 py-1 text-sm bg-gray-100">{applicationNumber}</span>
                        <span className="text-xs text-[#666666] font-semibold mx-4">Seat no.</span>
                        <span className="border border-gray-300 px-2 py-1 text-sm bg-gray-100">{seatNumber}</span>
                    </div>

                    {/* Bottom Section: Zoom Controls */}
                    <div className="flex items-center gap-2 mt-2 w-full">
                        {/* A- Zoom Button */}
                        <button
                            className="bg-[#5B9BD5] text-white px-3 py-1 rounded-full text-xs mx-1"
                            onClick={() => handleZoomChange(zoom - 0.1)} // Decrease zoom by 0.1
                        >
                            A-
                        </button>

                        {/* Zoom Slider */}
                        <div className="flex items-center flex-grow mx-2">
                            <span className="text-sm mr-1">🔍</span>
                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={zoom}
                                onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                                className="slider w-full"
                            />
                            <span className="text-sm ml-1">🔍</span>
                        </div>

                        {/* A+ Zoom Button */}
                        <button
                            className="bg-[#5B9BD5] text-white px-3 py-1 rounded-full text-xs mx-1"
                            onClick={() => handleZoomChange(zoom + 0.1)} // Increase zoom by 0.1
                        >
                            A+
                        </button>

                        {/* Zoom Dropdown */}
                        <select
                            value={zoom}
                            onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                            className="border rounded p-1 bg-white text-sm ml-2"
                        >
                            <option value={0.5}>50%</option>
                            <option value={0.75}>75%</option>
                            <option value={1}>100%</option>
                            <option value={1.25}>125%</option>
                            <option value={1.5}>150%</option>
                            <option value={1.75}>175%</option>
                            <option value={2}>200%</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default NavbarPaper;
