'use client';

import React, { useState, useEffect } from 'react';
import EndPartHome from "@/components/EndPartHome"
import MiddlePartHome from "@/components/MiddlePartHome"
import NavbarHomePage from "@/components/NavbarHomePage"
import Loading from "@/components/Loading";
import { div } from 'framer-motion/client';

const Homepage = () => {


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (

    <div>

      {loading ? <Loading /> : 
            <div
            className="min-h-screen bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://sandalu-umayanga.github.io/storage/kback.jpg')",
            }}
          >
            {/* Top */}
            <div className=" opacity-90">
              <NavbarHomePage />
            </div>
            {/* Center */}
            <div className="opacity-85">
              <MiddlePartHome />
            </div>
            {/* Bottom */}
            <div>
              <EndPartHome />
            </div>
          </div>}
    </div>

  );
};

export default Homepage;