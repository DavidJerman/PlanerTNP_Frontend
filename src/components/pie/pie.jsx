import axios from 'axios';
import Cookie from "js-cookie";
import { useEffect, useRef, useState } from "react";
import '../../App.css';
import env from "../../env.json";
import { useTranslation } from 'react-i18next';
import { PieChart} from '@mui/x-charts/PieChart';

function Pie() {
    const { t } = useTranslation();
    const [pieData, setPieData] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [signedIn, setSignedIn] = useState(false);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [currentWeek, setCurrentWeek] = useState(getStartOfWeek(new Date()));
    const [itemData, setItemData] = useState();
    useEffect(() => {
        if (Cookie.get("signed_in_user") !== undefined) {
            const user = JSON.parse(Cookie.get("signed_in_user"));
            setSignedIn(true);
            axios.get(`${env.api}/task/user/${user._id}/tasks`).then((response) => {
                setTasks(response.data.tasks);
                countTasks(response.data.tasks);
            }).catch((error) => {
                console.log('Error:', error);
            });
        }
    }, [currentWeek]);

    function countTasks(tasks) {
        const startOfWeek = getStartOfWeek(currentWeek);
        const endOfWeek = addDays(startOfWeek, 6);
    
        const filteredTasks = tasks.filter(task => {
            const taskDate = new Date(task.startDateTime);
            return taskDate >= startOfWeek && taskDate <= endOfWeek;
        });

        setFilteredTasks(filteredTasks);

        const colorCounts = {};
        filteredTasks.forEach(task => {
            const type = task.type || "Undefined";
            colorCounts[type] = (colorCounts[type] || 0) + 1;
        });

        

    // Transform into an array for the PieChart
    const pieData = Object.entries(colorCounts).map(([label, value]) => ({ label, value }));
    console.log(pieData);

    setPieData(pieData); // Save the pie data for rendering
    }
    

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


    // const onItemClick = (event, params) => {
    //     if (!params || params.dataIndex === undefined) {
    //         console.error("No dataIndex found in click event");
    //         return;
    //     }
    

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button className="change-week" onClick={handlePrevWeek}>←</button>
                <h2>{t("calendar.week")} {currentWeek.toDateString()}</h2>
                <button className="change-week" onClick={handleNextWeek}>→</button>
            </div>

            <PieChart
            series={[
                {
                    data : pieData
                },
            ]}

                    width={500}
                    height={500}
                    // // onClick={(event, params) => handlePieClick(event, params)}
                    // onItemClick={(event, d) => setItemData(d)}
                    slotProps={{
                        legend: {
                            direction: 'row',
                            position: { vertical: 'bottom', horizontal: 'middle' },
                            padding: 0,
                        },
                    }}

                />

        </div>
    );
}

export default Pie;