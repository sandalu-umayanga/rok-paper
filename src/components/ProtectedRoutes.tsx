"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      setIsLoading(true);

      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://localhost:8080/api/v1/auth/role", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Unauthorized");
        }

        const role = await response.text();

        if (allowedRoles.includes(role)) {
          setIsAuthorized(true);
        } else {
          router.push("/unauthorized");
        }
      } catch (error) {
        router.push("/unauthorized");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [allowedRoles, router]);

  if (isLoading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  return <>{isAuthorized ? children : null}</>;
};

export default ProtectedRoute;
