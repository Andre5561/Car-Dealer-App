"use client";


import React, { useState, useEffect } from 'react';

const fetchVehicleModels = async (makeId, year) => {
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const ResultPage = ({ params }) => {
    const { makeId, year } = params;
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1 className='models'>Vehicle Models for Make ID {makeId} and Year {year}</h1>
            <ul>
                {models.length > 0 ? (
                    models.map(model => (
                        <li key={model.Model_ID}>
                            <strong>{model.Model_Name}</strong> (ID: {model.Model_ID})
                        </li>
                    ))
                ) : (
                    <p>No models found.</p>
                )}
            </ul>
        </div>
    );
};

export default ResultPage;
