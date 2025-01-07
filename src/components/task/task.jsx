import React, { useState, useEffect } from "react";
import axios from "axios";
import env from "../../env.json";
import Cookie from "js-cookie";
import "./task.css";

export default function Task({ isOpen, toggleModal, task}) {
    const [taskData, setTaskData] = useState({
        name: "",
        description: "",
        color: "#000000",
        startDateTime: "",
        endDateTime: "",
    });
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [isEditingStartDate, setIsEditingStartDate] = useState(false);
    const [isEditingEndDate, setIsEditingEndDate] = useState(false);
    const [isEditingColor, setIsEditingColor] = useState(false);

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

    useEffect(() => {
        if (task) {
            setTaskData({
                name: task.name,
                description: task.description,
                color: task.color,
                startDateTime: task.startDateTime,
                endDateTime: task.endDateTime,
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData({ ...taskData, [name]: value });
    };

    const handleUpdate = () => {
        const user = JSON.parse(Cookie.get("signed_in_user"));
        axios.put(`${env.api}/task/user/${user._id}/tasks/${task._id}`, taskData, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            console.log("Task updated successfully:", response.data);



            setIsEditingName(false);
            setIsEditingDescription(false);
            setIsEditingStartDate(false);
            setIsEditingEndDate(false);
            setIsEditingColor(false);
        }).catch((error) => {
            console.error("Error updating task:", error);
        });
    };
    

    if (!isOpen) return null;

    return (
        <>
            <div className="modal">
                <div className="overlay"></div>
                <div className="modal-content">
                    <h2>View/Update Task</h2>
                    <div className="form-group">
                        <label>Task Name:</label>
                        {isEditingName ? (
                            <input
                                type="text"
                                name="name"
                                value={taskData.name}
                                onChange={handleChange}
                                onBlur={() => { setIsEditingName(false); handleUpdate(); }}
                                autoFocus
                                required
                            />
                        ) : (
                            <p onClick={() => setIsEditingName(true)}>{taskData.name}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Description:</label>
                        {isEditingDescription ? (
                            <textarea
                                name="description"
                                value={taskData.description}
                                onChange={handleChange}
                                onBlur={() => { setIsEditingDescription(false); handleUpdate(); }}
                                autoFocus
                                required
                            />
                        ) : (
                            <p onClick={() => setIsEditingDescription(true)}>{taskData.description}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Select Color:</label>
                        {isEditingColor ? (
                            <div className="color-options">
                                {filters.map((color, index) => (
                                    <div
                                        key={index}
                                        className={`color-circle ${taskData.color === color ? 'selected' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => { setTaskData((prevTask) => ({ ...prevTask, color })); handleUpdate(); setIsEditingColor(false); }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="color-circle" style={{ backgroundColor: taskData.color }} onClick={() => setIsEditingColor(true)}></div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Start Date and Time:</label>
                        {isEditingStartDate ? (
                            <input
                                type="datetime-local"
                                name="startDateTime"
                                value={taskData.startDateTime}
                                onChange={handleChange}
                                onBlur={() => { setIsEditingStartDate(false); handleUpdate(); }}
                                autoFocus
                                required
                            />
                        ) : (
                            <p onClick={() => setIsEditingStartDate(true)}>{new Date(taskData.startDateTime).toLocaleString()}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>End Date and Time:</label>
                        {isEditingEndDate ? (
                            <input
                                type="datetime-local"
                                name="endDateTime"
                                value={taskData.endDateTime}
                                onChange={handleChange}
                                onBlur={() => { setIsEditingEndDate(false); handleUpdate(); }}
                                autoFocus
                                required
                            />
                        ) : (
                            <p onClick={() => setIsEditingEndDate(true)}>{new Date(taskData.endDateTime).toLocaleString()}</p>
                        )}
                    </div>

                    <button className="close-modal" onClick={toggleModal}>
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}