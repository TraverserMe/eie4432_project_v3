// 20046876D HUI Lai Yuk, Alex
// 20062785D LEE Kin Nang, Harry
var allsessions;

$(document).ready(async function () {
    auth();
    await getdb();
    //choose movie name
    $('#searchInput').on('keyup', function () {
        var searchname = $(this).val().toLowerCase();
        console.log(searchname);
        refreshcard_name(searchname);

    });

    $('#clear_btn').on('click', function () {
        $('#searchInput').val("")
        refreshcard_name("");
    });

    //choose the movie type
    $('#All_btn, #Sci-Fi_btn, #Action_btn').click(function () {
        $('#All_btn').addClass('btn-light').removeClass('btn-secondary');
        $('#Sci-Fi_btn').addClass('btn-light').removeClass('btn-secondary');
        $('#Action_btn').addClass('btn-light').removeClass('btn-secondary');
        $(this).addClass('btn-secondary').removeClass('btn-light');
        refreshcard_type($(this).text().toLowerCase());
    });

    $('.session_select').on('change', function () {
        var session = encodeURIComponent($(this).val());
        // alert($(this).val());
        window.location.href = `booking.html?session=${session}`;
        // `booking.html?session=${session}`
    });

});

function auth() {
    $('#login', '#logout').hide();
    //auth login information
    $.ajax({
        url: '/auth/me',
        method: 'GET',
        success: function (response) {
            if (response.status === 'success') {
                // User is logged in, handle the response data
                console.log('Logged in user:', response.user.username);
                console.log('Role:', response.user.role);
                $('.container').show();
                $('#login').hide();
                $('#logout').show();
                $('#username-lbl').html("Username: " + response.user.username);
                var autoLogout = new AutoLogout();


            } else {
                alert('Unknown error');
            }
        },
        error: function (xhr, status, error) {
            // Error handling
            if (xhr.status === 401) {
                console.log(xhr.responseJSON.message)
                $('#login').show();
                $('#logout').hide();
            } else {
                console.error('Error:', error);
                alert('Unknown error');
            }
        }
    });

    $('#logout-btn').on('click', function () {
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
            }
        });
    });


}

function refreshcard_name(searchname) {
    $('#moviemenu .card').each(function (index, card) {
        var cardName = $(card).attr('id');
        if (cardName.toLowerCase().includes(searchname.toLowerCase())) {
            $(card).fadeIn();
        } else {
            $(card).fadeOut();
        }
    });

}

function refreshcard_type(searchtype) {
    $('#moviemenu .card').each(function (index, card) {
        var cardType = $(card).find('.card-text').text().toLowerCase();
        if (searchtype == 'all' || cardType == searchtype) {
            $(card).fadeIn();
        } else {
            $(card).fadeOut();
        }
    });

}

// function getdb() {
//     const formData = {
//         moviename: '',
//         house: '',
//         starttime: '',
//         endtime: '',
//     };
//     $.ajax({
//         url: '/moviesession/search',
//         method: 'GET',
//         data: formData,
//         success: function (response) {
//             if (response.status === 'success') {
//                 allsessions = response.moviesessions;
//              } else {
//                 alert(response.message);
//             }
//         },
//         error: function (xhr, status, error) {
//             if (xhr.status === 400) {
//                 alert(xhr.responseJSON.message);
//             } else {
//                 alert('error: ' + xhr.status);
//             }
//         },
//     });
//     $.ajax({
//         url: '/movie/getall',
//         method: 'GET',
//         success: function (response) {
//             // Handle successful response
//             try {
//                 // Loop through the movie in the JSON data
//                 $.each(response.movies, function (index, movie) {
//                     appendcard(movie);
//                 });
//             } catch (error) {
//                 console.log("Error processing db data:", error);
//             }
//         },
//         error: function (xhr, status, error) {
//             // Handle error response
//             console.log('Error:', xhr.responseText);

//         }
//     });
// }

async function getdb() {
    const formData = {
        moviename: '',
        house: '',
        starttime: '',
        endtime: '',
    };

    try {
        // Make the first AJAX request and wait for its completion
        const response1 = await $.ajax({
            url: '/moviesession/search',
            method: 'GET',
            data: formData,
        });

        if (response1.status === 'success') {
            allsessions = response1.moviesessions;
        } else {
            alert(response1.message);
        }

        // Make the second AJAX request
        const response2 = await $.ajax({
            url: '/movie/getall',
            method: 'GET',
        });

        // Handle successful response
        $.each(response2.movies, async function (index, movie) {
            await appendcard(movie);
        });
    } catch (error) {
        // Handle errors
        if (error.status === 400) {
            alert(error.responseJSON.message);
        } else {
            alert('Error: ' + error.status);
        }
    }
}



