import axios from 'axios';
import Cookie from "js-cookie";
import { useEffect, useRef, useState } from "react";
import '../../App.css';
import env from "../../env.json";
import { useTranslation } from 'react-i18next';
import './calendar.css';
import Task from "../task/task";

function getStartOfWeek(date) {
    const dayOfWeek = date.getDay();
    const difference = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(date.setDate(difference));
}

function addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
}

const filters = [
    '#1abc9c',
    '#2ecc71',
    '#3498db',
    '#9b59b6',
    '#f1c40f',
    '#e67e22',
    '#e74c3c',
    '#34495e',
    '#95a5a6',
    '#7f8c8d',
];

const tmpdata = [
    { "task_name": "overflow: hidden;", "description": "neke neke", "color": '#e74c3c', "start_time": "2024-10-22T14:00:00", "end_time": "2024-10-22T16:00:00" },
    { "task_name": "task2", "description": "neke neke", "color": '#9b59b6', "start_time": "2024-10-22T14:00:00", "end_time": "2024-10-23T16:00:00" },
    { "task_name": "task3", "description": "neke neke", "color": "#2ecc71", "start_time": "2024-10-23T18:00:00", "end_time": "2024-10-24T20:00:00" },
    { "task_name": "task4", "description": "neke neke", "color": "#7f8c8d", "start_time": "2024-10-24T22:00:00", "end_time": "2024-10-25T23:00:00" }
];


