'use client';

import { useState, useEffect } from 'react';
import StudentProfile from '@/app/profile/components/StudentProfile';
import UserProfile from '@/app/profile/components/UserProfile';

const Page = () => {
  const [userRole, setUserRole] = useState<'STUDENT' | 'FINANCE' | 'TEACHER' | 'MANAGER' | 'ADMIN' | null>(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Fetch JWT from localStorage
        const role = localStorage.getItem('role'); // Fetch the role from localStorage
        if (!token || !role) throw new Error('User not authenticated or role not found');

        const response = await fetch('http://localhost:8080/api/v1/information/details', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        });

        if (!response.ok) throw new Error('Failed to fetch profile data');

        const data = await response.json();
        setProfileData(data);
        setUserRole(role as 'STUDENT' | 'FINANCE' | 'TEACHER' | 'MANAGER' | 'ADMIN');
        // console.log(userRole)
      } catch (error) {
        console.error(error.message);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <p>Loading user profile...</p>;
  }

  return (
    <div>
      {userRole === 'STUDENT' && <StudentProfile profileData={profileData} />}
      {userRole !== 'STUDENT' && userRole !== null && <UserProfile profileData={profileData} />}
      {userRole === null && <p>User role not found.</p>}
    </div>
  );
};

export default Page;
