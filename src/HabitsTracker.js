import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HabitTracker() {
    const [habitsByDate, setHabitsByDate] = useState({});
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const fetchHabits = async (startDate, endDate) => {
          try {
            const response = await fetch(`https://optimise-me-tracker.azurewebsites.net/getHabits?startDate=${startDate}&endDate=${endDate}`);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // Convert array of habits to a map by date for easier processing
            const habitsMap = data.reduce((acc, current) => {
              acc[current.date] = current.habits;
              return acc;
            }, {});
            setHabitsByDate(habitsMap);
          } catch (error) {
            console.error('Fetch error:', error);
          }
        };

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
        const lastDayOfMonth = new Date(year, month, 0).getDate();

        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDayOfMonth}`;

        fetchHabits(startDate, endDate);
    }, [currentDate]);

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
        setCurrentDate(newDate);
    };

    const generateCalendar = () => {
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const days = Array.from({ length: lastDayOfMonth }, (_, i) => i + 1);

        // Extract all unique habit names across all days
        const allHabits = new Set();
        Object.values(habitsByDate).forEach(habits => {
            habits.forEach(habit => allHabits.add(habit.name));
        });
        const habitsList = Array.from(allHabits);

        return (
            <div className="container p-2 mx-auto sm:p-4">
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="border border-gray-300 bg-gray-50">
                            <th className="sticky left-0 z-10 px-2 py-1 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-white">
                                Habit
                            </th>
                            {days.map(day => (
                                <th key={day} className="px-1 py-1 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase rounded-lg sm:px-2">
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {habitsList.map(habitName => (
                            <tr key={habitName} className="hover:bg-gray-100">
                                <td className="sticky left-0 z-10 px-2 py-1 text-xs whitespace-no-wrap border-b border-gray-300 bg-white">
                                    {habitName}
                                </td>
                                {days.map(day => {
                                    const date = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                                    const dayHabits = habitsByDate[date] || [];
                                    const habit = dayHabits.find(h => h.name === habitName);
                                    const completed = habit ? habit.completed : false;
                                    return (
                                        <td key={day} className={`px-1 py-1 whitespace-no-wrap border-b border-gray-300 text-xs ${completed ? 'bg-green-200' : 'bg-red-200'} sm:px-2`}></td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        );
    };

    const formatMonthYear = (date) => {
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString('en-UK', options);
    };

    const formatMonth = (date, offset) => {
        const newDate = new Date(date.getFullYear(), date.getMonth() + offset, 1);
        const options = { month: 'long' };
        return newDate.toLocaleDateString('en-UK', options);
    };

    return (
        <div className="container p-2 mx-auto sm:p-4">
        <div className="m-2 bg-white rounded-lg sm:m-4">
            <div className="flex flex-col sm:flex-row items-center justify-between p-2 sm:p-4">
            <Link to='/Habits'> 
            <h2 className="text-3xl sm:text-4xl mb-4 sm:mb-0 ">
                    {formatMonthYear(currentDate)}
                </h2>
                </Link>
                <div className="flex flex-row justify-between w-full sm:w-auto">
                    <button 
                        onClick={() => changeMonth(-1)} 
                        className="flex items-center px-2 py-1 font-bold text-white bg-blue-500 rounded-3xl hover:bg-blue-700 sm:px-4 sm:py-2"
                    >
                        <span className="mr-2">←</span>
                        {formatMonth(currentDate, -1)}
                    </button>
                    
                    <button 
                        onClick={() => changeMonth(1)} 
                        className="flex items-center px-2 py-1 font-bold text-white bg-green-500 rounded-3xl hover:bg-green-700 sm:px-4 sm:py-2"
                    >
                        {formatMonth(currentDate, 1)}
                        <span className="ml-2">→</span>
                    </button>
                </div>
            </div>
            {generateCalendar()}
        </div>
    </div>
    
    );
}

export default HabitTracker;
