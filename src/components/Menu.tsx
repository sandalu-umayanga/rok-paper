"use client"

import { role } from '@/lib/role';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["admin", "teacher", "student", "staff", "finance"],
      },
      // {
      //   icon: "/teacher.png",
      //   label: "Teachers",
      //   href: "/list/teachers",
      //   visible: ["admin", "teacher", "finance"],
      // },
      {
        icon: "/student.png",
        label: "Students",
        href: "/list/students",
        visible: ["admin", "teacher", "finance"],
      },
      {
        icon: "/parent.png",
        label: "Staff",
        href: "/list/parents",
        visible: ["admin", "finance","staff"],
      },
      // {
      //   icon: "/subject.png",
      //   label: "Subjects",
      //   href: "/list/subjects",
      //   visible: ["admin"],
      // },
      // {
      //   icon: "/class.png",
      //   label: "Classes",
      //   href: "/list/classes",
      //   visible: ["admin", "teacher","staff"],
      // },
      // {
      //   icon: "/lesson.png",
      //   label: "Lessons",
      //   href: "/list/lessons",
      //   visible: ["admin", "teacher"],
      // },
      // {
      //   icon: "/exam.png",
      //   label: "Exams",
      //   href: "/list/exams",
      //   visible: ["admin", "teacher", "student", "staff"],
      // },
      // {
      //   icon: "/assignment.png",
      //   label: "Assignments",
      //   href: "/list/assignments",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
      {
        icon: "/result.png",
        label: "Results",
        href: "/list/results",
        visible: ["admin", "teacher", "student", "staff"],
      },
      // {
      //   icon: "/attendance.png",
      //   label: "Attendance",
      //   href: "/list/attendance",
      //   visible: ["admin", "teacher", "student", "staff"],
      // },
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/events",
        visible: ["admin", "teacher", "student", "staff"],
      },
      // {
      //   icon: "/message.png",
      //   label: "Messages",
      //   href: "/list/messages",
      //   visible: ["admin", "teacher", "student", "staff"],
      // },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "staff"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "staff"],
      },
      // {
      //   icon: "/setting.png",
      //   label: "Settings",
      //   href: "/settings",
      //   visible: ["admin", "teacher", "student", "staff"],
      // },
    ],
  },
];


const Menu = () => {

  const router = useRouter();
  const [inactivityTimeout, setInactivityTimeout] = useState(null);

  // Function to handle manual and automatic logout
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/v1/auth/logout", {
        method: "POST",
        credentials: "include", // Include cookies if required
      });
      localStorage.clear();  // Clear all local storage items
      router.push("/sign-in");  // Redirect to sign-in page
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  // Function to reset inactivity timer
  const resetInactivityTimer = () => {
    if (inactivityTimeout) clearTimeout(inactivityTimeout);
    const timeout = setTimeout(handleLogout, 10 * 60 * 10000); // Set 10 minutes timeout
    setInactivityTimeout(timeout);
  };

  // Monitor user activity to reset inactivity timer
  useEffect(() => {
    resetInactivityTimer(); // Start timer on initial load

    const handleUserActivity = () => resetInactivityTimer();

    // Add event listeners for activity
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    // Clean up event listeners on component unmount
    return () => {
      if (inactivityTimeout) clearTimeout(inactivityTimeout);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
    };
  }, []);

  // Check for session expiry every 5 minutes
  useEffect(() => {
    const checkSessionExpiry = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:8080/api/v1/some-endpoint", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          handleLogout(); // Auto logout if session expired
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };

    const intervalId = setInterval(checkSessionExpiry, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((menu) => (
        <div className="flex flex-col gap-2" key={menu.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {menu.title}
          </span>
          {menu.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
          {menu.title === "OTHER" && (
            <button onClick={handleLogout} className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight">
              <Image src="/logout.png" alt="" width={20} height={20} />
              <span className="hidden lg:block">Logout</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Menu;