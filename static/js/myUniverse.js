var user;
var golusername;
$(document).ready(function () {

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
                golusername = response.user.username;
                if (response.user.role == 'admin') {
                    window.location.href = 'admin.html'
                } else {
                    $('.container').show();
                    $('#login').hide();
                    $('#logout').show();
                    $('#username-lbl').html("Username: " + response.user.username);
                    var autoLogout = new AutoLogout();

                }
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
                window.location.href = "login.html";
            } else {
                console.error('Error:', error);
                alert('Unknown error');
            }
        }
    });

    $.ajax({
        url: 'auth/fetch',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            // Handle successful response
            if (response.status == 'success') {
                user = response.data;
                // console.log(user.PendingHistory);
                // console.log(user.PaidHistory);
                var historyText = '';
                if (user.PaidHistory == undefined) {
                    historyText = `<li href="#" style="text-decoration: none;" class="list-group-item">No History</li>`;

                } else {
                    user.PaidHistory.forEach(function (obj) {
                        var qr = new QRious({
                            value: JSON.stringify(obj), // Convert obj to JSON string for QR code value
                            size: 200 // Adjust QR code size as needed
                        });
           

                        let msg = '';
                        let newTime = '';
                        if (user.messages) {
                            user.messages.forEach(function (obj2) {
                                const title = obj2.title;
                                const message = obj2.message;
                                const sesion_id = message.split("|")[0];
                                const movieName = message.split("|")[1];
                                const from = message.split("|")[2];
                                const to = message.split("|")[3];

                                // console.log("Title:", title);
                                // console.log("Movie Name:", movieName);
                                // console.log("From:", from);
                                // console.log("To:", to);
                                // console.log(obj.Movie)
                                if (title == 'moviesession edit') {
                                    // console.log(movieName, obj.Movie, from, obj.from, to, obj.to)
                                    if (sesion_id == (obj.session_id)) {
                                        msg = '<span style="color: red;">(Please note that this moviesession is rescheduled)</span>';
                                        newTime = `</p><p><span style="color: red;">New Time: ${from} ${to}</span>`;
  
                                    }
                                }

                            });

                        }


                        historyText += `<li class="list-group-item">
                          <div>
                            <div style="display: inline-block; margin-left: 10px;">
                              <p>Movie: ${obj.Movie}${msg}</p>
                              <p>Seat: ${obj.seats} Price: $${obj.price}</p>
                              <p>Movie time: ${obj.from} - ${obj.to}${newTime}</p>
                              <p>Adults: ${obj.adults} Students: ${obj.students} Elderlies: ${obj.elderlies}</p>
                            </div>
                            <div style="display: inline-block; vertical-align: bottom;">
                              <img src="${qr.toDataURL()}" alt="QR Code" />
                            </div>
                          </div>
                        </li>`;
                    });
                    // user.PaidHistory.forEach(function (obj) {
                    //     var qr = new QRious({
                    //         value: JSON.stringify(obj), // Convert obj to JSON string for QR code value
                    //         size: 200 // Adjust QR code size as needed
                    //     });
                    //     const msg = '';
                    //     if (user.message.split("|")[0] == obj.Movie && user.message.split("|")[1] == obj.from && user.message.split("|")[2] == obj.to) {
                    //         msg = '(Please noted this moviesession is reschedued)'
                    //     }
                    //     historyText += `<li class="list-group-item">
                    //         <div>
                    //         <div style="display: inline-block; margin-left: 10px;">
                    //         <p>Movie: ${obj.Movie}${msg}</p>
                    //         <p>Seat: ${obj.seats} Price: $${obj.price}</p>
                    //         <p>Movie time: ${obj.from} - ${obj.to}</p>
                    //         <p>Adults: ${obj.adults} Students: ${obj.students} Elderlies: ${obj.elderlies}</p>
                    //         </div>
                    //         <div style="display: inline-block; vertical-align: bottom;">
                    //             <img src="${qr.toDataURL()}" alt="QR Code" />
                    //         </div>
                    //         </div>
                    //     </li>`

                    // });
                }
                $('#historyList').html(historyText);
                var bookHistoryText = '';
                if (user.PendingHistory == undefined) {
                    bookHistoryText = `<li href="#" style="text-decoration: none;" class="list-group-item">No History</li>`;
                } else {
                    user.PendingHistory.forEach(function (obj) {
                        bookHistoryText += `<li class="list-group-item">
                            <div>
                                <div style="display: inline-block; margin-left: 10px;">
                                <p>Movie: ${obj.Movie}</p>
                                <p>Seat: ${obj.seats}</p>
                                <p>Price: $${obj.price}</p>
                                <p>Book at: ${obj.time}</p>
                                </div>
                            </div>
                        </li>`
                    });
                }
                $('#bookHistoryList').html(bookHistoryText);
                // <li href="#" style="text-decoration: none;" class="list-group-item">#</li>
                $('#icon_img').attr('src', user.img);
                $('#profile_Name').text(user.username);
                $('#profile_Gender').text(user.gender);
                // $('#edit-email').val(user.email);
                // $('#edit-name').val(user.username);
                // $('#edit-gender').val(user.gender);
                // $('#edit-birthdate').val(user.birthdate);
                return
            }
            console.log(failed)
        },
        error: function (xhr, status, error) {
            // Handle error
            console.error(error);
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

    $('#profile').show();
    $('#change-pw-page').hide();
    $('#edit-page').hide();


    $('#change-pw, #edit').on('click', function () {
        $('#profile').hide();
        $('#change-pw-page').hide();
        $('#edit-page').hide();
        $('#' + this.id + '-page').show();
        if (this.id == 'edit') {

            refreshEditPage();
        }
    });


    $('#changepw-btn').on('click', function (event) {
        event.preventDefault();
        submitChangePwForm();
    });


    $('.backButton').on('click', function () {
        $('#profile').show();
        $('#change-pw-page').hide();
        $('#edit-page').hide();
    });

})

function submitChangePwForm() {

    if (!$('#newPassword').val() || !$('#newPasswordConfirm').val()) {
        alert('plese enter password!')
        return;
    }
    if ($('#newPassword').val() != $('#newPasswordConfirm').val()) {
        alert('your password is not match!')
        return;
    }
    const username = golusername;
    const password = $('#newPassword').val()

    if (password.length < 8) {
        // Display error message for invalid password length
        alert('Password must be at least 8 characters');
        return;
    }
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    $.ajax({
        url: 'auth/changepw',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            // Handle successful response
            console.log(response);
            if (response.status == 'success') {
                alert(response.user.username + " successfully updated! and Login again!");
                $("#logout-btn").click();
            }
        },
        error: function (xhr, status, error) {
            // Handle error
            console.error(error);
        }
    });
}

function refreshEditPage() {
    $.ajax({
        url: 'auth/fetch',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            // Handle successful response
            if (response.status == 'success') {
                user = response.data;
                console.log(user)

                $('#edit-email').val(user.email);
                $('#edit-name').val(user.username);
                $('#edit-gender').val(user.gender);
                $('#edit-birthdate').val(user.birthdate);
                return
            }
            console.log(failed)
        },
        error: function (xhr, status, error) {
            // Handle error
            console.error(error);
        }
    });
}

