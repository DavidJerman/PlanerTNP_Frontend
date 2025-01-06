import axios from 'axios';
import Cookie from "js-cookie";
import React, { useEffect, useState } from 'react';
import env from "../../env.json";
import { useTranslation } from 'react-i18next';
import './todoList.css';

function TodoList() {
  const { t } = useTranslation(); // Use the translation hook
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    urgent: false,
    color: '#3498db',
    startDateTime: '',
    endDateTime: '',
  });

  const filters = [
    '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#e67e22',
    '#e74c3c', '#34495e', '#95a5a6', '#7f8c8d',
  ];

  useEffect(() => {
    const user = JSON.parse(Cookie.get("signed_in_user"));
    axios.get(`${env.api}/task/user/${user._id}/tasks`).then((response) => {
      setTasks(response.data.tasks);
    }).catch((error) => {
      console.log(error);
    });
  }, [showModal]);

  const handleAddTask = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewTask({
      name: '',
      urgent: false,
      color: '#3498db',
      startDateTime: '',
      endDateTime: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.name.trim() === '') return;

    const startDateTime = new Date(newTask.startDateTime);
    const endDateTime = new Date(newTask.endDateTime);

    if (endDateTime < startDateTime) {
      alert(t('todo.alertEndDate'));  // Translated alert
      return;
    }

    const user = JSON.parse(Cookie.get("signed_in_user"));
    axios.post(`${env.api}/task/user/${user._id}/tasks`, newTask, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      handleCloseModal();
    }).catch((error) => {
      console.log(error);
    });
  };

  const renderTasks = () => {
    return tasks.map((task, index) => (
        <li key={index} className="task-item">
          <div className="task-content">
            <div className="color-circle" style={{ backgroundColor: task.color }}></div>
            <span className={`task-name ${task.urgent ? 'urgent' : ''}`}>
            {task.name}
          </span>
            <span className="task-date">
            {new Date(task.startDateTime).toLocaleString('en-GB')} - {new Date(task.endDateTime).toLocaleString('en-GB')}
          </span>
          </div>
        </li>
    ));
  };

  return (
      <div className="page-background">
        <div className="todo-container">
          <h1>{t('todo.title')}</h1>  {/* Translated title */}
          <div className="todo-list">
            <div className="todo-header">
              <button className="add-task-button" onClick={handleAddTask}>
                {t('todo.addTaskButton')}  {/* Translated button */}
              </button>
            </div>
            <ul>{renderTasks()}</ul>
          </div>
        </div>

        {showModal && (
            <div className="modal-overlay" onClick={handleCloseModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{t('todo.addNewTask')}</h2> {/* Translated heading */}
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="taskName">{t('todo.taskNameLabel')}</label> {/* Translated label */}
                    <input
                        type="text"
                        id="taskName"
                        name="name"
                        value={newTask.name}
                        onChange={handleInputChange}
                        required
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('todo.selectColorLabel')}</label> {/* Translated label */}
                    <div className="color-options">
                      {filters.map((color, index) => (
                          <div
                              key={index}
                              className={`color-circle ${newTask.color === color ? 'selected' : ''}`}
                              style={{ backgroundColor: color }}
                              onClick={() =>
                                  setNewTask((prevTask) => ({ ...prevTask, color }))
                              }
                          />
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="startDateTime">{t('todo.startDateTimeLabel')}</label> {/* Translated label */}
                    <input
                        type="datetime-local"
                        id="startDateTime"
                        name="startDateTime"
                        value={newTask.startDateTime}
                        onChange={handleInputChange}
                        required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="endDateTime">{t('todo.endDateTimeLabel')}</label> {/* Translated label */}
                    <input
                        type="datetime-local"
                        id="endDateTime"
                        name="endDateTime"
                        value={newTask.endDateTime}
                        onChange={handleInputChange}
                        required
                        min={newTask.startDateTime}
                    />
                  </div>

                  <div className="form-group checkbox-group">
                    <label>
                      <input
                          type="checkbox"
                          name="urgent"
                          checked={newTask.urgent}
                          onChange={handleInputChange}
                      />
                      {t('todo.markAsUrgent')} {/* Translated label */}
                    </label>
                  </div>

                  <div className="modal-buttons">
                    <button type="submit" className="submit-button">
                      {t('todo.addTask')}  {/* Translated button */}
                    </button>
                    <button type="button" className="cancel-button" onClick={handleCloseModal}>
                      {t('todo.cancelButton')}  {/* Translated button */}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
}

export default TodoList;
