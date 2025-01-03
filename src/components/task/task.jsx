import React, {useState} from "react";
import "./task.css";

export default function Task({isOpen, toggleModal, task}) {
    if (!isOpen) return null;

    return (
        <>
        <div className="modal">
            <div className="overlay"></div>
            <div className="modal-content">
                <h2>Add Task</h2>
                <button className="close-modal" onClick={toggleModal}>
                    Close
                </button>
            </div>
        </div>
        </>
    );
}