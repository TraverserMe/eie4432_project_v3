import express from 'express';
import multer from 'multer';
import moviesessionFunctions from './moviesessiondb.js';
import userFunctions from './userdb.js';

import movieFunctions from './moviedb.js';
import houseFunctions from './housedb.js';

//update_moviesession(moviesessionname, password, email, role, enable)=>(true/false),
//fetch_moviesession(moviesessionname)=>(moviesession),
//moviesessionname_exist(moviesessionname)=>(true/false)
const {
  insert_moviesession,
  update_moviesession,
  fetch_moviesession,
  moviesessionname_exist,
  delete_moviesession,
  get_all_moviesessions,
  searchMovieSessions,
  update_moviesession_seats,
  update_moviesession_History,
  update_user_History,
} = moviesessionFunctions;
const {
  server_to_user_message,
} = userFunctions;
// const { update_movie, fetch_movie, moviename_exist, get_all_movies, delete_movie } = movieFunctions;
// const { fetch_house, housename_exist, get_all_houses } = houseFunctions;

// router handler for POST /login
const router = express();
const form = multer();

router.get('/getall', async (req, res) => {
  const moviesessions = await get_all_moviesessions();
  if (moviesessions) {
    res.json({
      status: 'success',
      moviesessions,
    });
  } else {
    res.status(400).json({
      status: 'failed',
      message: 'Unable to get the database!',
    });
  }
});

router.get('/search', form.any(), async (req, res) => {
  var { moviename, house, starttime, endtime, amount } = req.query;
  if (!amount) { amount = 50 };
  const moviesessions = await searchMovieSessions(moviename, house, starttime, endtime, amount);
  if (moviesessions) {
    res.json({
      status: 'success',
      moviesessions,
    });
  } else {
    res.status(400).json({
      status: 'failed',
      message: 'Unable to get the database!',
    });
  }
});

router.post('/add', form.any(), async (req, res) => {
  const {
    moviename,
    house,
    starttime,
    endtime,
    seatsstring,
  } = req.body;
  // if (moviesessions.find(moviesession =>  === add_moviesession_movie_name ||)) {
  //     res.status(400).json({
  //         status: 'failed',
  //         message: 'Moviename is used, plese edit rather than add movie!',
  //     });
  //     return;
  // }
  const result = await insert_moviesession(
    moviename,
    house,
    starttime,
    endtime,
    JSON.parse(seatsstring)
  );
  console.log(result);
  if (result) {
    res.json({
      status: 'success',
      moviesession: {
        _id: result.insertedId,
        moviename: moviename,
        house: house,
        starttime: starttime,
        endtime: endtime,
      },
    });
  } else {
    res.status(500).json({
      status: 'failed',
      message: 'Session created but unable to save into the database',
    });
  }
});

// router.post('/edit', form.any(), async (req, res) => {
//   const { session_id, moviename, house, starttime, endtime, seatsstring } = req.body;
//   // if (moviesessions.find(moviesession =>  === edit_moviesession_movie_name ||)) {
//   //     res.status(400).json({
//   //         status: 'failed',
//   //         message: 'Moviename is used, plese edit rather than edit movie!',
//   //     });
//   //     return;
//   // }
//   const result = await update_moviesession(session_id, moviename, house, starttime, endtime, JSON.parse(seatsstring));
//   if (result) {
//     res.json({
//       status: 'success',
//       moviesession: {
//         moviename: moviename,
//         house: house,
//         starttime: starttime,
//         endtime: endtime,
//       },
//     });
//   } else {
//     res.status(500).json({
//       status: 'failed',
//       message: 'Account created but unable to save into the database',
//     });
//   }
//   const moviesession = await fetch_moviesession(session_id);
//   const paidHistory = moviesession.PaidHistory;
//   paidHistory.forEach((item) => {
//     const { username } = item;
//     const messageObject = {
//       title: "moviesession edit",
//       message: session_id + starttime + endtime;
//     };
//     await server_to_user_message(username, messageObject);
//   });

// });

router.post('/edit', form.any(), async (req, res) => {
  const { session_id, moviename, house, starttime, endtime, seatsstring } = req.body;

  try {
    // Check if moviesession exists and handle accordingly
    // if (moviesessions.find(moviesession => moviesession === edit_moviesession_movie_name ||)) {
    //     res.status(400).json({
    //         status: 'failed',
    //         message: 'Moviename is used, please edit rather than edit movie!',
    //     });
    //     return;
    // }

    const result = await update_moviesession(session_id, moviename, house, starttime, endtime, JSON.parse(seatsstring));

    if (result) {
      res.json({
        status: 'success',
        moviesession: {
          moviename: moviename,
          house: house,
          starttime: starttime,
          endtime: endtime,
        },
      });
    } else {
      res.status(500).json({
        status: 'failed',
        message: 'Account created but unable to save into the database',
      });
    }

    const moviesession = await fetch_moviesession(session_id);
    const paidHistory = moviesession.PaidHistory;
    try{
      for (const item of paidHistory) {
        const { username } = item;
        const messageObject = {
          title: "moviesession edit",
          message: `${session_id}|${moviename}|${starttime}|${endtime}`
        };
        await server_to_user_message(username, messageObject);
      }
    } catch (error){
      console.log(error)
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'failed',
      message: 'An error occurred while processing the request',
    });
  }
});

