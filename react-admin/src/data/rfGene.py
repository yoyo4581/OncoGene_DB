from pymongo import MongoClient
import json
from bson.objectid import ObjectId
import pandas as pd

# Create a client connection to your MongoDB instance
client = MongoClient("mongodb+srv://yoyo458:458458@cluster0.zewcw21.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

# Connect to your 'test' database
db = client['Cancer_db']

# Get your 'Gene_data' collection
query_data = db['Query_data']
label_data = db['Labels']


f = open('AllGeneData.json')

data= json.load(f)

all_geneStore = {}

for doc in data:
    all_gene = set()
    for field, value in doc.items():
        if field=='_id':
            continue
        if field=='link':
            link_id = value['$oid']
            QueryDoc = query_data.find_one({'_id': ObjectId(link_id)})
            link_query = QueryDoc['link']
            LabelDoc = label_data.find_one({'_id': link_query})
            label = ''
            for field, value in LabelDoc.items():
                if field!='_id' and field!='link':
                    if value is not None:
                        label+=' '+value
        for gene in value:
            if len(gene)>1:
                all_gene.add(gene)

    all_gene = list(all_gene)
    if len(all_geneStore) == 0:
        all_geneStore[label] = [all_gene]
    elif label not in all_geneStore.keys():
        all_geneStore[label] = [all_gene]
    else:
        all_geneStore[label].append(all_gene)
    

f.close()
print(all_geneStore)

def create_dataframe(geneDict):
    all_genes = set(gene for genes in geneDict.values() for sublist in genes for gene in sublist)
    data = []
    for label, entries in geneDict.items():
        for entry in entries:
            row = {gene: (gene in entry) for gene in all_genes}
            row['Entry'] = label
            data.append(row)
    df = pd.DataFrame(data)
    for col in df.columns:
        if col != 'Entry':
            df[col] = df[col].astype(int)
    return df

# Call the function with your dictionary
df = create_dataframe(all_geneStore)
print(df)

# Write DataFrame to CSV
# df.to_csv('output.csv', index=False)

