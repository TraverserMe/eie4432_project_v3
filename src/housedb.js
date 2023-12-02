import fs from 'fs';
import client from './dbclient.js';
import path from "path";

async function housename_exist(name) {
  try {
    if (await fetch_house(name)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Unable to fetch from database!', error);
    throw error;
  }
}

async function fetch_house(name) {
  try {
    const houses = client.db('GoMdb').collection('houses');
    const house = await houses.findOne({ house: name });

    return house;
  } catch (error) {
    console.error('Unable to fetch from database!', error);
    throw error;
  }
}


async function get_all_houses() {
  try {
    const houses = client.db('GoMdb').collection('houses');

    // Find all objects in the collection
    const housesArray = await houses.find().toArray();

    return housesArray;
  } catch (error) {
    console.error('Unable to get the database!', error);
    return false;
  }
}

async function createhouseJSON() {
  const directoryPath = './static/JSON/';
  const housesArray= [];

  fs.readdirSync(directoryPath)
    .filter((file) => file.startsWith('house'))
    .forEach((file) => {
      if (file != "houses.json"){
        const jsonData = fs.readFileSync(path.join(directoryPath, file), 'utf-8');
        housesArray.push(JSON.parse(jsonData));
      }
    });
  fs.writeFileSync('./static/JSON/houses.json', JSON.stringify(housesArray, null, 2));
  console.log('Combined JSON file created: ./static/JSON/houses.json');
}

async function init_db() {
  try {
    await createhouseJSON();
    // Create a reference to the houses collection
    const houses = client.db('GoMdb').collection('houses');
    // Check if the houses collection is empty
    const count = await houses.countDocuments();
    if (count === 0) {
      // Read data from the local house database (houses.json)
      const houseData = fs.readFileSync('./static/JSON/houses.json', 'utf8');
      const housesArray = JSON.parse(houseData);
      // Insert house objects into the collection
      const result = await houses.insertMany(housesArray);
      // Print the number of house records inserted
      console.log(`Added ${result.insertedCount} houses`);
    }
  } catch (err) {
    // Print an error message if initialization fails
    console.error(err + 'Unable to initialize the database!');
  }
}
init_db().catch(console.dir);
export default { fetch_house, housename_exist, get_all_houses, init_db };
