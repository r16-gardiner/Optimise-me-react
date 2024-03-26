import React, { useState, useEffect } from 'react';

export default function SubjectFractions({ timetable }) {
    const [timetableData, setTimetableData] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        async function fetchData()  {
          try {
            const response = await fetch(`https://dailyplan-node.azurewebsites.net/daily-plan?date=${currentDate}`);
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
        fetchData() 
    }, [timetableData]);
        

    // Initialize counters for each subject type
    var chemistryCount = 0;
    var physicsCount = 0;
    var otherCount = 0;

    // Iterate through the timetable data to count occurrences of each subject type
    timetableData.forEach(slot => {
        switch (slot.subject) {
        case 'Chemistry':
            chemistryCount++;
            break;
        case 'Physics':
            physicsCount++;
            break;
        case 'Other':
            otherCount++;
                break;
        default:
            ;
        }
    });

    // Calculate total count of subjects
    const totalCount = chemistryCount + physicsCount + otherCount;

    // Calculate fractions
    const chemistryFraction = totalCount > 0 ? (chemistryCount / totalCount) * 100 : 0;
    const physicsFraction = totalCount > 0 ? (physicsCount / totalCount) * 100 : 0;
    const otherFraction = totalCount > 0 ? (otherCount / totalCount) * 100 : 0;

    return (
        <div>
        <h2>Subject Fractions</h2>
        <p>Chemistry: {chemistryFraction.toFixed(2)}%</p>
        <p>Physics: {physicsFraction.toFixed(2)}%</p>
        <p>Other: {otherFraction.toFixed(2)}%</p>
        </div>
    );
    };


