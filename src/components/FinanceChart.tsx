"use client"

import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Image from 'next/image'

const data = [
    {
        name: 'January',
        Income: 25000,
    },
    {
        name: 'February',
        Income: 14000,
    },
    {
        name: 'March',
        Income: 23000,
    },
    {
        name: 'April',
        Income: 21000,
    },
    {
        name: 'May',
        Income: 47000,
    },
    {
        name: 'June',
        Income: 43000,
    },
    {
        name: 'July',
        Income: 18000,
    },
    {
        name: 'August',
        Income: 2000,
    },
    {
        name: 'September',
        Income: 14500,
    },
    {
        name: 'October',
        Income: 46000,
    },
    {
        name: 'November',
        Income: 34000,
    },
    {
        name: 'December',
        Income: 74000,
    },
  ];

const FinanceChart = () => {
  return (
    <div className='bg-white rounded-lg p-4 h-full'>
      <div className='flex justify-between items-center'>
        <h1 className='text-lg font-semibold'>Finance</h1>
        <Image src="/moreDark.png" alt='' width={20} height={20}/>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{fill:"#D1D5DB"}} tickMargin={10}/>
          <YAxis tickMargin={10}/>
          <Tooltip contentStyle={{borderRadius:"10px", borderColor:"lightcyan"}}/>
          <Legend align='center' verticalAlign='top' wrapperStyle={{paddingTop:"20px", paddingBottom:"40px"}}/>
          <Line type="monotone" dataKey="Income" stroke="#C3EBFA" strokeWidth={5} activeDot={{ r: 8 }} />
          {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default FinanceChart