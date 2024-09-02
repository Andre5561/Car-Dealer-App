"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; 

const Start = () => {
    const [start, SetStart] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [years, setYears] = useState([]);
    const router = useRouter(); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);
                if (Array.isArray(data.Results)) {
                    SetStart(data.Results);
                } else {
                    console.error('data.Results is not an array:', data.Results);
                }
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const yearArray = [];
        for (let year = 2015; year <= currentYear; year++) {
            yearArray.push(year);
        }
        setYears(yearArray);
    }, []);

    const isNextButtonEnabled = selectedType && selectedYear;

    const handleNextClick = () => {
        const makeId = start.find(item => item.MakeName === selectedType)?.MakeId; // Найдите MakeId по выбранному MakeName
        if (makeId) {
            router.push(`/result/${makeId}/${selectedYear}`); // Перенаправление на новый маршрут с параметрами
        } else {
            console.error('Selected type not found in start data');
        }
    }

    return (
        <div>
            <h1 className="car-select">Select Car!</h1>
            <div>
                <label htmlFor="vehicleType" className="vehicle-Type">Vehicle Type:</label>
                <select
                    id="vehicleType"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                    <option value="" className="vehicle-select">Select a vehicle type</option>
                    {start.map(({ MakeId, MakeName }) => (
                        <option key={MakeId} value={MakeName}>
                            {MakeName}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="modelYear" className="model-year">Model Year:</label>
                <select
                    id="modelYear"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                >
                    <option value="" className="selectyear">Select a model year</option>
                    {years.map(year => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <button 
                    className="next-btn"
                    onClick={handleNextClick} 
                    disabled={!isNextButtonEnabled}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Start;
