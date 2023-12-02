import express from 'express';
import session from 'express-session';
import login from '../login.js';
import movie from '../movie.js';
import house from '../house.js';
import moviesession from '../moviesession.js';
import mongostore from 'connect-mongo';
import client from '../dbclient.js';

const app = express();
// Apply express-session middleware to the whole application
app.use(
  session({
    secret: 'eie4432_group_project',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // maxAge: 60 * 60 * 1000, // Set the idle timeout (60 minutes in this example)
      maxAge: 24 * 60 * 60 * 1000, // Set the idle timeout (60 minutes in this example)
    },
    store: mongostore.create({
      client,
      dbName: 'GoMdb',
      collectionName: 'session',
    }),
    rolling: true, // Reset the idle timeout on every request
  })
);

// Request handler for GET /
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

app.use('/auth', login);
app.use('/movie', movie);
app.use('/house', house);
app.use('/moviesession', moviesession);

// Apply express.static middleware to the route "/"
app.use('/', express.static('static'));

app.listen(8080, () => {
  const currentDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Hong_Kong',
    hour12: false,
  });
  console.log(currentDate);
  console.log('Server started at http://127.0.0.1:8080');
});

module.exports = app;

