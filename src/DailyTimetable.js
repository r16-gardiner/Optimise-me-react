import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


export default function DailyTimetable() {
  const [timetableData, setTimetableData] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);


  // Define your types and subjects (if needed)
  const types = ["", "Work", "Exercise","Lottie Time", "Sleep", "Meal", "Commute", "Personal Care", "Lecture", "Cook", "Workshop","Lab","Shop", "Leisure"];
  const subjects = ["","Chemistry", "Physics", "Other"]; // Add this if you plan to use subjects

  const getOutlineStyle = (subject) => {
    switch (subject) {
      case "Chemistry":
        return { outline: '5px solid #4CAF50' }; // Example: Green outline for Chemistry
      case "Physics":
        return { outline: '5px solid #2196F3' }; // Example: Blue outline for Physics
      case "Other":
        return { outline: '5px solid #FFC107' }; // Example: Yellow outline for Other
      default:
        return {};
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case "Work":
        return '#C0D6DF';
      case "Exercise":
        return '#A3C4BC';
      case "Meal":
        return '#F5E2C8';
      case "Commute":
        return '#DADADA';
      case "Personal Care":
        return '#F4D1D1';
      case "Lecture":
        return '#B0A8B9';
      case "Cook":
        return '#F0B7A4';
      case "Workshop":
        return '#B7C0C7';
      case "Lab":
        return '#B7C0C7';
      default:
        return 'transparent';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://optimise-me-tracker.azurewebsites.net/daily-plan?date=${currentDate}`);
        if (response.ok) {
          const data = await response.json();
          // Check if the data is in the expected format
          if (data.activities && data.activities.timetable) {
            setTimetableData(data.activities.timetable); // If it has activities.timetable
          } else {
            setTimetableData(data); // If it's in a different format
          }
        } else {
          console.error('Error fetching data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    

    fetchData();
  }, [currentDate]);
  
  useEffect(() => {
    function generateTimetable() {
      const slots = [];
      const startTime = 7 * 60 + 30;
      const endTime = 22 * 60;
      
      for (let i = startTime; i <= endTime; i += 30) {
        const time = `${Math.floor(i / 60).toString().padStart(2, '0')}:${(i % 60).toString().padStart(2, '0')}`;
        const activityData = timetableData.find((item) => item.time === time) || {};
        slots.push({
          time,
          activity: activityData.activity || '',
          type: activityData.type || '',
          subject: activityData.subject || ''
        });
      }
  
      setTimetable(slots);
    };
  

    generateTimetable();
  }, [timetableData]);

  const handleActivityChange = (index, newValue) => {
    const updatedTimetable = [...timetable];
    updatedTimetable[index].activity = newValue;
    setTimetable(updatedTimetable);
  };

  const handleTypeChange = (index, newType) => {
    const updatedTimetable = [...timetable];
    updatedTimetable[index].type = newType;
    if (!['Work', 'Lecture', 'Workshop'].includes(newType)) {
      updatedTimetable[index].subject = '';
    }
    setTimetable(updatedTimetable);
  };

  const handleSubjectChange = (index, newSubject) => {
    const updatedTimetable = [...timetable];
    updatedTimetable[index].subject = newSubject;
    setTimetable(updatedTimetable);
  };

  const submitUpdatedTimetable = async () => {
    try {
      const response = await fetch(`https://dailyplan-node.azurewebsites.net/update-daily-plan?date=${currentDate}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timetable }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      console.log(result.message);
      alert(result.message)
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };
  

  const handleNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setCurrentDate(nextDay.toISOString().split('T')[0]);
  };
  
  const handlePreviousDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setCurrentDate(prevDay.toISOString().split('T')[0]);
  };
  
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-UK', options);
  };
  
  return (
    <div className='flex justify-center h-screen'>
      <div key={currentDate} className="container">
          <div className="sticky top-0 z-10 w-full bg-white border border-solid border-x-white">
          <Link to='/plans'>
            <h2 className="pt-5 pb-3 text-3xl text-center">{formatDate(currentDate)}</h2>
            </Link>
            <div className="flex justify-center pb-5 mb-4 space-x-2">
              <button className="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700" onClick={handlePreviousDay}>
                Previous Day
              </button>
              <button className="px-4 py-2 font-bold text-white bg-green-500 rounded-full hover:bg-green-700" onClick={handleNextDay}>
                Next Day
              </button>
            </div>
          </div>
    
  
        <div className="pt-2">
          <div className="bg-white rounded-lg ">
            <table className="w-full mb-4 rounded-lg table-auto">
              <thead className='rounder-lg'>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">Activity</th>
                  <th className="px-4 py-2">Type</th>
                </tr>
              </thead>
              <tbody className='shadow-none'>
                {timetable.map((slot, index) => (
                  <tr key={slot.time} >
                    <td className="px-4 py-2 border shadow-none">{slot.time}</td>
                    <td className="px-4 py-2 border">
                      <input
                        type="text"
                        value={slot.activity}
                        onChange={(e) => handleActivityChange(index, e.target.value)}
                        style={{ backgroundColor: getBackgroundColor(slot.type), ...getOutlineStyle(slot.subject) }}
                        className="w-full p-2 rounded-lg"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <select
                        value={slot.type}
                        onChange={(e) => handleTypeChange(index, e.target.value)}
                        className="w-full p-2 rounded-lg"
                      >
                        {types.map((type, typeIndex) => (
                          <option key={typeIndex} value={type}>{type}</option>
                        ))}
                      </select>
                      {/* Conditionally render the subject dropdown */}
                      {['Work', 'Lecture', 'Workshop'].includes(slot.type) && (
                        <select
                          value={slot.subject}
                          onChange={(e) => handleSubjectChange(index, e.target.value)}
                          className="w-full p-2 mt-2 rounded-lg"
                        >
                          {subjects.map((subject, subjectIndex) => (
                            <option key={subjectIndex} value={subject}>{subject}</option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='pb-8'>
          <div className="text-center">
            <button className="px-4 py-2 font-bold text-white bg-purple-500 rounded hover:bg-purple-700" onClick={submitUpdatedTimetable}>
              Update Timetable
            </button>
          </div>
          </div>

        </div>
      </div>
      </div>
  );
}