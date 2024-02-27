import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ToDoList() {
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  
    useEffect(() => {
        fetchTodos();
    }, [currentDate]);
  
    async function fetchTodos() {
        try {
            const response = await fetch(`https://dailyplan-node.azurewebsites.net/todo?date=${currentDate}`);
            if (!response.ok) throw new Error('Network response was not ok.');
            const data = await response.json();
            const todos = data[0] ? data[0].dailyToDoItems : [];
            setTodos(todos);
            console.log(data[0].dailyToDoItems)
        } catch (error) {
            console.error('Failed to fetch todos:', error);
        }
    }
  
    async function addTask() {
        const newTask = { title: inputValue, completed: false };
        const newss = [...todos, newTask]
        setTodos(newss)
        try {
            await updateTodos([...todos, newTask]);
            setInputValue(''); // Reset input value after adding
        } catch (error) {
            console.error('Failed to add todo:', error);
        }
    }
  
    async function toggleTodo(index) {
        
        const updatedTodos = todos.map((todo, idx) =>
            idx === index ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(updatedTodos)
        try {
            await updateTodos(updatedTodos);
        } catch (error) {
            console.error('Failed to toggle todo:', error);
        }
    }
  
    async function updateTodos(updatedTodos) {
        try {
            const response = await fetch('https://dailyplan-node.azurewebsites.net/todo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: currentDate,
                    dailyToDoItems: updatedTodos
                }),
            });
            if (!response.ok) throw new Error('Network response was not ok.');
            fetchTodos(); // Refresh the list
        } catch (error) {
            console.error('Failed to update todos:', error);
        }
    }
    async function deleteTask(index) {
        console.log(`Deleting task at index: ${index}`); // Debug: log the index to be deleted
        const updatedTodos = todos.filter((_, idx) => {
            console.log(`Filtering index: ${idx}`); // Debug: log the current index being checked
            return idx !== index;
        });
        setTodos(updatedTodos);
        console.log(updatedTodos); // Debug: log the updated list to see if the item was removed
        try {
            await updateTodos(updatedTodos); // Update the backend
        } catch (error) {
            console.error('Failed to delete todo:', error);
        }
    }
    
    
    const handleDayChange = (days) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + days);
        setCurrentDate(newDate.toISOString().split('T')[0]);
    };
// Function to format date
const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateObj = new Date(date);
    if (date === today.toISOString().split('T')[0]) {
        return 'Today';
    } else if (date === yesterday.toISOString().split('T')[0]) {
        return 'Yesterday';
    } else if (date === tomorrow.toISOString().split('T')[0]) {
        return 'Tomorrow';
    } else {
        // Format the date as "Month day, year" (e.g., "January 1, 2024")
        return dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }
};

return (
<div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg">
    <div className="flex justify-between mb-4">
        <button onClick={() => handleDayChange(-1)} className="px-6 py-3 text-black bg-gray-200 rounded-lg">Previous Day</button>
        <button onClick={() => handleDayChange(1)} className="px-6 py-3 text-black bg-gray-200 rounded-lg">Next Day</button>
    </div>

    <Link to='/todo'>
    <h3 className="mb-4 text-xl text-center">To-Do List for {formatDate(currentDate)}</h3>
    </Link>
   
    <div className="mb-4">
        <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add new task"
            className="w-full p-4 border-gray-300 rounded-lg"
        />

        <div className="flex justify-center mt-2">
            <button onClick={addTask} className="px-6 py-3 text-white bg-blue-500 rounded-lg">Add Task</button>
        </div>
    </div>
    <ul>
        {todos.map((todo, index) => (
            <li key={index} className="relative flex items-center p-2 mb-4 bg-gray-100 rounded-lg">
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(index)}
                className="w-5 h-5 mr-2"
            />
            <span className={`${todo.completed ? 'line-through' : ''} text-lg`}>{todo.title}</span>
            <button onClick={() => deleteTask(index)} className="absolute right-0 px-2 py-1 mx-4 text-gray-400 rounded-lg hover:text-gray-900">X</button>
        </li>

        ))}
    </ul>
</div>


    );
}