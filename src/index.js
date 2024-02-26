import reportWebVitals from './reportWebVitals';
import React from 'react';
import ReactDOM from 'react-dom'; // Correct import
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Correct import
import DailyTimetable from './DailyTimetable';
import './index.css';
import Pidat from './Monitor';
import HabitTracker from './HabitsTracker';
import ToDoList from './ToDo';
const rootElement = document.getElementById('root');

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Pidat />} />
      <Route path='/plans' element={<DailyTimetable />} />
      <Route path='/Pi' element={<Pidat />} />
      <Route path='/Habits' element={<HabitTracker />} />
      {/* <Route path='/todo' element={<ToDoList/>}/> */}
    </Routes>
  </BrowserRouter>,
  rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
