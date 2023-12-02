import fs from 'fs';
import client from './dbclient.js';
import { ObjectId } from 'mongodb';
import session from 'express-session';

async function moviesessionname_exist(name) {
  try {
    if (await fetch_moviesession(name)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Unable to fetch from database!', error);
    throw error;
  }
}

async function fetch_moviesession(_id) {
  try {
    const moviesessions = client.db('GoMdb').collection('moviesessions');
    const sessionId = new ObjectId(_id);
    // console.log(sessionId)
    const moviesession = await moviesessions.findOne({ _id: sessionId });
    return moviesession;
  } catch (error) {
    console.error('Unable to fetch from database!', error);
    throw error;
  }
}

async function searchMovieSessions(moviename, house, starttime, endtime) {
  try {
    const moviesessions = client.db('GoMdb').collection('moviesessions');
    const query = {};
    if (moviename) {
      query.moviename = moviename;
    }
    if (house) {
      query.house = house;
    }
    if (starttime) {
      query.starttime = { $gte: starttime };
    }
    if (endtime) {
      query.endtime = { $lte: endtime };
    }
    if (!starttime && !endtime) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
      query.starttime = { $gte: currentDateTime };
    }

    const result = await moviesessions.find(query).sort({ starttime: 1 }).limit(50).toArray();
    return result;
  } catch (error) {
    console.error('Unable to fetch from database!', error);
    throw error;
  }
}

async function get_all_moviesessions() {
  try {
    const moviesessions = client.db('GoMdb').collection('moviesessions');

    // Find all objects in the collection
    const moviesessionsArray = await moviesessions.find().toArray();

    return moviesessionsArray;
  } catch (error) {
    console.error('Unable to get the database!', error);
    return false;
  }
}

async function insert_moviesession(moviename, house, starttime, endtime, seats) {
  // console.log(seats)
  try {
    const moviesessions = client.db('GoMdb').collection('moviesessions');
    const result = await moviesessions.insertOne({ moviename, house, starttime, endtime, seats });

    if (result.insertedCount === 0) {
      console.log('Edited 1 session');
    } else {
      console.log('Added 1 session');
    }

    return result;
  } catch (error) {
    console.error('Unable to update the database!', error);
    return false;
  }
}

async function update_moviesession(_id, moviename, house, starttime, endtime, seats) {
  try {
    const moviesessions = client.db('GoMdb').collection('moviesessions');
    const sessionId = new ObjectId(_id); // The _id of the document you want to update
    const updatedData = {
      moviename: moviename,
      house: house,
      starttime: starttime,
      endtime: endtime,
      seats: seats,
    };
    const result = await moviesessions.updateOne({ _id: sessionId }, { $set: updatedData });

    if (result.modifiedCount === 1) {
      console.log('Updated 1 session');
    } else {
      console.log('Session not found');
    }

    return result;
  } catch (error) {
    console.error('Unable to update the database!', error);
    return false;
  }
}

async function update_moviesession_seats(_id, seats) {
  try {
    const moviesessions = client.db('GoMdb').collection('moviesessions');
    const sessionId = new ObjectId(_id); // The _id of the document you want to update
    const result = await moviesessions.updateOne({ _id: sessionId }, { $set: { seats: seats } });

    if (result.modifiedCount === 1) {
      console.log('Updated 1 session');
    } else {
      console.log('Session not found');
    }

    return result;
  } catch (error) {
    console.error('Unable to update the database!', error);
    return false;
  }
}

async function update_moviesession_History(_id, newHistory,state) {
  try {
    const moviesessions = client.db('GoMdb').collection('moviesessions');
    const sessionId = new ObjectId(_id); // The _id of the document you want to update
    var result;
    if(state == "pending") {
      result = await moviesessions.updateOne({ _id: sessionId }, { $push: { PendingHistory: newHistory } });
    }else if(state == "paid"){
      result = await moviesessions.updateOne({ _id: sessionId }, { $push: { PaidHistory: newHistory } });
    }

    if (result.modifiedCount === 1) {
      console.log('Updated 1 session');
    } else {
      console.log('Session not found');
    }

    return result;
  } catch (error) {
    console.error('Unable to update the database!', error);
    return false;
  }
}

async function update_user_History(username, newHistory, state) {
  try {
    const users = client.db('GoMdb').collection('users');
    var result;
    if(state == "pending") {
      result = await users.updateOne({ username: username }, { $push: {PendingHistory: newHistory } });
    }else if(state == "paid"){
      result = await users.updateOne({ username: username }, { $push: {PaidHistory: newHistory } });
    }

    if (result.modifiedCount === 1) {
      console.log('Updated 1 history');
    } else {
      console.log('Users not found');
    }

    return result;
  } catch (error) {
    console.error('Unable to update the database!', error);
    return false;
  }
}

async function delete_moviesession(_id) {
  try {
    const moviesessions = client.db('GoMdb').collection('moviesessions');
    const sessionId = new ObjectId(_id);
    const result = await moviesessions.deleteOne({ _id: sessionId });
    if (result.deletedCount === 1) {
      console.log('deleted 1 moviesession');
      return true;
    } else {
      console.log('deleted 0 moviesession');
      return false;
    }
  } catch (error) {
    console.error('Unable to get the database!', error);
    return false;
  }
}

export default {
  fetch_moviesession,
  moviesessionname_exist,
  insert_moviesession,
  update_moviesession,
  get_all_moviesessions,
  searchMovieSessions,
  delete_moviesession,
  update_moviesession_seats,
  update_moviesession_History,
  update_user_History,
};
