"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Temp events data
const events = [
  {
    id: 1,
    title: "lorem ipsum dolor",
    time: "12.00 PM - 2.00 PM",
    description: "Lorem ipsum sit ament, cn elite",
  },
];

const CalendarComponent = () => {
  const [value, onChange] = useState<Date | null>(new Date());
  const [userRole, setUserRole] = useState<string | null>(null);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://localhost:8080/api/v1/auth/role", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user role");
        }

        const role = await response.text();
        setUserRole(role);
        setCanEdit(role !== "STUDENT"); // Allow edit only if the role is not STUDENT
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  const handleEdit = (eventId: number) => {
    alert(`Edit Event ${eventId}`);
  };

  return (
    <div className="bg-white p-4 rounded-md">
      <Calendar onChange={onChange} value={value} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Events</h1>
        <Image src="/moreDark.png" alt="More Options" height={20} width={20} />
      </div>
      <div className="flex flex-col gap-4">
        {events.map((event) => (
          <div
            className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
            key={event.id}
          >
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-gray-600">{event.title}</h1>
              <span className="text-gray-300 text-xs">{event.time}</span>
            </div>
            <p className="mt-2 text-gray-400 text-sm">{event.description}</p>

            {/* Render Edit Button only if canEdit is true */}
            {canEdit && (
              <button
                onClick={() => handleEdit(event.id)}
                className="mt-4 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Edit Event
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarComponent;
