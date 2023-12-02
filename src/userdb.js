import fs from 'fs';
import client from './dbclient.js';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';

function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

function hashPassword(password, salt) {
  let hmac = crypto.createHmac('sha512', salt);
  hmac.update(password);
  let hashedPassword = hmac.digest('hex');
  for (let i = 1; i < 1000; i++) {
    hmac = crypto.createHmac('sha512', salt);
    hmac.update(hashedPassword);
    hashedPassword = hmac.digest('hex');
  }
  return hashedPassword;
}

async function username_exist(username) {
  try {
    if (await fetch_user(false, username)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Unable to fetch from database!', error);
    throw error;
  }
}

// only _id or only username, never both please
async function fetch_user(_id, username) {
  try {
    const users = client.db('GoMdb').collection('users');
    // Search by _id
    let user = false;
    if (_id && !username) {
      const user_id = new ObjectId(_id);
      user = await users.findOne({ _id: user_id });
      return user;
    }
    // Search by username
    if (username && !_id) {
      user = await users.findOne({ username: username });
      return user;
    }
    return user;
  } catch (error) {
    console.error('Unable to fetch from the database!', error);
    throw error;
  }
}
// console.log(await fetch_user('6554b15438e17a3ce7722325', false));
// console.log(await fetch_user(false, 'Chun'));

async function update_user(username, password, email, img, role, enabled, gender, birthdate) {
  try {
    const users = client.db('GoMdb').collection('users');
    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);
    const passwordHash = hashedPassword;
    const passwordSalt = salt;
    const result = await users.updateOne(
      { username },
      { $set: { username, passwordHash, passwordSalt, email, img, role, enabled, gender, birthdate } },
      { upsert: true }
    );

    if (result.upsertedCount === 0) {
      console.log('Updated 0 user');
    } else {
      console.log('Updated 1 user');
    }

    return true;
  } catch (error) {
    console.error('Unable to update the database!', error);
    return false;
  }
}

async function update_user_byId(_id, username, email, gender, birthdate) {
  try {
    const users = client.db('GoMdb').collection('users');
    const user_id = new ObjectId(_id);
    console.log(user_id);
    const result = await users.updateOne(
      { _id: user_id },
      { $set: { username, email, gender, birthdate } },
      { upsert: false }
    );

    if (result.upsertedCount === 0) {
      console.log('Added 0 user');
    } else {
      console.log('Added 1 user');
    }

    return true;
  } catch (error) {
    console.error('Unable to update the database!', error);
    return false;
  }
}

async function update_user_byId2(_id, username, email, gender, birthdate, img) {
  try {
    const users = client.db('GoMdb').collection('users');
    const user_id = new ObjectId(_id);
    const result = await users.updateOne(
      { _id: user_id },
      { $set: { username, email, gender, birthdate, img } },
      { upsert: false }
    );

    if (result.upsertedCount === 0) {
      console.log('Updated 0 user');
    } else {
      console.log('Updated 1 user');
    }

    return true;
  } catch (error) {
    console.error('Unable to update the database!', error);
    return false;
  }
}

async function updateimg_user_byId(_id, img) {
  try {
    const users = client.db('GoMdb').collection('users');
    const user_id = new ObjectId(_id);
    const result = await users.updateOne(
      { _id: user_id },
      { $set: { img } },
      { upsert: false }
    );

    if (result.upsertedCount === 0) {
      console.log('Updated 0 user');
    } else {
      console.log('Updated 1 user');
    }

    return true;
  } catch (error) {
    console.error('Unable to update the database!', error);
    return false;
  }
}

async function update_user_pw(username, password) {
  try {
    const users = client.db('GoMdb').collection('users');
    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);
    const passwordHash = hashedPassword;
    const passwordSalt = salt;
    const result = await users.updateOne(
      { username },
      { $set: { passwordHash, passwordSalt } },
    );

    if (result.upsertedCount === 0) {
      console.log('Updated 0 user');
    } else {
      console.log('Updated 1 user');
    }

    return true;
  } catch (error) {
    console.error('Unable to update the database!', error);
    return false;
  }
}

function checkPassword(password, hashedPassword, salt) {
  const hashedInput = hashPassword(password, salt);
  return hashedInput === hashedPassword;
}

async function validate_user(username, password) {
  if (username === '' || password === '') {
    return false;
  }

  try {
    const users = client.db('GoMdb').collection('users');
    //no pw hashing version
    // var user = await users.findOne({ username, password });
    // if (user) {
    //   return user;
    // } else {
    //   return false;
    // }
    //-------------------------------------------------

    //pw hashing
    const user = await users.findOne({ username });
    if (checkPassword(password, user.passwordHash, user.passwordSalt)) {
      return user;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Unable to fetch from database!', error);
    return false;
  }
}

async function server_to_user_message(username, message) {
  if (username === '' || message === '') {
    return false;
  }

  try {
    const users = client.db('GoMdb').collection('users');
    const user = await users.findOne({ username });
    if (user) {
      // Add the message to the user's array of messages
      const updatedMessages = user.messages ? [...user.messages, message] : [message];
      // Store the updated array of messages in the user's session or database
      await users.updateOne({ username }, { $set: { messages: updatedMessages } });
    }
  } catch (error) {
    console.error('Unable to fetch from database!', error);
    return false;
  }
}

async function actioncount(_id, action, history) {
  if (_id == "" || action === '') {
    return false;
  }

  try {
    const users = client.db('GoMdb').collection('users');
    const user_id = new ObjectId(_id);
    const user = await users.findOne({ _id: user_id });
    if (user) {
      // Increment the specified field by 1
      var updateField = {};
      updateField[`count.${action}count`] = 1;

      // Add the action to the history array
      var updateQuery = { $inc: updateField };
      if (history) {
        updateQuery.$push = { history: history };
      }
      // console.log(updateQuery)
      var updatedUser = await users.updateOne(
        { _id: user_id },
        updateQuery,
        { returnOriginal: false }
      );

      return updatedUser.value;
    }
  } catch (error) {
    console.error('Unable to fetch from database!', error);
    return false;
  }
}


async function searchuser(_id, username) {
  try {
    const users = client.db('GoMdb').collection('users');
    const query = {};
    if (_id) {
      const user_id = new ObjectId(_id);
      query._id = user_id;
    } else
      if (username) {
        query.username = { $regex: '^' + username, $options: 'i' };
      }
    // console.log(query)
    const result = await users.find(query).sort({ username: 1 }).limit(50).toArray();
    return result;
  } catch (error) {
    console.error('Unable to fetch from database!', error);
    throw error;
  }
}


async function init_db() {
  try {
    // Create a reference to the users collection
    const users = client.db('GoMdb').collection('users');
    // Check if the users collection is empty
    const count = await users.countDocuments();
    if (count === 0) {
      // Read data from the local user database (users.json)
      const userData = await fs.readFile('static/JSON/users.json', 'utf8');
      const usersArray = JSON.parse(userData);
      // Insert user objects into the collection
      const result = await users.insertMany(usersArray);
      // Print the number of user records inserted
      console.log(`Added ${result.insertedCount} users`);
    }
  } catch (err) {
    // Print an error message if initialization fails
    console.error(err + 'Unable to initialize the database!');
  }
}
init_db().catch(console.dir);
export default { validate_user, update_user, update_user_byId, fetch_user, username_exist, init_db, update_user_pw, updateimg_user_byId, update_user_byId2, server_to_user_message, searchuser, actioncount };
