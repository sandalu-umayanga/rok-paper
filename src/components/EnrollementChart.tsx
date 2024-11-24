"use client"

import Image from 'next/image';
import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  // {
  //   name: 'January',
  //   uv: 4000,
  //   pv: 2400,
  //   amt: 2400,
  // },
  // {
  //   name: 'February',
  //   uv: 3000,
  //   pv: 1398,
  //   amt: 2210,
  // },
  // {
  //   name: 'March',
  //   uv: 2000,
  //   pv: 9800,
  //   amt: 2290,
  // },
  // {
  //   name: 'April',
  //   uv: 2780,
  //   pv: 3908,
  //   amt: 2000,
  // },
  // {
  //   name: 'May',
  //   uv: 1890,
  //   pv: 4800,
  //   amt: 2181,
  // },
  // {
  //   name: 'June',
  //   uv: 2390,
  //   pv: 3800,
  //   amt: 2500,
  // },
  // {
  //   name: 'July',
  //   uv: 3490,
  //   pv: 4300,
  //   amt: 2100,
  // },
  {
    name: 'August',
    Male: 150,
    Female: 230,
  },
  {
    name: 'September',
    Male: 600,
    Female: 300,
  },
  {
    name: 'October',
    Male: 490,
    Female: 430,
  },
  {
    name: 'November',
    Male: 349,
    Female: 140,
  },
  {
    name: 'December',
    Male: 490,
    Female: 43,
  },
];


const EnrollmentChart = () => {
  return (
    <div className='bg-white rounded-lg p-4 h-full'>
      <div className='flex justify-between items-center'>
        <h1 className='text-lg font-semibold'>Enrollment</h1>
        <Image src="/moreDark.png" alt='' width={20} height={20}/>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          width={500}
          height={300}
          data={data}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#DDD' />
          <XAxis dataKey="name" axisLine={false} tick={{fill:"#D1D5DB"}} tickLine={false}/>
          <YAxis/>
          <Tooltip contentStyle={{borderRadius:"10px", borderColor:"lightcyan"}}/>
          <Legend align='left' verticalAlign='top' wrapperStyle={{paddingTop:"20px", paddingBottom:"40px"}}/>
          <Bar dataKey="Male" fill="#FAE27C" activeBar={<Rectangle fill="pink" stroke="blue" />} legendType='circle' radius={[20,20,0,0]}/>
          <Bar dataKey="Female" fill="#C3EbFA" activeBar={<Rectangle fill="gold" stroke="purple"/>} legendType='circle' radius={[20,20,0,0]}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default EnrollmentChart