async function appendcard(movie) {
    var param1 = encodeURIComponent(movie.name);
    var param2 = encodeURIComponent(movie.type);
    const cardHtml =
        `
            <div id="${movie.name}" class="card m-3" style="width: 18rem;">
                <a href="booking.html?param1=${param1}">
                <img src="${movie.image}" style="height: 100 width: auto;" class="mt-2 rounded img-fluid card-img-top" alt="${movie.name}">
                </a>
                    <div class="card-body">
                        <h5 class="card-title">${movie.name}</h5>
                        <p class="card-text">${movie.type}</p>
                        <select
                            name="${movie.name.replaceAll(' ', '_')}_Session"
                            id="${movie.name.replaceAll(' ', '_')}_Session"
                            class="session_select form-control">
                            <option value="">No Movie Session</option>
                        </select>
                        <div class="col">
                            <a href="booking.html?param1=${param1}&param2=Adult" class="m-1 p-1 btn btn-primary">$ ${movie.aPrice} (Adult)</a>
                            <a href="booking.html?param1=${param1}&param2=Student" class="m-1 p-1 btn btn-primary">$ ${movie.sPrice} (Student)</a>
                            <a href="booking.html?param1=${param1}&param2=Elderly" class="m-1 p-1 btn btn-primary">$ ${movie.ePrice} (Elderly)</a>
                        </div>
                    </div>
            </div>
            `;
    $('#moviemenu').append(cardHtml);
    $('#moviemenu').html($('#moviemenu').html());
    const thissession = allsessions.filter((session) => session.moviename === movie.name);
    if (thissession.length === 0) {
        // Handle the condition of an empty array here
        return;
    }
    // console.log(thissession[0].moviename)
    const selectElement = $("#" + movie.name.replaceAll(' ', '_') + "_Session");
    thissession.forEach(function (session) {
        selectElement.html('');
        selectElement.html('<option value="">Click to view sessions</option>');
        const valueTag = session._id + ' | ' + session.moviename + ' | ' + session.house + ' | ' + session.starttime + ' | ' + session.endtime;
        const sessionTag = session.starttime + ' | ' + session.endtime + ' | ' + session.house;
        selectElement.append('<option value="' + valueTag + '">' + sessionTag + '</option>');
    });

}

// function refreshDashboard() {
//     const formData = {
//         moviename: '',
//         house: '',
//         starttime: '',
//         endtime: '',
//     };
//     // var sessionId = $('#start_soon_session');
//     var sessionId = $('.dashboardc');

//     $.ajax({
//         url: '/moviesession/search',
//         method: 'GET',
//         data: formData,
//         success: function (response) {
//             if (response.status === 'success') {
//                 // Clear existing options
//                 $(sessionId).empty();
//                 // Add default option
//                 sessionId.append('<option>' + 'Closest Event' + '</option>');
//                 // $(sessionId).append('<option value="" disabled selected>Select a Session</option>');
//                 // Iterate over houses and add options
//                 allsessions = response.moviesessions;

//                 // response.moviesessions.forEach(function (session) {
//                 //     const sessionTag =
//                 //         session.moviename + ' | ' + session.house + ' | ' + session.starttime + ' | ' + session.starttime;
//                 //     sessionId.append('<Button value="' + session._id + ' | ' + sessionTag + '">' + sessionTag + '</Button>');
//                 // });

//                 response.moviesessions.slice(0, 5).forEach(function (session) {
//                     const sessionTag =
//                         session.moviename + ' | ' + session.house + ' | ' + session.starttime + ' | ' + session.starttime;
//                     sessionId.append('<Button value="' + session._id + ' | ' + sessionTag + '">' + sessionTag + '</Button>');
//                 });

//             } else {
//                 alert(response.message);
//             }
//         },
//         error: function (xhr, status, error) {
//             if (xhr.status === 400) {
//                 alert(xhr.responseJSON.message);
//             } else {
//                 alert('error: ' + xhr.status);
//             }
//         },
//     });
// }
