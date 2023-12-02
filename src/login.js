import express from 'express';
import { promises as fs } from 'fs';
import multer from 'multer';
import userFunctions from './userdb.js';

//validate_user(username, password)=>(true/false),
//update_user(username, password, email, role, enable)=>(true/false),
//fetch_user(username)=>(user),
//username_exist(username)=>(true/false)
const { validate_user, update_user, fetch_user, username_exist, update_user_pw, update_user_byId, updateimg_user_byId, update_user_byId2, searchuser, actioncount } = userFunctions;

// router handler for POST /login
const router = express();
const form = multer();

router.post('/edit', form.none(), async (req, res) => {
  const { _id, username, email, gender, birthdate } = req.body;
  // console.log(username)
  if (!username || !email || !gender || !birthdate) {
    res.status(400).json({
      status: 'failed',
      message: 'Missing fields',
    });
    return;
  }
  if (username.length < 3) {
    res.status(400).json({
      status: 'failed',
      message: 'Username must be at least 3 characters',
    });
    return;
  }
  
  const info = {
    "timestamp": new Date(),
    "action": 'edit',
    "username": username,
    "email": email,
    "gender": gender,
    "birthdate": birthdate,
  }
  // console.log(_id, username, email, gender, birthdate)
  await actioncount(_id, 'edit', info);
  if (await update_user_byId(_id, username, email, gender, birthdate)) {
    res.json({
      status: 'success',
    });
  } else {
    res.status(500).json({
      status: 'failed',
      message: 'Account upload but unable to save into the database',
    });
  }
});

router.post('/edit2', form.none(), async (req, res) => {
  const { _id, username, email, gender, birthdate, img } = req.body;
  // console.log(username)
  if (!username || !email || !gender || !birthdate) {
    res.status(400).json({
      status: 'failed',
      message: 'Missing fields',
    });
    return;
  }
  if (username.length < 3) {
    res.status(400).json({
      status: 'failed',
      message: 'Username must be at least 3 characters',
    });
    return;
  }

  const info = {
    "timestamp": new Date(),
    "action": 'edit2',
    "username": username,
    "email": email,
    "gender": gender,
    "birthdate": birthdate,
    "img": img,
  }
  await actioncount(_id, 'edit2', info);
  // console.log(_id, username, email, gender, birthdate)
  if (await update_user_byId2(_id, username, email, gender, birthdate, img)) {
    res.json({
      status: 'success',
      user: {
        username,
        email,
        gender,
        birthdate,
        _id,
        img
      },
    });
  } else {
    res.status(500).json({
      status: 'failed',
      message: 'Account created but unable to save into the database',
    });
  }
});

router.post('/account_id', form.none(), async (req, res) => {
  const { username } = req.body;
  const user = await fetch_user(false, username);
  if (user) {
    res.status(200).json({
      status: 'success',
      data: user,
    });
  } else {
    res.status(404).json({
      status: 'failed',
      message: 'User not found',
    });
  }
});

router.post('/uploadImgURL', form.none(), async (req, res) => {
  const { id, img } = req.body;
  const user = await updateimg_user_byId(id, img);
  if (user) {
    res.status(200).json({
      status: 'success',
    });
  } else {
    res.status(404).json({
      status: 'failed',
      message: 'User not found',
    });
  }
});

router.post('/register', form.none(), async (req, res) => {
  const { username, password, email, gender, birthdate, img } = req.body;
  if (!username || !password) {
    res.status(400).json({
      status: 'failed',
      message: 'Missing fields',
    });
    return;
  }
  if (username.length < 3) {
    res.status(400).json({
      status: 'failed',
      message: 'Username must be at least 3 characters',
    });
    return;
  }
  if (await username_exist(username)) {
    res.status(400).json({
      status: 'failed',
      message: `Username ${username} already exists`,
    });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({
      status: 'failed',
      message: 'Password must be at least 8 characters',
    });
    return;
  }
  // if (!email.includes('@')) {
  //   res.status(400).json({
  //     status: 'failed',
  //     message: "Email should be valid",
  //   });
  //   return;
  // }
  // {
  //   "username": "user",
  //   "password": "user1234",
  //   "email": "user@user1234",
  //   "role": "user",
  //   "enabled": true
  // }
  if (await update_user(username, password, email, null, 'user', true, gender, birthdate, img)) {
    const userb = await fetch_user(false, username);
    const info = {
      "timestamp": new Date(),
      "action": 'register',
      "username": username,
      "email": email,
      "gender": gender,
      "birthdate": birthdate,
    }
    await actioncount(userb._id, 'register', info);
    res.json({
      status: 'success',
      user: {
        username: username,
        role: 'user',
      },
    });
  } else {
    res.status(500).json({
      status: 'failed',
      message: 'Account created but unable to save into the database',
    });
  }
});

