import React, { useState, useEffect } from 'react';
import PieChart from './Pie';
import DailyTimetable from './DailyTimetable';
import HabitTracker from './HabitsTracker';

export default function Pidat() {
    const [response, setResponse] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://optimise-me-tracker.azurewebsites.net/timetable-summary`);
                if (response.ok) {
                    const data = await response.json();
                    setResponse(data); // Update the state with the response data
                } else {
                    console.error('Error fetching data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    

    return (
  <div className='bg-gray-50'>
    <div className="container p-4 mx-auto">
    <div className="mb-6 text-center">
    <div className="inline-block p-3 bg-indigo-500 rounded-full"> {/* Example icon wrapper */}
      {/* Replace with an actual icon or logo if you have one */}
      <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M11 19l-2-2 2-2m2 4l2-2-2-2"></path>
      </svg>
    </div>
    <h1 className="mt-2 text-4xl font-bold">Life Dashboard</h1>
    <p className="text-xl text-gray-600">Every Second Counts</p> {/* Subheader */}
  </div>
      {/* Habits and Timetable Section */}
      <div className="flex flex-col items-center justify-around md:flex-row">
        {/* Habit Tracker */}
        <div className="w-full m-4 transition-all duration-500 bg-white shadow-lg h-bigger rounded-xl md:w-2/3">
          <div className="w-auto ">
            <HabitTracker />
          </div>
        </div>

        {/* Daily Timetable */}
        <div className="w-full m-4 overflow-y-auto transition-all duration-500 bg-white rounded-lg h-bigger md:w-1/3">
          {/* <h2 className="p-4 mb-4 text-2xl font-semibold">Daily Timetable</h2> */}
          <div className="p-4">
            <DailyTimetable />
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="p-6 bg-gray-200 shadow-lg rounded-xl">
        <div className="flex flex-col md:flex-row">
          <div className="w-full p-2 md:w-1/2 lg:w-1/3">
            <h2 className="mb-4 text-2xl font-semibold">Analytics</h2>
            {response && <PieChart data={response} />}
          </div>
          <div className="w-full p-2 md:w-1/2 lg:w-2/3">
            {/* Placeholder for further analysis components */}
            <div className="h-full p-4 bg-white rounded-xl">
              <p className="text-lg">Further Analysis...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

}
