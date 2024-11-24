"use client";

import React, { useEffect, useState } from "react";

const Announcements = () => {
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

  const handleEdit = (announcementId: number) => {
    alert(`Edit Announcement ${announcementId}`);
  };

  return (
    <div className="bg-white rounded-md p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-sm text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {/* Announcements List */}
        {[1, 2, 3].map((id) => (
          <div
            key={id}
            className={`${
              id === 1
                ? "bg-lamaSkyLight"
                : id === 2
                ? "bg-lamaPurpleLight"
                : "bg-lamaYellowLight"
            } rounded-md p-4`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Lorem ipsum dolor sit</h2>
              <span className="text-xs text-gray-400 bg-white px-1 py-1">
                2025-01-01
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Lorem ipsum dolor sit amet consectetur
            </p>

            {/* Render Edit Button only if canEdit is true */}
            {canEdit && (
              <button
                onClick={() => handleEdit(id)}
                className="mt-4 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Edit Announcement
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