router.post('/forgot', form.none(), async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const user = await fetch_user(false, username);

    if (password.length < 8) {
      return res.status(400).json({
        status: 'failed',
        message: 'Password must be at least 8 characters',
      });
    }

    if (user.email !== email) {
      return res.json({
        status: 'failed',
        message: 'Your email is incorrect',
      });
    }

    if (await update_user_pw(username, password)) {
      // const userb = await fetch_user(false, username);
      // const info = {
      //   "timestamp": new Date(),
      //   "action": 'forgotpw',
      // }
      // await actioncount(userb._id, 'forgotpw', info);
      return res.json({
        status: 'success',
        user: {
          username: username,
          role: 'user',
        },
      });
    } else {
      return res.status(500).json({
        status: 'failed',
        message: 'Account created but unable to save into the database',
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'failed',
      message: 'Internal server error',
    });
  }
});

router.post('/changepw', form.none(), async (req, res) => {
  try {
    const { username, password } = req.body;
    if (password.length < 8) {
      return res.status(400).json({
        status: 'failed',
        message: 'Password must be at least 8 characters',
      });
    }

    if (await update_user_pw(username, password)) {
      // const userb = await fetch_user(false, username);
      // const info = {
      //   "timestamp": new Date(),
      //   "action": 'changepw',
      // }
      // await actioncount(userb._id, 'changepw', info);
      return res.json({
        status: 'success',
        user: {
          username: username,
          password,
        },
      });
    } else {
      return res.status(500).json({
        status: 'failed',
        message: 'Account created but unable to save into the database',
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'failed',
      message: 'Internal server error',
    });
  }
});

router.get('/search', form.any(), async (req, res) => {
  var { user_id, username } = req.query;
  // console.log(req.query)
  const users = await searchuser(user_id, username);
  if (users) {
    res.json({
      status: 'success',
      users,
    });
  } else {
    res.status(400).json({
      status: 'failed',
      message: 'Unable to get the database!',
    });
  }
});

router.post('/login', form.none(), async (req, res) => {
  req.session.logged = false; // Reset login status
  const { username, password } = req.body;
  const user = await validate_user(username, password);
  if (user) {
    if (user.enabled) {
      req.session.logged = true;
      req.session.username = user.username;
      req.session.role = user.role;
      req.session.timestamp = Date.now();
      // const userb = await fetch_user(false, username);
      // // console.log(userb._id)
      // await actioncount(userb._id, 'login', false);
      res.json({
        status: 'success',
        user: {
          username: user.username,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({
        status: 'failed',
        message: `User '${username}' is currently disabled`,
      });
    }
  } else {
    // const userb = await fetch_user(false, username);
    // // console.log(userb._id)
    // await actioncount(userb._id, 'loginfailed', false);
    res.status(401).json({
      status: 'failed',
      message: 'Incorrect username and password',
    });
  }
});

router.post('/logout', async (req, res) => {
  if (req.session.logged) {
    req.session.destroy();
    res.end();

  } else {
    res.status(401).json({
      status: 'failed',
      message: 'Unauthorized',
    });
  }
});

router.get('/fetch', async (req, res) => {
  const result = await fetch_user(false, req.session.username);
  if (result) {
    res.status(200).json({
      status: 'success',
      data: result,
    });
  } else {
    res.status(404).json({
      status: 'failed',
      message: 'User not found',
    });
  }
});

router.get('/fetchUserId', async (req, res) => {
  // console.log(req.query.userId)
  const user = await fetch_user(req.query.userId, false);
  // console.log(user)
  if (user) {
    res.status(200).json({
      status: 'success',
      user,
    });
  } else {
    res.status(404).json({
      status: 'failed',
      message: 'User not found',
    });
  }
});

router.get('/me', (req, res) => {
  if (req.session.logged) {
    res.json({
      status: 'success',
      user: {
        username: req.session.username,
        role: req.session.role,
      },
    });
  } else {
    res.status(401).json({
      status: 'failed',
      message: 'Unauthorized',
    });
  }
});



export default router;
