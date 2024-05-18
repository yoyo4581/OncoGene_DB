var neo4j = require('neo4j-driver');

const scopeSearch = async (arrayName, scope) => {
    const URI = "bolt://localhost:7687"
    const USER = "neo4j"
    const PASSWORD = "458458Yoyo"
    let driver

    try {
        driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
        const serverInfo = await driver.getServerInfo()
        console.log('Connection established');
        console.log(serverInfo);
        console.log(scope);

        const { records, summary, keys } = await driver.executeQuery(
            "UNWIND $arrayName AS gene_name MATCH (start:Genes {name: gene_name}) CALL apoc.path.expandConfig(start, {labelFilter:'+Genes', uniqueness:'NODE_GLOBAL', bfs:true, limit:$scope}) YIELD path WITH relationships(path) as rels WHERE size(rels) >0 RETURN rels",
            {
                arrayName: arrayName,
                scope: scope,
            },
            { database: 'neo4j' }
        );

        console.log(
            `>> The query ${summary.query.text} ` +
            `returned ${records.length} records ` +
            `in ${summary.resultAvailableAfter} ms.` +
            `records ${records.field}`
        );

        const nodeMap = new Map();

        // Iterate through each record
        records.forEach(record => {
            const rels = record.get("rels");
            rels.forEach(rel => {
                const start = rel.start.toNumber();
                const end = rel.end.toNumber();
                const pathway = rel.properties.Pathway;
                console.log({start},{end},{pathway});

                if (start && end && pathway) {
                    if (!nodeMap.has(start)) {
                        nodeMap.set(start, { pathwayVals: [] });
                    }
                    if (!nodeMap.has(end)) {
                        nodeMap.set(end, {pathwayVals: []});
                    }
    
                    nodeMap.get(start).pathwayVals.push(pathway);
                    nodeMap.get(end).pathwayVals.push(pathway);
                }
            });
        });
        const pathwayCount = new Map();

        // Iterate through each record
        records.forEach(record => {
            const rels = record.get("rels");
            rels.forEach(rel => {
                const start = rel.start.toNumber();
                const end = rel.end.toNumber();
                // console.log({start},{end},{pathway});
                pathwayCount.set({source: nodeMap.get(start).pathwayVals, target: nodeMap.get(end).pathwayVals})
            });
        });

        // Assuming pathwayCount is the Map containing source and target pathways and their counts

        const finalArray = [];

        pathwayCount.forEach((value, key) => {
            const { source, target } = key;
            
            // Iterate through each combination of source and target pathways
            source.forEach(sourcePathway => {
                target.forEach(targetPathway => {
                    // Create a unique key for each pairwise comparison
                    const pairwiseKey = `${sourcePathway} -> ${targetPathway}`;
                    console.log(pairwiseKey);
                    value = 1
                    // Check if the entry already exists in the final array
                    const existingEntryIndex = finalArray.findIndex(entry => entry.source === sourcePathway && entry.target === targetPathway);

                    console.log(existingEntryIndex);
                    console.log(finalArray);
                    
                    if (existingEntryIndex !== -1) {
                        // If it exists, increment the count
                        finalArray[existingEntryIndex].value += value;
                    } else {
                        // If it doesn't exist, add a new entry
                        finalArray.push({ source: sourcePathway, target: targetPathway, value: value });
                    }
                });
            });
        });


        console.log('nodeMap', nodeMap);
        driver.close();
        console.log('pathwayCount', pathwayCount);
        console.log('finalArray', finalArray);

        // Check if pathwayCount is empty
        if (finalArray.size === 0) {
            return {}; // Return an empty array
        } else {
            return { finalArray }; // Return pathwayCount
        }
    } catch (err) {
        console.log(`Connection error\n${err}\nCause: ${err.cause}`);
    }
};

module.exports = scopeSearch;
