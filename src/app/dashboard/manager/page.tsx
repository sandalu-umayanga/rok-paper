import Announcements from '@/components/Announcements'
import CalendarComponent from '@/components/Calendar'
import CountChart from '@/components/CountChart'
import EnrollmentChart from '@/components/EnrollementChart'
import FinanceChart from '@/components/FinanceChart'
import ProtectedRoute from '@/components/ProtectedRoutes'
import StaffCard from '@/components/StaffCard'
import React from 'react'

const StaffPage = () => {
  return (
    <ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}>
      <div className='flex gap-4 flex-col md:flex-row p-4'>
        {/* Left */}
        <div className='w-full lg:w-2/3 flex flex-col gap-8'>
        {/* User Cards */}
          <div className='flex gap-4 justify-between flex-wrap'>
            <StaffCard type='add'/>
            <StaffCard type='view'/>
            <StaffCard type='remove'/>
          </div>
          {/* Middle Charts */}
          <div className='flex gap-4 flex-col lg:flex-row'>
            {/* Count Chart */}
            <div className='w-full lg:w-1/3 h-[450px]'>
              <CountChart/>
            </div>
            {/* Score Chart */}
            <div className='w-full lg:w-2/3 h-[450px]'><EnrollmentChart/></div>
          </div>
          {/* Bottom Charts */}
          <div className='w-full h-[500px]'><FinanceChart/></div>
        </div>
        {/* Right */}
        <div className='w-full lg:w-1/3 flex flex-col gap-8'>
          <CalendarComponent/>
          <Announcements/>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default StaffPage