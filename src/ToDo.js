// src/ToDoList.js
import React, { useState, useEffect } from 'react';

export default function ToDoList() {
    const [newTask, setNewTask] = useState('');
    const [toDoItems, setToDoItems] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

    async function fetchToDoItems(date) {
        try {
            const response = await fetch(`http://localhost:8888/getToDoData?startDate=${date}&endDate=${date}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json(); // Correctly parse the JSON response
    
            // Adjusted to correctly navigate through the nested structure
            const fetchedToDoItems = data.length > 0 ? data[0].dailyToDoItems.dailyToDoItems : [];
            
            if (Array.isArray(fetchedToDoItems)) {
                setToDoItems(fetchedToDoItems);
            } else {
                console.warn("Expected dailyToDoItems to be an array, received:", fetchedToDoItems);
                setToDoItems([]); // Default to an empty array if the expected structure is not found
            }
        } catch (error) {
            console.error("Error fetching to-do items:", error);
        }
    };
    

    useEffect(() => {
        fetchToDoItems(currentDate);
    }, [currentDate]);
    
    const addTask = () => {
        if (!newTask.trim()) return;
        setToDoItems([...toDoItems, { name: newTask, completed: false }]);
        setNewTask('');
    };

    const updateToDoItem = (index) => {
        const updatedItems = toDoItems.map((item, idx) => 
            idx === index ? { ...item, completed: !item.completed } : item
        );
        setToDoItems(updatedItems);
    };

    const submitToDoItems = async () => {
        try {
            // Assuming there's an endpoint to handle POST for a new day or PUT to update existing day
            const method = toDoItems.length > 0 ? 'PUT' : 'POST';
            const url = `http://localhost:8888/${method === 'PUT' ? 'updateToDoData' : 'logToDoData'}`;
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: currentDate,
                    dailyToDoItems: toDoItems,
                }),
            
            });
            console.log(response)
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            alert('To-Do list updated successfully!');
        } catch (error) {
            console.error("Error submitting to-do items:", error);
        }
    };

    const handlePreviousDay = () => {
        const previousDay = new Date(currentDate);
        previousDay.setDate(previousDay.getDate() - 1);
        setCurrentDate(previousDay.toISOString().split('T')[0]);
    };

    const handleNextDay = () => {
        const nextDay = new Date(currentDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setCurrentDate(nextDay.toISOString().split('T')[0]);
    };
    const handleDayChange = (days) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + days);
        setCurrentDate(newDate.toISOString().split('T')[0]);
    };

    return (
        <div>
        <button onClick={() => handleDayChange(-1)}>Previous Day</button>
        <button onClick={() => handleDayChange(1)}>Next Day</button>
        <h3>To-Do List for {currentDate}</h3>
        <div>
            <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Add new task" />
            <button onClick={addTask}>Add Task</button>
        </div>
        <ul>
            {toDoItems.map((item, index) => (
                <li key={index}>
                    <input type="checkbox" checked={item.completed} onChange={() => updateToDoItem(index)} />
                    {item.name}
                </li>
            ))}
        </ul>
        <button onClick={submitToDoItems}>Submit To-Do List</button>
    </div>
);
}