function encryptAES(object, key) {
    const jsonString = JSON.stringify(object);
    // const cryptoKey = CryptoJS.enc.Utf8.parse(key);
    const cryptoKey = key;
    const encryptedData = CryptoJS.AES.encrypt(jsonString, cryptoKey);
    // const encryptedString = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Latin1.parse(encryptedData))
    return encryptedData
}

// Example decryption function using AES
function decryptObjectAES(encryptedObject, key) {
    // JSON.stringify(encryptedObject.replace(/[\n]/g, ''))
    // const cryptoKey = CryptoJS.enc.Utf8.parse(key);
    const cryptoKey = key;
    // const decryptedData = CryptoJS.enc.Base64.parse(encryptedObject).toString(CryptoJS.enc.Latin1)
    const decryptedString = CryptoJS.AES.decrypt(encryptedObject, cryptoKey).toString(CryptoJS.enc.Utf8)
    return JSON.parse(decryptedString);
}
var total_price;
$(document).ready(function () {

    var username;
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
                // $('.container').show();
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
                window.location.href = "login.html";
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

    var urlParams = new URLSearchParams(window.location.search);
    var data = decryptObjectAES(urlParams.get('data'), "Galaxy");
    const _id = data.movie_Session.split(', ')[0];
    const seats = data.ticket_seat;
    username = data.username;
    const formData = new FormData();
    formData.append('session_id', _id);
    formData.append('seats', seats);
    formData.append('from', "0");
    formData.append('to', "R");
    formData.append('username', username);
    formData.append('price', data.price);
    formData.append('adults', data.adult_number);
    formData.append('students', data.student_number);
    formData.append('elderlies', data.elderly_number);
    // console.log(username);
    $.ajax({
        url: '/moviesession/changeSessionSeat',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.status === 'success') {
                alert(`Reserved Movie Session Details: \nMoviename: ${response.moviesession.moviename} \nHouse: ${response.moviesession.house} \nStart Time: ${response.moviesession.starttime.replace('T', ' ')}\nEnd Time: ${response.moviesession.endtime.replace('T', ' ')}\nSeats: ${response.moviesession.seats}\nPlease finish the payment within 30 minutes`
                );
                $('.container').show();
                // window.location.href = '/admin.html';
            } else {
                if (response.unavailableSeats[1]) {
                    alert(response.unavailableSeats.toString().replace(',', ', ') + ' are unavailable now, please choose again!');
                } else {
                    alert(response.unavailableSeats + ' is unavailable now, please choose again!');
                }
                history.back();
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
    function validateForm() {
        const paymentMethod = $('#payment-method').val()
        const name = $('#name').val()
        const cardNumber = $('#card-number').val()
        const expiryDate = $('#expiry-date').val()
        const cvv = $('#cvv').val()
        if (paymentMethod && name && cardNumber && expiryDate && cvv) {
            return true
        }
        return alert("please enter all informaitons")
    }
    //example
    // console.log(data);
    // console.log(data.movie_Name);


    // var total_price = urlParams.get('total_price');
    const total_price = data.price;
    const adult_number = data.adult_number;
    const student_number = data.student_number;
    const elderly_number = data.elderly_number;


    $("#movie_Name").text(data.movie_Name);
    $("#movie_img").attr("src", data.movie_Img);

    $("#adult_price").text("Adult ($" + data.adult_price + ")");
    $("#student_price").text("Student ($" + data.student_price + ")");
    $("#elderly_price").text("Elderly ($" + data.elderly_price + ")");

    $("#adult_number").text(data.adult_number);
    $("#student_number").text(data.student_number);
    $("#elderly_number").text(data.elderly_number);

    $("#adult_total").text(data.adult_price * data.adult_number);
    $("#student_total").text(data.student_price * data.student_number);
    $("#elderly_total").text(data.elderly_price * data.elderly_number);


    $("#price_tag").text(total_price);
    $("#card").show();
    $("#qrcode").hide();

    $("#payment-method").on('change', function () {
        if ($(this).val() === "credit-card" || $(this).val() === "debit-card") {
            $("#card").show();
            $("#qrcode").hide();
        } else {
            $("#card").hide();
            $("#qrcode").show();
        }
    })

    $('#pay_btn').on("click", function (event) {
        event.preventDefault();
        if (validateForm()) {
            const formData = new FormData();
            formData.append('session_id', _id);
            formData.append('seats', seats);
            formData.append('from', "R");
            formData.append('to', "1");
            formData.append('username', username);
            formData.append('price', total_price);
            formData.append('adults', adult_number);
            formData.append('students', student_number);
            formData.append('elderlies', elderly_number);
            $.ajax({
                url: '/moviesession/changeSessionSeat',
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status === 'success') {
                        alert(`Booked Movie Session Details: \nMoviename: ${response.moviesession.moviename} \nHouse: ${response.moviesession.house} \nStart Time: ${response.moviesession.starttime.replace('T', ' ')}\nEnd Time: ${response.moviesession.endtime.replace('T', ' ')}\nSeats: ${response.moviesession.seats}`
                        );
                        window.location.href = '/index.html';
                        // updateUserHistory();
                        // updateSessionHistory();
                    } else {
                        if (response.unavailableSeats[1]) {
                            alert(response.unavailableSeats.toString().replace(',', ', ') + ' are unavailable now, please choose again!');
                        } else {
                            alert(response.unavailableSeats + ' is unavailable now, please choose again!');
                        }
                        history.back();
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
    })

    // function updateUserHistory() {
    //     const formData = new FormData();
    //     formData.append('username', username);
    //     formData.append('session_id', _id);
    //     formData.append('seats', seats);
    //     formData.append('price', total_price);
    //     formData.append('username', username);
    //     $.ajax({
    //         url: '/user/updateUserHistory',
    //         method: 'POST',
    //         data: formData,
    //         processData: false,
    //         contentType: false,
    //         success: function (response) {
    //             if (response.status === 'success') {
    //                 console.log("update user history success");
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
})

