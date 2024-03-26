import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend);
export default function SubjectFractions({  }) {
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
        fetchData();
    }, [currentDate]); // Changed from [timetableData] to [currentDate] to avoid unnecessary refetching

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
            // Do nothing for unknown subjects
            break;
        }
    });

    // Setup the data for the pie chart
    const data = {
        labels: ['Chemistry', 'Physics', 'Other'],
        datasets: [
            {
                label: 'Hours',
                data: [chemistryCount, physicsCount, otherCount],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <h2 className="pb-6 mb-4 text-2xl font-semibold">Subject Fractions</h2>
            <Pie data={data} />
        </div>
    );
};