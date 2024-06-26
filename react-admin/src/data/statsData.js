import { useState, useEffect } from 'react';
import Axios from 'axios';
import baseUrl from '../baseUrl';

export default function useStatsData(primaryLabels, secondaryData, classificationData, locationData) {
    const [experimentsCount, setExperimentsCount] = useState([]);
    const [publicationsCount, setPublicationsCount] = useState([]);
    // console.log(publicationsCount, experimentsCount)

    useEffect(() => {
        // Only make the request if the data is not empty
        let expCounts = 0;
        if (primaryLabels.length > 0) {
            console.log('primaryLabels', primaryLabels);
            // Fetch Query data based on Labels data
            Promise.all(primaryLabels.map(label =>
                Axios.get(`${baseUrl}/getIds?primaryType=${label}&secondaryType=${secondaryData}&classification=${classificationData}&location=${locationData}`)
            )).then((responses) => {
                // Use the ids from the Query data to fetch Gene data
                responses.forEach(response => {
                    Promise.all(response.data.map(id => Axios.get(`${baseUrl}/getQuery/${id}`)))
                        .then((queryResponses) => {
                            console.log('Query', queryResponses);
                            const combinedData = queryResponses.map(response => response.data).flat();
                            console.log('combinedData', combinedData);
                            expCounts = combinedData.length;
                            console.log('expCounts', expCounts);

                            // Collect all QueryIds
                            const pubMeds = combinedData
                            .filter(item => item.value && item.value.PubMedIds)
                            .map(item => item.value.PubMedIds)
                            .flat();
                            const uniquePubMeds = [...new Set(pubMeds)];
                            console.log('pubMeds', uniquePubMeds);
                            
                            const pubMedsCount = uniquePubMeds.length;

                            setExperimentsCount(expCounts);
                            setPublicationsCount(pubMedsCount);
                        });
                });
            });
        }
    }, [primaryLabels, secondaryData, classificationData, locationData]);
    
    return { experimentsCount, publicationsCount };
    
}
