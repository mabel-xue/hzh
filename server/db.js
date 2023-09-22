import { MongoClient } from "mongodb";

const uri = "mongodb+srv://mabelxue:DIoBqK0g7AhagyHw@cluster0.niqvsl8.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

export async function connectToDatabase() {
  try {
    const database = client.db('hzh');
    const collection = database.collection('booked_h');
    const cursor =  collection.find()
    const data = await cursor.toArray();

    return data
  } catch {
    return []
  }
}