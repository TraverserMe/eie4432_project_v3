import fs from 'fs/promises';
import client from './dbclient.js';

// {
//   "name": "AI Creator",
//   "type": "sci-fi",
//   "aPrice": "100",
//   "sPrice": "50",
//   "ePrice": "20",
//   "house": "houseA",
//   "img": "./images/movie_img/aicreator.jpg"
// },

async function moviename_exist(name) {
  try {
    if (await fetch_movie(name)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Unable to fetch from database!', error);
    throw error;
  }
}

async function fetch_movie(name) {
  try {
    const movies = client.db('GoMdb').collection('movies');
    const movie = await movies.findOne({ name });

    return movie;
  } catch (error) {
    console.error('Unable to fetch from database!', error);
    throw error;
  }
}


async function update_movie(name, type, aPrice, sPrice, ePrice, duration, image) {
  try {
    const movies = client.db('GoMdb').collection('movies');
    const result = await movies.updateOne(
      { name },
      { $set: { name, type, aPrice, sPrice, ePrice, duration, image } },
      { upsert: true }
    );

    if (result.upsertedCount === 0) {
      console.log('Edited 1 movie');
    } else {
      console.log('Added 1 movie');
    }

    return true;
  } catch (error) {
    console.error('Unable to update the database!', error);
    return false;
  }
}

async function update_movie2(name, type, aPrice, sPrice, ePrice, duration) {
  try {
    const movies = client.db('GoMdb').collection('movies');
    const result = await movies.updateOne(
      { name },
      { $set: { name, type, aPrice, sPrice, ePrice, duration} },
      { upsert: false }
    );

    if (result.upsertedCount === 0) {
      console.log('Edited 1 movie');
    } else {
      console.log('Added 1 movie');
    }

    return true;
  } catch (error) {
    console.error('Unable to update the database!', error);
    return false;
  }
}

async function get_all_movies() {
  try {
    const movies = client.db('GoMdb').collection('movies');

    // Find all objects in the collection
    const moviesArray = await movies.find().toArray();

    return moviesArray;
  } catch (error) {
    console.error('Unable to get the database!', error);
    return false;
  }
}

async function delete_movie(moviename) {
  try {
    const movies = client.db('GoMdb').collection('movies');
    const result = await movies.deleteOne({ name: moviename });
    if (result.deletedCount === 1) {
      console.log('deleted 1 movie');
      return true;
    }else{
      console.log('deleted 0 movie');
      return false;
    }
  } catch (error) {
    console.error('Unable to get the database!', error);
    return false;
  }

}

async function init_db() {
  try {
    // Create a reference to the movies collection
    const movies = client.db('GoMdb').collection('movies');
    // Check if the movies collection is empty
    const count = await movies.countDocuments();
    if (count === 0) {
      // Read data from the local movie database (movies.json)
      const movieData = await fs.readFile('./static/JSON/movies.json', 'utf8');
      const moviesArray = JSON.parse(movieData);
      // Insert movie objects into the collection
      const result = await movies.insertMany(moviesArray);
      // Print the number of movie records inserted
      console.log(`Added ${result.insertedCount} movies`);
    }
  } catch (err) {
    // Print an error message if initialization fails
    console.error(err + 'Unable to initialize the database!');
  }
}
init_db().catch(console.dir);
export default { update_movie, fetch_movie, moviename_exist, get_all_movies, delete_movie, init_db,  update_movie2 };