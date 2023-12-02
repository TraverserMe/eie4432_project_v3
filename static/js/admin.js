var allmovies; //update when switch page that have movie
var allhouses; //update when switch page that have house
var allsessions; //store sessions after searching
var seatsinmem; //update when building svg, store the seats from db
var svgElement; //store the svg element after building svg for clicking action
var selectedSession_info; //[ _id, moviename, house, starttime, endtime], this is after selecting session

$(document).ready(function () {
  //auth login information
  $.ajax({
    url: '/auth/me',
    method: 'GET',
    success: function (response) {
      if (response.status === 'success') {
        // User is logged in, handle the response data
        console.log('Logged in user:', response.user.username);
        console.log('Role:', response.user.role);
        if (response.user.role === 'admin') {
          $('.container').show();
        } else {
          window.history.back();
        }

        $('#login').hide();
        $('#logout').show();
        $('#username-lbl').html('Username: ' + response.user.username);
      } else {
        alert('Unknown error');
      }
    },
    error: function (xhr, status, error) {
      // Error handling
      if (xhr.status === 401) {
        console.log(xhr.responseJSON.message);
        $('#login').show();
        $('#logout').hide();
        window.location.href = 'login.html';
      } else {
        console.error('Error:', error);
        alert('Unknown error');
      }
    },
  });

  $('#logout-btn').on('click', function (event) {
    event.preventDefault();
    $.ajax({
      url: '/auth/logout',
      method: 'POST',
      success: function () {
        // Logout successful, handle any necessary actions
        console.log('Logout successful');
        window.location.href = 'index.html';
      },
      error: function (xhr, status, error) {
        // Error handling
        console.log('AJAX request failed:', error);
      },
    });
  });
  //auth login information end

  //page manangement and information prefill
  //hide all page
  $('#add_movie, #edit_movie, #delete_movie, #add_moviesession, #edit_moviesession, #delete_moviesession, #search_moviesession, #search_user').hide();
  //show selected page ...
  $('.switch-btn').on('click', function (event) {
    event.preventDefault();
    allmovies = [];
    allhouses = [];
    allsessions = [];
    seatsinmem = [];
    svgElement = false;
    selectedSession_info = [];
    // clear housemap content after switching page
    $('.housemap').hide();
    $('.seating-plan').html(``);
    $('#add_movie, #edit_movie, #delete_movie, #add_moviesession, #edit_moviesession, #delete_moviesession, #search_moviesession, #search_user').hide();
    $('#' + $(this).attr('id').replace('_switch', '')).show();
    //prefill selection from ajax
    if (
      $(this).attr('id') === 'edit_movie_switch' ||
      $(this).attr('id') === 'delete_movie_switch' ||
      $(this).attr('id') === 'add_moviesession_switch' ||
      $(this).attr('id') === 'edit_moviesession_switch' ||
      $(this).attr('id') === 'delete_moviesession_switch' ||
      $(this).attr('id') === 'search_moviesession_switch'
    ) {
      var movienameid = $(this).attr('id').replace('switch', 'name').replace('moviesession', 'moviesession_movie');
      if ($(this).attr('id') === 'edit_moviesession_switch' || $(this).attr('id') === 'delete_moviesession_switch' || $(this).attr('id') === 'search_moviesession_switch') {
        movienameid = movienameid.replace('moviesession_', 'moviesession_select_');
      }
      //prefill movie
      $.ajax({
        url: 'movie/getall',
        method: 'GET',
        success: function (response) {
          if (response.status === 'success') {
            allmovies = response.movies;
            // Clear existing options
            $('#' + movienameid).empty();
            // Add default option
            // console.log($(this).attr('id'));
            if (
              movienameid === 'edit_moviesession_select_movie_name' ||
              movienameid === 'delete_moviesession_select_movie_name' ||
              movienameid === 'search_moviesession_select_movie_name'
            ) {
              $('#' + movienameid).append('<option value="" selected>Select a movie</option>');
            } else {
              $('#' + movienameid).append('<option value="" disabled selected>Select a movie</option>');
            }
            // Iterate over movies and add options
            response.movies.forEach(function (movie) {
              $('#' + movienameid).append('<option value="' + movie.name + '">' + movie.name + '</option>');
            });
          } else {
            alert(response.message);
          }
        },
        error: function (xhr, status, error) {
          if (xhr.status === 400) {
            alert(xhr.responseJSON.message);
          } else {
            alert('error: ' + xhr.status);
          }
        },
      });
    }
    if (
      $(this).attr('id') === 'add_moviesession_switch' ||
      $(this).attr('id') === 'edit_moviesession_switch' ||
      $(this).attr('id') === 'delete_moviesession_switch' ||
      $(this).attr('id') === 'search_moviesession_switch'
    ) {
      //clear info
      $('#' + $(this).attr('id').replace('switch', 'start_time')).val('');
      $('#' + $(this).attr('id').replace('switch', 'end_time')).val('');
      $('#' + $(this).attr('id').replace('switch', 'duration_label')).html('');
      //prefill house
      var housenameid = $(this).attr('id').replace('switch', 'house');
      if ($(this).attr('id') === 'edit_moviesession_switch' || $(this).attr('id') === 'delete_moviesession_switch' || $(this).attr('id') === 'search_moviesession_switch') {
        housenameid = housenameid.replace('moviesession_', 'moviesession_select_');
      }
      $.ajax({
        url: 'house/getall',
        method: 'GET',
        success: function (response) {
          if (response.status === 'success') {
            allhouses = response.houses;
            // Clear existing options
            $('#' + housenameid).empty();
            // Add default option
            if (housenameid === 'edit_moviesession_select_house') {
              $('#' + housenameid).append('<option value="" selected>Select a house</option>');
            } else {
              $('#' + housenameid).append('<option value="" disabled selected>Select a house</option>');
            }
            if (housenameid === 'search_moviesession_select_house') {
              $('#' + housenameid).append('<option value="all">All</option>');
            } else {
              $('#' + housenameid).append('<option value="all" disabled>All</option>');
            }
            // Iterate over houses and add options
            response.houses.forEach(function (house) {
              $('#' + housenameid).append('<option value="' + house.house + '">' + house.house + '</option>');
            });
          } else {
            alert(response.message);
          }
        },
        error: function (xhr, status, error) {
          if (xhr.status === 400) {
            alert(xhr.responseJSON.message);
          } else {
            alert('error: ' + xhr.status);
          }
        },
      });
    }
  });
  //prefill information after selecting movies
  $('#edit_movie_name').on('change', function () {
    const movie = allmovies.find((movie) => movie.name === $('#edit_movie_name').val());
    $('#edit_movie_type').val(movie.type);
    $('#edit_movie_adult_fee').val(movie.aPrice);
    $('#edit_movie_student_fee').val(movie.sPrice);
    $('#edit_movie_elderly_fee').val(movie.ePrice);
    $('#edit_movie_duration').val(movie.duration);
    // $("#edit_movie_image").val(movie.img);
  });

  //show duration after selecting movie on session
  $('#add_moviesession_movie_name,#edit_moviesession_select_movie_name').on('change', function (event) {
    event.preventDefault();
    const movie = allmovies.find((movie) => movie.name === $(this).val());
    var duration_label;
    if ($(this).attr('id') == 'edit_moviesession_select_movie_name') {
      duration_label = $('#' + $(this).attr('id').replace('select_movie_name', 'duration_label'));
    } else {
      duration_label = $('#' + $(this).attr('id').replace('movie_name', 'duration_label'));
    }
    try {
      duration_label.html('Duration: ' + movie.duration + ' mins');
    } catch (error) {
      duration_label.html('');
    }
    $('#' + $(duration_label).attr('id').replace('duration_label', 'start_time')).val('');
    $('#' + $(duration_label).attr('id').replace('duration_label', 'end-time')).val('');
  });

  //search session
  $('#edit_moviesession_search_btn, #delete_moviesession_search_btn, #search_moviesession_search_btn').on('click', function (event) {
    event.preventDefault();
    const search_btn_id = $(this).attr('id');
    const select_movie_name = $('#' + search_btn_id.replace('search_btn', 'select_movie_name')).val();
    const select_house = $('#' + search_btn_id.replace('search_btn', 'select_house')).val();
    const select_start_time = $('#' + search_btn_id.replace('search_btn', 'select_start_time')).val();
    const select_end_time = $('#' + search_btn_id.replace('search_btn', 'select_end_time')).val();
    const formData = {
      moviename: select_movie_name,
      house: select_house,
      starttime: select_start_time,
      endtime: select_end_time,
    };
    var sessionId = $('#' + $(this).attr('id').replace('search_btn', 'session'));
    $.ajax({
      url: '/moviesession/search',
      method: 'GET',
      data: formData,
      success: function (response) {
        if (response.status === 'success') {
          // Clear existing options
          $(sessionId).empty();
          // Add default option
          // $(sessionId).append('<option value="" disabled selected>Select a Session</option>');
          // Iterate over houses and add options
          allsessions = response.moviesessions;
          response.moviesessions.forEach(function (session) {
            const sessionTag =
              session.moviename + ' | ' + session.house + ' | ' + session.starttime + ' | ' + session.starttime;
            sessionId.append('<option value="' + session._id + ' | ' + sessionTag + '">' + sessionTag + '</option>');
          });
        } else {
          alert(response.message);
        }
      },
      error: function (xhr, status, error) {
        if (xhr.status === 400) {
          alert(xhr.responseJSON.message);
        } else {
          alert('error: ' + xhr.status);
        }
      },
    });
  });

  //after selecting house or session
  $('#add_moviesession_house, #edit_moviesession_session, #delete_moviesession_session, #search_moviesession_session').on('change', function () {
    var svgElementid = $(this).attr('id').replace('house', 'seating_plan');
    svgElementid = svgElementid.replace('_session', '_seating_plan');
    var selectedSession_house;
    var house;
    if ($(this).attr('id') == 'add_moviesession_house') {
      selectedSession_house = $(this).val();
      house = allhouses.find((house) => house.house == selectedSession_house);
      seatsinmem = generateSeatStructure(house.seats);
    } else if (
      $(this).attr('id') == 'edit_moviesession_session' ||
      $(this).attr('id') == 'delete_moviesession_session' ||
      $(this).attr('id') == 'search_moviesession_session'
    ) {
      selectedSession_info = $(this).val().split(' | ');
      selectedSession_house = selectedSession_info[2];
      house = allhouses.find((house) => house.house == selectedSession_house);
      seatsinmem = allsessions.find((session) => session._id == selectedSession_info[0]).seats;
    }
    refresh_house(house, svgElementid);
    const housemapid = $(this).attr('id') + 'map';
    $('#' + housemapid)
      .slideDown(1000)
      .show();
    if ($(this).attr('id') == 'edit_moviesession_session') {
      $('#edit_moviesession_movie_name').empty();
      allmovies.forEach(function (movie) {
        $('#edit_moviesession_movie_name').append('<option value="' + movie.name + '">' + movie.name + '</option>');
      });
      $('#edit_moviesession_house').empty();
      allhouses.forEach(function (house) {
        $('#edit_moviesession_house').append('<option value="' + house.house + '">' + house.house + '</option>');
      });
      $('#' + $(this).attr('id').replace('_session', '_start_time')).val(selectedSession_info[3]);
      $('#' + $(this).attr('id').replace('_session', '_end_time')).val(selectedSession_info[4]);
      $('#' + $(this).attr('id').replace('_session', '_movie_name')).val(selectedSession_info[1]);
      $('#' + $(this).attr('id').replace('_session', '_house')).val(selectedSession_info[2]);
    }
    if ($(this).attr('id') == 'search_moviesession_session') {
      $('#search_moviesession_movie_name').empty();
      allmovies.forEach(function (movie) {
        $('#search_moviesession_movie_name').append('<option value="' + movie.name + '">' + movie.name + '</option>');
      });
      $('#search_moviesession_house').empty();
      allhouses.forEach(function (house) {
        $('#search_moviesession_house').append('<option value="' + house.house + '">' + house.house + '</option>');
      });
      $('#' + $(this).attr('id').replace('_session', '_start_time')).val(selectedSession_info[3]);
      $('#' + $(this).attr('id').replace('_session', '_end_time')).val(selectedSession_info[4]);
      $('#' + $(this).attr('id').replace('_session', '_movie_name')).val(selectedSession_info[1]);
      $('#' + $(this).attr('id').replace('_session', '_house')).val(selectedSession_info[2]);
    }
  });
  function refresh_house(house, svgElementid) {
    if (svgElementid != 'search_moviesession_seating_plan') {
      svgElement = $(`#${svgElementid}`);
      // var svgElement = $("#add_moviesession_seating_plan");
      // var svgElement = $(".seating-plan");
      svgElement.html(`
        <rect x="15.3%" y="-3%" width="64%" height="5%" id="${house.house}" style="fill:rgb(14, 41, 41)"></rect>
        <text x="45%" y="1%" font-family="Verdana" font-size="18" style="fill:rgb(255, 255, 255)">screen</text>
        <circle cx="30%" cy="90%" r="2.5%" fill="green" stroke="white" stroke-width="0.5%"></circle>
        <text x="33%" y="89%" font-family="Verdana" font-size="18" style="fill:rgb(0, 0, 0)">Avaliable</text>
        <circle cx="45%" cy="90%" r="2.5%" fill="black" stroke="black" stroke-width="0.5%"></circle>
        <text x="48%" y="89%" font-family="Verdana" font-size="18" style="fill:rgb(0, 0, 0)">Unavaliable</text>
        <circle cx="62%" cy="90%" r="2.5%" fill="black" stroke="red" stroke-width="0.5%"></circle>
        <text x="65%" y="89%" font-family="Verdana" font-size="18" style="fill:rgb(0, 0, 0)">Booked</text>
      `);
      var circleElements = '';
      $.each(house.seats, function (index, seat) {
        const seatNumber = seat.seatNumber;
        const seatRow = seatNumber.charAt(0);
        const seatCol = +seatNumber.substring(1);
        const seatvalue = seatsinmem[seatRow][seatCol - 1];
        if (seatvalue === 'X') {
          circleElements += `
            <circle cx="${seat.position.x}" cy="${seat.position.y}" r="3%" fill="black" stroke="black" stroke-width="0.5%" id="${seat.seatNumber}" style="cursor: pointer;"></circle>
            <text x="${seat.position.x}" y="${seat.position.y}" text-anchor="middle" alignment-baseline="central" style="cursor: pointer;">${seat.seatNumber}</text>
        `;
        } else if (seatvalue === 1 || seatvalue === "1") {
          circleElements += `
            <circle cx="${seat.position.x}" cy="${seat.position.y}" r="3%" fill="black" stroke="red" stroke-width="0.5%" id="${seat.seatNumber}"style="cursor: not-allowed;"></circle>
            <text x="${seat.position.x}" y="${seat.position.y}" text-anchor="middle" alignment-baseline="central" style="cursor: not-allowed;">${seat.seatNumber}</text>
        `;
        } else if (seatvalue === 0 || seatvalue === "0") {
          circleElements += `
            <circle cx="${seat.position.x}" cy="${seat.position.y}" r="3%" fill="green" stroke="white" stroke-width="0.5%" id="${seat.seatNumber}" style="cursor: pointer;"></circle>
            <text x="${seat.position.x}" y="${seat.position.y}" text-anchor="middle" alignment-baseline="central" style="cursor: pointer;">${seat.seatNumber}</text>
        `;
        } else if (seatvalue === "R") {
          circleElements += `
          <circle cx="${seat.position.x}" cy="${seat.position.y}" r="3%" fill="black" stroke="yellow" stroke-width="0.5%" id="${seat.seatNumber}" style="cursor: pointer;"></circle>
          <text x="${seat.position.x}" y="${seat.position.y}" text-anchor="middle" alignment-baseline="central" style="cursor: pointer;">${seat.seatNumber}</text>
        `;
        }
      });

      svgElement.append(circleElements);
      svgElement.html(svgElement.html());
      $('#seat1_alphabet,#seat2_alphabet,#seat3_alphabet,#seat4_alphabet').html(
        `<option value="default">Select a Letter</option>`
      );
      $('#seat1_index,#seat2_index,#seat3_index,#seat4_index').html(`<option value="default">Select a Number</option>`);
      let seat_Alphabet = '';
      let seat_Alphabet_temp = [];
      $.each(house.seats, function (index, seat) {
        // console.log(seat.seatNumber.charAt(0));
        if (seat_Alphabet_temp.indexOf(seat.seatNumber.charAt(0)) == -1) {
          seat_Alphabet_temp.push(seat.seatNumber.charAt(0));
        }
      });
      // console.log(seat_Alphabet_temp);
      $.each(seat_Alphabet_temp, function (index, seat) {
        // console.log(seat.seatNumber.charAt(0));
        seat_Alphabet += `
            <option value="${seat}">${seat}</option>
            `;
      });
      $('#seat1_alphabet,#seat2_alphabet,#seat3_alphabet,#seat4_alphabet').append(seat_Alphabet);
    } else {
      svgElement = $(`#${svgElementid}`);
      // var svgElement = $("#add_moviesession_seating_plan");
      // var svgElement = $(".seating-plan");
      svgElement.html(`
        <rect x="15.3%" y="-3%" width="64%" height="5%" id="${house.house}" style="fill:rgb(14, 41, 41)"></rect>
        <text x="45%" y="1%" font-family="Verdana" font-size="18" style="fill:rgb(255, 255, 255)">screen</text>
        <circle cx="30%" cy="90%" r="2.5%" fill="green" stroke="white" stroke-width="0.5%"></circle>
        <text x="33%" y="89%" font-family="Verdana" font-size="18" style="fill:rgb(0, 0, 0)">Avaliable</text>
        <circle cx="45%" cy="90%" r="2.5%" fill="black" stroke="black" stroke-width="0.5%"></circle>
        <text x="48%" y="89%" font-family="Verdana" font-size="18" style="fill:rgb(0, 0, 0)">Unavaliable</text>
        <circle cx="62%" cy="90%" r="2.5%" fill="black" stroke="red" stroke-width="0.5%"></circle>
        <text x="65%" y="89%" font-family="Verdana" font-size="18" style="fill:rgb(0, 0, 0)">Booked</text>
      `);
      var circleElements = '';
      $.each(house.seats, function (index, seat) {
        const seatNumber = seat.seatNumber;
        const seatRow = seatNumber.charAt(0);
        const seatCol = +seatNumber.substring(1);
        const seatvalue = seatsinmem[seatRow][seatCol - 1];
        if (seatvalue === 'X') {
          circleElements += `
            <circle cx="${seat.position.x}" cy="${seat.position.y}" r="3%" fill="black" stroke="black" stroke-width="0.5%" id="${seat.seatNumber}" style="cursor: pointer;"></circle>
            <text x="${seat.position.x}" y="${seat.position.y}" text-anchor="middle" alignment-baseline="central" style="cursor: pointer;">${seat.seatNumber}</text>
        `;
        } else if (seatvalue === 1 || seatvalue === "1") {
          circleElements += `
            <circle cx="${seat.position.x}" cy="${seat.position.y}" r="3%" fill="black" stroke="red" stroke-width="0.5%" id="${seat.seatNumber}"style="cursor: pointer;"></circle>
            <text x="${seat.position.x}" y="${seat.position.y}" text-anchor="middle" alignment-baseline="central" style="cursor: pointer;">${seat.seatNumber}</text>
        `;
        } else if (seatvalue === 0 || seatvalue === "0") {
          circleElements += `
            <circle cx="${seat.position.x}" cy="${seat.position.y}" r="3%" fill="green" stroke="white" stroke-width="0.5%" id="${seat.seatNumber}" style="cursor: pointer;"></circle>
            <text x="${seat.position.x}" y="${seat.position.y}" text-anchor="middle" alignment-baseline="central" style="cursor: pointer;">${seat.seatNumber}</text>
        `;
        } else if (seatvalue === "R") {
          circleElements += `
          <circle cx="${seat.position.x}" cy="${seat.position.y}" r="3%" fill="black" stroke="yellow" stroke-width="0.5%" id="${seat.seatNumber}" style="cursor: pointer;"></circle>
          <text x="${seat.position.x}" y="${seat.position.y}" text-anchor="middle" alignment-baseline="central" style="cursor: pointer;">${seat.seatNumber}</text>
        `;
        }
      });

      svgElement.append(circleElements);
      svgElement.html(svgElement.html());
    }
  }
  function generateSeatStructure(seatsmap) {
    const seatStructure = {};
    seatsmap.forEach((seat) => {
      const { seatNumber } = seat;
      const row = seatNumber.charAt(0);
      const column = parseInt(seatNumber.substring(1));
      if (!seatStructure[row]) {
        seatStructure[row] = Array(column).fill("0");
      } else {
        const currentRowLength = seatStructure[row].length;
        if (column > currentRowLength) {
          seatStructure[row].length = column;
          seatStructure[row].fill("0", currentRowLength);
        }
      }
    });

    return seatStructure;
  }

  $('#add_moviesession_seating_plan, #edit_moviesession_seating_plan').on('click', 'circle, text', function () {
    var elementId = $(this).attr('id');
    var tableId = $(this).text();
    var element;
    // console.log(seatsinmem);
    if (elementId) {
      element = this;
    } else if (tableId) {
      element = $('#' + tableId);
      elementId = tableId;
    }
    //check circle or text is clicked
    if (element) {
      if ($(element).attr('stroke') === 'white') {
        // Change the fill color to black
        $(element).attr('fill', 'black');
        $(element).attr('stroke', 'black');
        const seatRow = elementId.charAt(0);
        const seatCol = +elementId.substring(1);
        seatsinmem[seatRow][seatCol - 1] = 'X';
      } else if ($(element).attr('stroke') === 'black') {
        // Change the fill color to black
        $(element).attr('fill', 'green');
        $(element).attr('stroke', 'white');
        const seatRow = elementId.charAt(0);
        const seatCol = +elementId.substring(1);
        seatsinmem[seatRow][seatCol - 1] = "0";
      }
    }
  });

  //show all the seat information
  $("#search_moviesession_all_seat_btn").on('click', function () {
    $('#seat_infor').text('');
    var infor = '';
    allsessions.forEach(function (session) {
      console.log(session.PaidHistory);
      const history = session.PaidHistory;
      if (history) {
        history.forEach(function (paid) {
          console.log(paid.seats)
          infor += "Customer: " + paid.username + '<br>';
          infor += "Seats: "
          for (var i = 0; i < paid.seats.length; i++) {
            infor += paid.seats[i] + ' ';
          }
          infor += " | Paid Time: " + paid.time + '<br>';
        });
      }
    });
    $('#seat_infor').append(infor);
  });

  $('#search_moviesession_seating_plan').on('click', 'circle, text', function () {
    $('#seat_infor').text('');
    var elementId = $(this).attr('id');
    var tableId = $(this).text();
    var element;
    if (elementId) {
      element = this;
    } else if (tableId) {
      element = $('#' + tableId);
      elementId = tableId;
    }
    $('#seat_infor').append(elementId)
    console.log(elementId);
    //check circle or text is clicked
    if (element) {
      // console.log(allsessions);
      const seatRow = elementId.charAt(0);
      const seatCol = +elementId.substring(1);
      const seatvalue = seatsinmem[seatRow][seatCol - 1];
      if (seatvalue === 'X') {
        $('#seat_infor').append(' | Unavaliable');
      } else if (seatvalue === 1 || seatvalue === "1") {
        $('#seat_infor').append(' | Booked');
        var infor = '';
        allsessions.forEach(function (session) {
          console.log(session.PaidHistory);
          const history = session.PaidHistory;
          if (history) {
            history.forEach(function (pending) {
              console.log(pending.seats)
              if (pending.seats.includes(elementId)) {
                infor += "Customer: " + pending.username + '<br>';
                infor += session.moviename + ' | ' + session.house + ' | ' + session.starttime + ' | ' + session.starttime + '<br>';
                infor += "Seats: "
                for (var i = 0; i < pending.seats.length; i++) {
                  infor += pending.seats[i] + ' ';
                }
              }
            });
          }
          // const sessionTag =
          //   session.moviename + ' | ' + session.house + ' | ' + session.starttime + ' | ' + session.starttime;
          //   if(session.seats[seatRow][seatCol - 1] === 1){
          //     infor += sessionTag + '<br>';
          //   }
        });
        $('#seat_infor').append('<br>' + infor);
      } else if (seatvalue === 0 || seatvalue === "0") {
        $('#seat_infor').append(' | Avaliable');
      } else if (seatvalue === "R") {
        $('#seat_infor').append(' | Reserved');
      }

    }
  });

  $('.datetime').on('change', function () {
    const datetimeid = $(this).attr('id');
    var otherid;
    var movieid;
    movieid = datetimeid.replace('start_time', 'movie_name');
    movieid = movieid.replace('end_time', 'movie_name');
    var movie;
    if (movieid == 'add_moviesession_movie_name') {
      if (!$('#add_moviesession_movie_name').val()) {
        $(this).val('');
        return;
      }
      movie = allmovies.find((movie) => movie.name === $('#' + movieid).val());
    } else if (movieid == 'edit_moviesession_movie_name') {
      if (!$('#edit_moviesession_session').val()) {
        $(this).val('');
        return;
      }
      movie = allmovies.find((movie) => movie.name === selectedSession_info[1]);
    }
    const duration = movie.duration;
    if (datetimeid.includes('start')) {
      otherid = $(this).attr('id').replace('start', 'end');
      const startTime = $(this).val();
      const endTime = addMinutesToDateString(startTime, duration);
      $('#' + otherid).val(endTime);
    } else {
      otherid = $(this).attr('id').replace('end', 'start');
      const endTime = $(this).val();
      const startTime = addMinutesToDateString(endTime, -duration);
      $('#' + otherid).val(startTime);
    }
  });
  function addMinutesToDateString(dateString, minutesToAdd) {
    const dateTime = new Date(dateString);
    dateTime.setTime(dateTime.getTime() + minutesToAdd * 60000);
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, '0');
    const day = String(dateTime.getDate()).padStart(2, '0');
    const hours = String(dateTime.getHours()).padStart(2, '0');
    const minutes = String(dateTime.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  //page manangement and information prefill end

  //update form
  // $('#add_movie_btn').on('click', function (event) {
  //   if (!window.confirm('Are you sure you want to add?')) {
  //     return;
  //   }
  //   event.preventDefault();
  //   const add_movie_name = $('#add_movie_name').val();
  //   const add_movie_type = $('#add_movie_type').val();
  //   const add_movie_adult_fee = $('#add_movie_adult_fee').val();
  //   const add_movie_student_fee = $('#add_movie_student_fee').val();
  //   const add_movie_elderly_fee = $('#add_movie_elderly_fee').val();
  //   const add_movie_duration = $('#add_movie_duration').val();
  //   const add_image_url = $('#add_movie_image_message').text();

  //   if (s
  //     !add_movie_name ||
  //     !add_movie_type ||
  //     !add_movie_adult_fee ||
  //     !add_movie_student_fee ||
  //     !add_movie_elderly_fee ||
  //     !add_movie_duration
  //   ) {
  //     alert('Information cannot be empty');
  //     return;
  //   }
  //   if (add_image_url == "") {
  //     alert('Please upload image or wait for it');
  //     return;
  //   }
  //   const formData = new FormData();
  //   formData.append('add_movie_name', add_movie_name);
  //   formData.append('add_movie_type', add_movie_type);
  //   formData.append('add_movie_adult_fee', add_movie_adult_fee);
  //   formData.append('add_movie_student_fee', add_movie_student_fee);
  //   formData.append('add_movie_elderly_fee', add_movie_elderly_fee);
  //   formData.append('add_movie_duration', add_movie_duration);
  //   formData.append('add_image_url', add_image_url);

  //   $.ajax({
  //     url: '/movie/add',
  //     method: 'POST',
  //     data: formData,
  //     processData: false,
  //     contentType: false,
  //     success: function (response) {
  //       if (response.status === 'success') {
  //         alert('Movie: ' + response.movie.name + ' is added');
  //         window.location.href = '/admin.html';
  //       } else {
  //         alert(response.message);
  //       }
  //     },
  //     error: function (xhr, status, error) {
  //       if (xhr.status === 400) {
  //         alert(xhr.responseJSON.message);
  //       } else {
  //         alert('error: ' + xhr.status);
  //       }
  //     },
  //   });
  // });

  $('#delete_movie_btn').on('click', function (event) {
    if (!window.confirm('Are you sure you want to delete?')) {
      return;
    }
    event.preventDefault();
    if ($('#delete_movie_name').val() === $('#delete_movie_input').val()) {
      const formData = new FormData();
      formData.append('delete_movie_name', $('#delete_movie_name').val());
      $.ajax({
        url: 'movie/delete',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          if (response.status === 'success') {
            alert('Movie: ' + response.movie.name + ' is deleted');
            window.location.href = '/admin.html';
          } else {
            alert(response.message);
          }
        },
      });
    } else {
      alert('confirmation failed');
    }
  });

  $('#add_moviesession_btn').on('click', function (event) {
    if (!window.confirm('Are you sure you want to add?')) {
      return;
    }
    event.preventDefault();
    const add_moviesession_movie_name = $('#add_moviesession_movie_name').val();
    const add_moviesession_house = $('#add_moviesession_house').val();
    const add_moviesession_start_time = $('#add_moviesession_start_time').val();
    const add_moviesession_end_time = $('#add_moviesession_end_time').val();
    const add_moviesession_seats_string = JSON.stringify(seatsinmem);

    if (
      !add_moviesession_movie_name ||
      !add_moviesession_house ||
      !add_moviesession_start_time ||
      !add_moviesession_end_time ||
      !add_moviesession_seats_string
    ) {
      alert('Information cannot be empty');
      return;
    }

    const formData = new FormData();
    formData.append('moviename', add_moviesession_movie_name);
    formData.append('house', add_moviesession_house);
    formData.append('starttime', add_moviesession_start_time);
    formData.append('endtime', add_moviesession_end_time);
    formData.append('seatsstring', add_moviesession_seats_string);

    $.ajax({
      url: '/moviesession/add',
      method: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.status === 'success') {
          alert(
            `Movie Session Details: \nMoviename: ${response.moviesession.moviename} \nHouse: ${response.moviesession.house
            } \nStart Time: ${response.moviesession.starttime.replace(
              'T',
              ' '
            )}\nEnd Time: ${response.moviesession.endtime.replace('T', ' ')}`
          );
          window.location.href = '/admin.html';
        } else {
          alert(response.message);
        }
      },
      error: function (xhr, status, error) {
        if (xhr.status === 400) {
          alert(xhr.responseJSON.message);
        } else {
          alert('error: ' + xhr.status);
        }
      },
    });
  });

  $('#edit_moviesession_btn').on('click', function (event) {
    event.preventDefault();
    if (!window.confirm('Are you sure you want to update?')) {
      return;
    }
    const session_id = selectedSession_info[0];
    const edit_moviesession_movie_name = $('#edit_moviesession_movie_name').val();
    const edit_moviesession_house = $('#edit_moviesession_house').val();
    const edit_moviesession_start_time = $('#edit_moviesession_start_time').val();
    const edit_moviesession_end_time = $('#edit_moviesession_end_time').val();
    const edit_moviesession_seats_string = JSON.stringify(seatsinmem);
    if (
      !edit_moviesession_movie_name ||
      !edit_moviesession_house ||
      !edit_moviesession_start_time ||
      !edit_moviesession_end_time ||
      !edit_moviesession_seats_string
    ) {
      alert('Information cannot be empty');
      return;
    }
    const formData = new FormData();
    formData.append('session_id', session_id);
    formData.append('moviename', edit_moviesession_movie_name);
    formData.append('house', edit_moviesession_house);
    formData.append('starttime', edit_moviesession_start_time);
    formData.append('endtime', edit_moviesession_end_time);
    formData.append('seatsstring', edit_moviesession_seats_string);
    // console.log(formData);
    $.ajax({
      url: '/moviesession/edit',
      method: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.status === 'success') {
          alert(
            `New Movie Session Details: \nMoviename: ${response.moviesession.moviename} \nHouse: ${response.moviesession.house
            } \nStart Time: ${response.moviesession.starttime.replace(
              'T',
              ' '
            )}\nEnd Time: ${response.moviesession.endtime.replace('T', ' ')}`
          );
          window.location.href = '/admin.html';
        } else {
          alert(response.message);
        }
      },
      error: function (xhr, status, error) {
        if (xhr.status === 400) {
          alert(xhr.responseJSON.message);
        } else {
          alert('error: ' + xhr.status);
        }
      },
    });
  });

  $('#delete_moviesession_btn').on('click', function (event) {
    event.preventDefault();
    if (!window.confirm('Are you sure you want to delete?')) {
      return;
    }
    if (!selectedSession_info) {
      alert('please select session!');
      return;
    }
    const session_id = selectedSession_info[0];
    const delete_moviesession_movie_name = selectedSession_info[1];
    const delete_moviesession_house = selectedSession_info[2];
    const delete_moviesession_start_time = selectedSession_info[3];
    const delete_moviesession_end_time = selectedSession_info[4];

    const formData = new FormData();
    formData.append('session_id', session_id);
    formData.append('moviename', delete_moviesession_movie_name);
    formData.append('house', delete_moviesession_house);
    formData.append('starttime', delete_moviesession_start_time);
    formData.append('endtime', delete_moviesession_end_time);
    // console.log(formData);
    $.ajax({
      url: '/moviesession/delete',
      method: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.status === 'success') {
          alert(
            `Deleted Movie Session Details: \nMoviename: ${response.moviesession.moviename} \nHouse: ${response.moviesession.house
            } \nStart Time: ${response.moviesession.starttime.replace(
              'T',
              ' '
            )}\nEnd Time: ${response.moviesession.endtime.replace('T', ' ')}`
          );
          window.location.href = '/admin.html';
        } else {
          alert(response.message);
        }
      },
      error: function (xhr, status, error) {
        if (xhr.status === 400) {
          alert(xhr.responseJSON.message);
        } else {
          alert('error: ' + xhr.status);
        }
      },
    });

  });

  $('#search_user_search_btn').on('click', function (event) {
    event.preventDefault();
    const search_user_id = $('#search_user_id').val();
    const search_username = $('#search_username').val();
    const formData = {
      user_id: search_user_id,
      username: search_username,
    };
    // console.log(formData);
    const sessionId = $('#search_user_list');
    console.log(formData)
    $.ajax({
      url: '/auth/search',
      method: 'GET',
      data: formData,
      success: function (response) {
        if (response.status === 'success') {
          // Clear existing options
          $(sessionId).empty();
          // Add default option
          // $(sessionId).append('<option value="" disabled selected>Select a Session</option>');
          // Iterate over houses and add options
          const allusers = response.users;
          console.log(allusers)
          allusers.forEach(function (user) {
            const userTag =
              user._id + ' | ' + user.username;
            sessionId.append('<option value="' + userTag + '">' + user._id + ' |\t' + user.username + '</option>');
          });
        } else {
          alert(response.message);
        }
      },
      error: function (xhr, status, error) {
        if (xhr.status === 400) {
          alert(xhr.responseJSON.message);
        } else {
          alert('error: ' + xhr.status);
        }
      },
    });
  });
  $('#search_user_list').on('change', function () {
    const userId = $('#search_user_list').val().split(' | ')[0];
    const formdata = {
      userId,
    };
    console.log(formdata)
    $('#userData').text('');
    $.ajax({
      url: "/auth/fetchUserId", // Replace with your API endpoint
      method: "GET",
      data: formdata,
      success: function (response) {
        if (response.status == "success") {
          const user = response.user;
          console.log(user)
          const userDataElement = $('#userData');
          var data = user;
          // Iterate through the JSON properties
          for (const key in data) {
            const value = data[key];
            var row;
            var keyElement;
            var valueElement;
            if (['_id', 'username', 'birthdate', 'email', 'enabled', 'gender', 'role'].includes(key)) {
              row = $('<div>').addClass('row');
              keyElement = $('<div>').addClass('col-4').text(key + ':');
              valueElement = $('<div>').addClass('col-8').text(value);
            }
            if (key == 'PaidHistory') {
              row = $('<div>').addClass('row');
              keyElement = $('<div>').addClass('col-4').text(key + ':');
              valueElement = $('<div>').addClass('col-8').text(
                `
                sessionId: ${JSON.stringify(value[0].session_id)}\n
                Seats: ${JSON.stringify(value[0].seats)}
                `
              );
            }

            if (key == 'PendingHistory') {
              row = $('<div>').addClass('row');
              keyElement = $('<div>').addClass('col-4').text(key + ':');
              valueElement = $('<div>').addClass('col-8').text(
                `
                  sessionId: ${JSON.stringify(value[0].session_id)}\n
                  Seats: ${JSON.stringify(value[0].seats)}
                  `
              );
            }
            if (key == 'count') {
              row = $('<div>').addClass('row');
              keyElement = $('<div>').addClass('col-4').text(key + ':');
              const countItems = Object.entries(value);
              console.log(countItems)
              let html = '';
              let data = countItems;
              // 迭代鍵值對陣列
              for (let i = 0; i < data.length; i++) {
                const key = data[i][0];
                const value = data[i][1];

                const htmlFragment = `${key}: ${value} \n\n`;
                html += htmlFragment;
              }
              valueElement = $('<div>').addClass('col-8').text(html);

            }
            row.append(keyElement, valueElement);
            userDataElement.append(row);
          }

          $('#jsonContainer').show();
          // Display user information in the card
          // $("#cardUserId").text("User ID: " + user._id);
          // $("#cardUsername").text("Username: " + user.username);

          // // Show the user card
          // userCardDiv.show();
        } else {
          alert(response.status)
        }

      },
      error: function (xhr, status, error) {
        console.error("Error: " + error);
      }
    });
  })

});
