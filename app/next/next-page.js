// app/next/next-page.js
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Функция для получения всех makeId через API
const fetchMakeIds = async () => {
    const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.Results.map(make => make.MakeId);
};

// Функция для получения моделей автомобилей
const fetchVehicleModels = async (makeId, year) => {
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const NextPage = () => {
    const router = useRouter();
    const { searchParams } = router;
    const makeId = searchParams.get('makeId');
    const year = searchParams.get('year');

    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadModels = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchVehicleModels(makeId, year);
                setModels(data.Results || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (makeId && year) {
            loadModels();
        }
    }, [makeId, year]);

    // Примерный список makeId, который вы можете заменить на реальный список
    const [allMakeIds, setAllMakeIds] = useState([]);
    useEffect(() => {
        const loadMakeIds = async () => {
            try {
                const ids = await fetchMakeIds();
                setAllMakeIds(ids);
            } catch (err) {
                console.error('Ошибка получения makeId:', err.message);
            }
        };
        loadMakeIds();
    }, []);

    if (loading) return <p className="text-gray-500">Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Selected Vehicle Information</h1>
            <p><strong>Make ID:</strong> {makeId}</p>
            <p><strong>Year:</strong> {year}</p>

            <h2 className="text-xl font-semibold mt-4">Vehicle Models</h2>
            <ul className="list-disc pl-5">
                {models.length > 0 ? (
                    models.map(model => (
                        <li key={model.MakeId} className="mb-2">
                            <strong>{model.MakeName}</strong> (ID: {model.MakeId})
                        </li>
                    ))
                ) : (
                    <p>No models found.</p>
                )}
            </ul>
        </div>
    );
}

export default NextPage;
