import {useState, useEffect} from 'react';
import Axios from "axios";
import React from 'react';

export function useGeneData(ids) {
    const [geneData, setGeneData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (ids && ids.length > 0) { // Only make the requests if ids are provided
            setIsLoading(true);
            console.log(ids);
            Promise.all(ids.map(id => 
                Axios.get(`http://localhost:3001/getGenes/${id}`)
            )).then((responses) => {
                const data = responses.map(response => response.data);
                console.log(data);
                if (data && data.length > 0) {
                    setGeneData(data);
                    setIsLoading(false);
                }
            });
        }
    }, [ids]); // Run this effect whenever the ids change

    return {geneData, isLoading};
};