function Calendar() {
    const { t } = useTranslation();
    const [signedIn, setSignedIn] = useState(false);
    const [currentWeek, setCurrentWeek] = useState(getStartOfWeek(new Date()));
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const fileInputRef = useRef(null);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const handleSlotClick = (day, slot) => {
        const slotHour = parseInt(slot.split(":")[0]);
        const slotMinutes = parseInt(slot.split(":")[1]);
        const slotTime = new Date(day);
        slotTime.setHours(slotHour, slotMinutes, 0, 0);
        const slotEnd = new Date(slotTime);
        slotEnd.setHours(slotHour + 1, slotMinutes, 0, 0);

        const isSlotOccupied = tasks.some(task => {
            const taskStart = new Date(task.startDateTime);
            const taskEnd = new Date(task.endDateTime);
            return (taskStart <= slotTime && taskEnd > slotTime);
        });

        if (isSlotOccupied) return;

        //Create new task
        const newTask = {
            name: 'New Task',
            color: filters[0],
            startDateTime: slotTime,
            endDateTime: slotEnd,
        };

        const user = JSON.parse(Cookie.get("signed_in_user"));
        axios.post(`${env.api}/task/user/${user._id}/tasks`, newTask, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            const createdTask = response.data.task;
            setTasks([...tasks, createdTask]);
        }).catch((error) => {
            console.log(error);
        });
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setModalIsOpen(true);
    };

    const handleTaskRightClick = (task) => {
        const user = JSON.parse(Cookie.get("signed_in_user"));
        axios.delete(`${env.api}/task/user/${user._id}/tasks/${task._id}`)
            .then(() => {
                setTasks(tasks.filter(t => t._id !== task._id));
            })
            .catch((error) => {
                console.error("Error deleting task:", error);
            });
    }

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedTask(null);
    };


    useEffect(() => {
        if (Cookie.get("signed_in_user") !== undefined) {
            const user = JSON.parse(Cookie.get("signed_in_user"));
            setSignedIn(user);

            // Fetch tasks and schedules in parallel
            Promise.all([
                axios.get(`${env.api}/task/user/${user._id}/tasks`),
                axios.get(`${env.api}/schedule/schedules/all`)
            ])
                .then(([taskResponse, scheduleResponse]) => {
                    const userTasks = taskResponse.data.tasks;
                    const schedules = scheduleResponse.data.tasks;  // Assuming schedules are in 'tasks'

                    // Map over schedules to match task properties
                    const formattedSchedules = schedules.map(schedule => ({
                        _id: user._id,
                        name: schedule.name,
                        color: schedule.color,
                        startDateTime: schedule.start_time,  // Rename to match tasks' format
                        endDateTime: schedule.end_time       // Rename to match tasks' format
                    }));

                    // Combine user tasks and formatted schedules into a single array
                    const combinedTasks = [...userTasks, ...formattedSchedules];
                    setTasks(combinedTasks);

                    // Log the combined tasks array
                    console.log("Fetched and combined tasks:", combinedTasks);
                })
                .catch((error) => {
                    console.error("Error fetching tasks or schedules:", error);
                });
        } else {
            setSignedIn(false);
        }
    }, []);
    

    const handlePrevWeek = () => {
        setCurrentWeek(addDays(currentWeek, -7));
    };

    const handleNextWeek = () => {
        setCurrentWeek(addDays(currentWeek, 7));
    };

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        weekDays.push(addDays(currentWeek, i));
    }

    //STARI
    // const timeSlots = [];
    // for (let i = 0; i < 24 * 2; i++) {
    //     const hours = Math.floor(i / 2);
    //     const minutes = i % 2 === 0 ? "00" : "30";
    //     timeSlots.push(`${hours.toString().padStart(2, '0')}:${minutes}`);
    // }

    const timeSlots = [];
    for (let i = 6; i <= 22; i++) {
        timeSlots.push(`${i.toString().padStart(2, '0')}:${"00"}`);
    }

    const isSameDay = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    const filteredTasks = tasks.filter(task => {
        const startDate = new Date(task.startDateTime);
        const endDate = new Date(task.endDateTime);

        return weekDays.some(day => (
            (startDate <= day && endDate >= day) // Checks if the task spans across the week
        ));
    });
    
    

    const renderTaskInTimeSlot = (day, slot) => {
        const dayTasks = tasks.filter(task => {
            const taskStart = new Date(task.startDateTime);
            const taskEnd = new Date(task.endDateTime);
            const slotHour = parseInt(slot.split(":")[0]);
            const slotMinutes = parseInt(slot.split(":")[1]);

            const slotTime = new Date(day);
            slotTime.setHours(slotHour, slotMinutes, 0, 0);
            // Adjust to include entire range on the given day
            return (taskStart <= slotTime && taskEnd > slotTime);
        });

        return dayTasks.map((task, index) => (
            selectedFilter !== null && task.color !== filters[selectedFilter] ? null : (
                <div key={index} className="task-ribbon" style={{ backgroundColor: task.color }}>
                    <b onClick={() => handleTaskClick(task)}>{/*⠀*/task.name}</b>
                    <button onClick={() => handleTaskRightClick(task)}>X</button>
                </div>
            )
        ));
    };
    

    const handleFileImport = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/json") {
            const reader = new FileReader();
            reader.onload = (e) => {
                const jsonData = JSON.parse(e.target.result);
                setTasks(prevTasks => [...prevTasks, jsonData]);
                console.log(jsonData);
            };
            reader.readAsText(file);
        } else {
            alert(t("calendar.valid_json_file"));
        }
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button className="change-week" onClick={handlePrevWeek}>←</button>
                <h2>{t("calendar.week")} {currentWeek.toDateString()}</h2>
                <button className="change-week" onClick={handleNextWeek}>→</button>
            </div>
            <div className="filters">
                <div>{t("calendar.filter")}</div>
                {filters.map((filter, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedFilter(index)}
                        className={`${selectedFilter === index ? 'active-filter' : 'filter'}`}
                        style={{ backgroundColor: filter }}
                    >
                        ⠀
                    </div>
                ))}
                <div className="clear-filter" onClick={() => setSelectedFilter(null)}>{t("calendar.clear_filter")}</div>
            </div>
            <div className="calendar-grid-wrapper">
                <div className="time-label-column">
                    {timeSlots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="time-label">{slot}</div>
                    ))}
                </div>
                <div className="calendar-grid">
                    {weekDays.map((day, index) => (
                        <div key={index}>
                            <h3>{day.toDateString()}</h3>
                            <div className="calendar-day">
                                <div className="time-slots">
                                    {timeSlots.map((slot, slotIndex) => (
                                        <div key={slotIndex} onClick={() => handleSlotClick(day, slot)} className="time-slot">
                                            <div className="content-area">
                                                {renderTaskInTimeSlot(day, slot)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {signedIn !== false ? (
                <div className="import-data">
                    <span>{t("calendar.import_schedule")}</span>
                    <input
                        type="file"
                        accept=".json"
                        ref={fileInputRef}
                        onChange={handleFileImport}
                    />
                </div>) : null
            }
            <Task isOpen={modalIsOpen} toggleModal={closeModal} task={selectedTask} />
        </div>
    );
}

export default Calendar;