function checkAllSeatUnavailability(seats, seatsindb, from) {
  const unavailableSeats = [];

  for (const seat of seats) {
    if (seat === "0") {
      break
    }
    const row = seat.charAt(0);
    const column = +seat.substring(1);
    const isAvailable = seatsindb[row]?.[column - 1] === from;
    if (!isAvailable) {
      unavailableSeats.push(seat);
    }
  }

  return unavailableSeats;
}

function replaceSeats(seatArray, seatMap, from, to) {
  // Loop through each seat in the array
  seatArray.forEach(seat => {
    const row = seat.charAt(0);
    const column = +seat.substring(1);

    // Check if the seat exists in the seat map
    if (seatMap[row] && seatMap[row][column - 1]) {
      if (seatMap[row][column - 1] === from) {
        seatMap[row][column - 1] = to;
      }
    }
  });

  return seatMap;
}

router.post('/changeSessionSeat', form.any(), async (req, res) => {
  const { session_id, seats, from, to, username, price, adults, students, elderlies } = req.body;
  const fetch_result = await fetch_moviesession(session_id);
  const seatsarray = seats.split(',').filter(seat => seat !== "0");
  console.log(seatsarray)
  const unavailableSeats = checkAllSeatUnavailability(seatsarray, fetch_result.seats, from);
  if (unavailableSeats.length === 0) {
    console.log('All selected seats are available.');
    const newseatmap = replaceSeats(seatsarray, fetch_result.seats, from, to);
    const result = await update_moviesession_seats(session_id, newseatmap);
    if (result) {
      var utcTime = new Date();
      var hkOptions = { timeZone: "Asia/Hong_Kong" };
      var hkTime = utcTime.toLocaleString("en-US", hkOptions);
      const newHistory =
      {
        session_id,
        'username': username,
        'seats': seatsarray,
        'from': from,
        'to': to,
        'time': hkTime.replace('T', ' '),
        'price': price,
        'adults': adults,
        'students': students,
        'elderlies': elderlies,
      }
      var state;
      if (from == "0") {
        state = "pending";
      } else if (from == "R") {
        state = "paid";
      }
      const historyResult = await update_moviesession_History(session_id, newHistory, state);
      if (historyResult) {
        var utcTime2 = new Date();
        var hkOptions2 = { timeZone: "Asia/Hong_Kong" };
        var hkTime2 = utcTime2.toLocaleString("en-US", hkOptions2);
        console.log(historyResult);
        const newHistory2 =
        {
          'session_id':session_id,
          'Movie': fetch_result.moviename,
          'seats': seatsarray,
          'from': fetch_result.starttime,
          'to': fetch_result.endtime,
          'time': hkTime2.replace('T', ' '),
          'price': price,
          'adults': adults,
          'students': students,
          'elderlies': elderlies,
        }
        const userHistoryResult = await update_user_History(username, newHistory2, state);
        if (userHistoryResult) {
          console.log(userHistoryResult);
          res.json({
            status: 'success',
            moviesession: {
              session_id,
              moviename: fetch_result.moviename,
              house: fetch_result.house,
              starttime: fetch_result.starttime,
              endtime: fetch_result.endtime,
              seats: seatsarray,
            },
          });
        }
      }
    } else {
      res.status(500).json({
        status: 'failed',
        message: 'Account created but unable to save into the database',
      });
    }
  } else {
    console.log('The following selected seats are not available:', unavailableSeats);
    res.json({
      status: 'failed',
      moviesession: {
        session_id,
        moviename: fetch_result.moviename,
        house: fetch_result.house,
        starttime: fetch_result.starttime,
        endtime: fetch_result.endtime,
        seats: seats,
      },
      unavailableSeats: unavailableSeats,
    });
    return;
  }

});

router.post('/delete', form.any(), async (req, res) => {
  const { session_id, moviename, house, starttime, endtime, seatsstring } = req.body;
  const result = await update_moviesession(session_id);
  if (result) {
    res.json({
      status: 'success',
      moviesession: {
        moviename: moviename,
        house: house,
        starttime: starttime,
        endtime: endtime,
      },
    });
  } else {
    res.status(500).json({
      status: 'failed',
      message: 'Account created but unable to save into the database',
    });
  }
});

export default router;
