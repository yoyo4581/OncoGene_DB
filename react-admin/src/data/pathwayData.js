var neo4j = require('neo4j-driver');

const executeNMatch = async (arrayName) => {
  // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
  const URI = "bolt+s://kg-pathway.westus.cloudapp.azure.com:7999"
  const USER = "neo4j"
  const PASSWORD = "458458Yoyo"
  let driver
  console.log(URI)

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
    const serverInfo = await driver.getServerInfo()
    console.log('Connection established')
    console.log(serverInfo)


    const { records, summary } = await driver.executeQuery(
        "WITH $array as list_genes UNWIND list_genes as gene_in MATCH (g_sub:Genes {name:gene_in})-[r]-(g_obj:Genes) WITH g_sub, r.Pathway as pathway, collect(g_obj.name) as neighbors WITH g_sub, pathway, neighbors, size(neighbors) as count RETURN g_sub.name as Gene, pathway, neighbors, count ORDER BY count DESC",
        { array: arrayName },
        { database: 'neo4j' }
    );
    
    // Summary information
    console.log(
        `>> The query ${summary.query.text} ` +
        `returned ${records.length} records ` +
        `in ${summary.resultAvailableAfter} ms.`
    );
    
    return records;

  } catch (err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`);
  }
};

module.exports = executeNMatch;
  