from pymongo import MongoClient
import json
from bson import json_util


client = MongoClient("mongodb+srv://yoyo458:458458@cluster0.zewcw21.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

db = client['Cancer_db']

collection = db['Gene_data']

data = list(collection.find())


with open('AllGeneData.json', 'w') as file:
    file.write(json.dumps(data, default=json_util.default, indent=4))