var username;
var total_price = 0;
var ticket_1 = 0;
var ticket_2 = 0;
var ticket_3 = 0;
var ticket_4 = 0;
var adult_price = 0;
var student_price = 0;
var elderly_price = 0;
var ticket_1_seat = "";
var ticket_2_seat = "";
var ticket_3_seat = "";
var ticket_4_seat = "";
var selectedSeat = [ticket_1_seat, ticket_2_seat, ticket_3_seat, ticket_4_seat];

function reset() {
    $(".Type2,.Type3,.Type4,#movie_img").hide();
    total_price = 0;
    ticket_1 = 0;
    ticket_2 = 0;
    ticket_3 = 0;
    ticket_4 = 0;
    ticket_1_seat = "";
    ticket_2_seat = "";
    ticket_3_seat = "";
    ticket_4_seat = "";
    selectedSeat = [ticket_1_seat, ticket_2_seat, ticket_3_seat, ticket_4_seat];
    $("#movie_Session").html(`<option value="default" disabled selected>Select a Session</option>`);
    $("#seat1_alphabet,#seat2_alphabet,#seat3_alphabet,#seat4_alphabet").html(`<option value="default" disabled selected>Select a Letter</option>`);
    $("#seat1_index,#seat2_index,#seat3_index,#seat4_index").html(`<option value="default" disabled selected>Select a Number</option>`);
    $(".seating-plan").html(`<rect x="15.3%" y="-3%" width="64%" height="5%" style="fill:rgb(14, 41, 41)"></rect>
        <text x="45%" y="1%" font-family="Verdana" font-size="18" style="fill:rgb(255, 255, 255)">screen</text>
        <circle cx="30%" cy="90%" r="2.5%" fill="green" stroke="while" stroke-width="0.5%"></circle>
        <text x="33%" y="89%" font-family="Verdana" font-size="18" style="fill:rgb(0, 0, 0)">Avaliable</text>
        <circle cx="45%" cy="90%" r="2.5%" fill="orange" stroke="red" stroke-width="0.5%"></circle>
        <text x="48%" y="89%" font-family="Verdana" font-size="18" style="fill:rgb(0, 0, 0)">Selected</text>
        <circle cx="59%" cy="90%" r="2.5%" fill="black" stroke="red" stroke-width="0.5%"></circle>
        <text x="62%" y="89%" font-family="Verdana" font-size="18" style="fill:rgb(0, 0, 0)">Booked</text>
        <text x="8%" y="89%" font-family="Verdana" font-size="18" style="fill:rgb(0, 0, 0)" id="svg_selecting">Selecting ticket 1</text>
        `);
    $("#price_tag").html(total_price);
    // $("#book_btn").attr("href", `payment.html?total_price=${total_price}`);
}

function calculatePrice(index) {
    if (index != "") {
        var movie_Name = $("#movie_Name").val();
        if (movie_Name == "default") {
            alert("Please select a movie first!");
            $("#" + (index)).prop("checked", false);
            let inputType = $('input[name="Type' + index + '"]');
            inputType.prop('checked', false);
            $("#" + (1)).prop("checked", true);
            $("#svg_selecting").html("Selecting ticket 1")
            return;
        }
        $("#" + (1)).prop("checked", true);
        $("#svg_selecting").html("Selecting ticket 1")
        if (index == 1) {
            var selectedValue1 = $("input[name='Type1']:checked").val();
            // console.log(selectedValue1);
            if (selectedValue1 == "Adult") {
                ticket_1 = adult_price;
            } else if (selectedValue1 == "Student") {
                ticket_1 = student_price;
            } else if (selectedValue1 == "Elderly") {
                ticket_1 = elderly_price;
            }

        } else if (index == 2) {
            var selectedValue2 = $("input[name='Type2']:checked").val();
            // console.log(selectedValue2);
            if (selectedValue2 == "Adult") {
                ticket_2 = adult_price;
            } else if (selectedValue2 == "Student") {
                ticket_2 = student_price;
            } else if (selectedValue2 == "Elderly") {
                ticket_2 = elderly_price;
            }

        } else if (index == 3) {
            var selectedValue3 = $("input[name='Type3']:checked").val();
            // console.log(selectedValue3);
            if (selectedValue3 == "Adult") {
                ticket_3 = adult_price;
            } else if (selectedValue3 == "Student") {
                ticket_3 = student_price;
            } else if (selectedValue3 == "Elderly") {
                ticket_3 = elderly_price;
            }

        } else if (index == 4) {
            var selectedValue4 = $("input[name='Type4']:checked").val();
            // console.log(selectedValue4);
            if (selectedValue4 == "Adult") {
                ticket_4 = adult_price;
            } else if (selectedValue4 == "Student") {
                ticket_4 = student_price;
            } else if (selectedValue4 == "Elderly") {
                ticket_4 = elderly_price;
            }
        }
        total_price = ticket_1 + ticket_2 + ticket_3 + ticket_4;
        // console.log(ticket_1, ticket_2, ticket_3, ticket_4);
    }
    // console.log(total_price);
    $("#price_tag").html(total_price);
    // $("#book_btn").attr("href", `payment.html?total_price=${total_price}`);
}

function showAmount() {
    var selectedamount = $("#amount").val();
    // console.log(selectedamount);
    if (selectedamount == 2) {
        $(".Type2").fadeIn();
        $(".Type3,.Type4").fadeOut();
        total_price = ticket_1 + ticket_2;
    } else if (selectedamount == 3) {
        $(".Type2,.Type3").fadeIn();
        $(".Type4").fadeOut();
        // $(".Type3").show();
        total_price = ticket_1 + ticket_2 + ticket_3;
    } else if (selectedamount == 1) {
        $(".Type2,.Type3,.Type4").fadeOut();
        total_price = ticket_1;
    } else if (selectedamount == 4) {
        $(".Type2,.Type3,.Type4").fadeIn();
        total_price = ticket_1 + ticket_2 + ticket_3 + ticket_4;
    }
    $("#1").prop("checked", true);
    $("#svg_selecting").html("Selecting ticket 1");
    for (var i = 4; i > 0; i--) {
        if (selectedSeat[i - 1]) {
            if (i > selectedamount) {
                $("#" + selectedSeat[i - 1]).attr("fill", 'green');
                $("#" + selectedSeat[i - 1]).attr("stroke", 'white');
            } else {
                $("#" + selectedSeat[i - 1]).attr("fill", 'orange');
                $("#" + selectedSeat[i - 1]).attr("stroke", 'red');
            }
        }
    }
    // console.log(total_price);
    $("#price_tag").html(total_price);
    // $("#book_btn").attr("href", `payment.html?total_price=${total_price}`);
}

function validateForm() {
    const check_movie_Name = $("#movie_Name").val();
    const check_movie_Session = $("#movie_Session").val();
    const check_price = $("#price_tag").text();
    const check_ticket_number = $("#amount").val();
    const check_ticket_1_type = $("input[name='Type1']:checked").val();
    const check_ticket_2_type = $("input[name='Type2']:checked").val();
    const check_ticket_3_type = $("input[name='Type3']:checked").val();
    const check_ticket_4_type = $("input[name='Type4']:checked").val();
    const check_ticket_type_array = [check_ticket_1_type, check_ticket_2_type, check_ticket_3_type, check_ticket_4_type];
    const check_ticket_1_alphabet = $("#seat1_alphabet").val();
    const check_ticket_2_alphabet = $("#seat2_alphabet").val();
    const check_ticket_3_alphabet = $("#seat3_alphabet").val();
    const check_ticket_4_alphabet = $("#seat4_alphabet").val();
    const check_ticket_1_index = $("#seat1_index").val();
    const check_ticket_2_index = $("#seat2_index").val();
    const check_ticket_3_index = $("#seat3_index").val();
    const check_ticket_4_index = $("#seat4_index").val();
    const check_ticket_1_seat = check_ticket_1_alphabet + check_ticket_1_index;
    const check_ticket_2_seat = check_ticket_2_alphabet + check_ticket_2_index;
    const check_ticket_3_seat = check_ticket_3_alphabet + check_ticket_3_index;
    const check_ticket_4_seat = check_ticket_4_alphabet + check_ticket_4_index;
    const check_ticket_alphabet_array = [check_ticket_1_alphabet, check_ticket_2_alphabet, check_ticket_3_alphabet, check_ticket_4_alphabet]
    const check_ticket_index_array = [check_ticket_1_index, check_ticket_2_index, check_ticket_3_index, check_ticket_4_index]
    const check_ticket_seat_array = [check_ticket_1_seat, check_ticket_2_seat, check_ticket_3_seat, check_ticket_4_seat];

    if (check_movie_Name == "default") {
        alert("Please select a movie first!");
        return false;
    } else if (check_movie_Session == null) {
        alert("Please select a session first!");
        return false;
    } else if (check_price == 0) {
        alert("Please select a ticket type first!");
        return false;
    }
    // console.log(check_ticket_alphabet_array)
    // console.log(check_ticket_index_array)
    // console.log(check_ticket_number)
    for (var i = 0; i < check_ticket_number; i++) {
        if (check_ticket_alphabet_array[i] == null) {
            alert("Please select a ticket type for ticket " + (i + 1));
            return false;
        } else if (check_ticket_index_array[i] == "default") {
            alert("Please select a seat for ticket " + (i + 1));
            return false;
        } else if (check_ticket_seat_array[i] == "0") {
            alert("Please select a seat for ticket " + (i + 1));
            return false;
        }
        calculatePrice(i);
    }

    const adult_number = check_ticket_type_array.filter(function (ticket) {
        return ticket === "Adult";
    }).length;

    const student_number = check_ticket_type_array.filter(function (ticket) {
        return ticket === "Student";
    }).length;

    const elderly_number = check_ticket_type_array.filter(function (ticket) {
        return ticket === "Elderly";
    }).length;

    var select_only = ''
    console.log(check_ticket_seat_array)
    for (var i = 0; i < check_ticket_number; i++) {
        select_only += check_ticket_seat_array[i];
        select_only += " "
    }
    confirm("Are you sure you want to book this ticket?\nMovie Name: "
        + check_movie_Name + "\nSession: "
        + check_movie_Session.split(", ")[2]
        + " - " + check_movie_Session.split(", ")[3]
        + "\nAdult: " + adult_number
        + "\nStudent: " + student_number
        + "\nElderly: " + elderly_number
        + "\nSeat: " + select_only
        + "\nTotal Price: $" + check_price);
    if (confirm) {
        var objectToSend = {
            movie_Name: check_movie_Name,
            movie_Img: $("#movie_img").attr("src"),
            movie_Session: check_movie_Session,
            adult_price: adult_price,
            student_price: student_price,
            elderly_price: elderly_price,
            price: check_price,
            adult_number: adult_number,
            student_number: student_number,
            elderly_number: elderly_number,
            ticket_seat: check_ticket_seat_array,
            username: username,
        };
        console.log(objectToSend);
        var decrypt = encryptAES(objectToSend, "Galaxy")
        var url = "payment.html?data=" + encodeURIComponent(decrypt);
        window.location.href = url;
    } else {
        return false;
    }
    // return true;

}

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

function importNumber(index, data) {
    var selectedValue = $("#seat" + index + "_alphabet").val();
    var house = $("svg rect").attr("id");
    var optionElement = $("#seat" + index + "_index");

    var old_value = selectedSeat[index - 1];
    if (old_value != '') {
        $("#" + old_value).attr("fill", 'green');
        $("#" + old_value).attr("stroke", 'white');
        selectedSeat[index - 1] = '';
        if (index == 1) {
            ticket_1_seat = '';
        } else if (index == 2) {
            ticket_2_seat = '';
        } else if (index == 3) {
            ticket_3_seat = '';
        } else if (index == 4) {
            ticket_4_seat = '';
        }
    }

    $("#" + (index)).prop("checked", true);
    $("#svg_selecting").html("Selecting ticket " + (index))
    let seat_Index = `<option value="default">Select a Number</option>`;
    const houses = JSON.parse(localStorage.getItem("houses"));
    if (selectedValue != "default") {
        // optionElement.empty();
        // optionElement.append(`<option value="default">Select a Number</option>`);
        $.each(houses, function (index) {
            if (houses[index].house == house) {
                const house_data = houses[index]
                // console.log(house_data);
                $.each(house_data.seats, function (index, seat) {
                    if (seat.seatNumber.charAt(0) == selectedValue) {
                        // console.log(seat.seatNumber.split(selectedValue)[1]);
                        seat_Index += `
                            <option value="${seat.seatNumber.split(selectedValue)[1]}">${seat.seatNumber.split(selectedValue)[1]}</option>
                        `;
                    }
                });
                optionElement.html(seat_Index);
            }
        });
        if (data) {
            optionElement.val(data);
        }
    }
}

function importSeat(house) {
    var svgElement = $(".seating-plan");
    var circleElements = "";
    const houses = JSON.parse(localStorage.getItem("houses"));
    if (house != "") {
        svgElement.html(`
            <rect x="15.3%" y="-3%" width="64%" height="5%" id="${house}" style="fill:rgb(14, 41, 41)"></rect>
            <text x="45%" y="1%" font-family="Verdana" font-size="18" style="fill:rgb(255, 255, 255)">screen</text>
            <circle cx="30%" cy="90%" r="2.5%" fill="green" stroke="while" stroke-width="0.5%"></circle>
            <text x="33%" y="89%" font-family="Verdana" font-size="18" style="fill:rgb(0, 0, 0)">Avaliable</text>
            <circle cx="45%" cy="90%" r="2.5%" fill="orange" stroke="red" stroke-width="0.5%"></circle>
            <text x="48%" y="89%" font-family="Verdana" font-size="18" style="fill:rgb(0, 0, 0)">Selected</text>
            <circle cx="59%" cy="90%" r="2.5%" fill="black" stroke="red" stroke-width="0.5%"></circle>
            <text x="62%" y="89%" font-family="Verdana" font-size="18" style="fill:rgb(0, 0, 0)">Booked</text>
            <text x="8%" y="89%" font-family="Verdana" font-size="18" style="fill:rgb(0, 0, 0)" id="svg_selecting">Selecting ticket 1</text>
            `);
        $.each(houses, function (index, name) {
            // console.log(houses[index].house);
            // console.log(house);
            if (houses[index].house == house) {
                const house_data = houses[index]
                $.each(house_data.seats, function (index, seat) {
                    circleElements += `
                        <circle cx="${seat.position.x}" cy="${seat.position.y}" r="3%" fill="green" stroke="white" stroke-width="0.5%" id="${seat.seatNumber}"></circle>
                        <text x="${seat.position.x}" y="${seat.position.y}" text-anchor="middle" alignment-baseline="central">${seat.seatNumber}</text>
                    `;
                });
            }
        });
        svgElement.append(circleElements);
        //refresh
        $(".seating-plan").html($(".seating-plan").html());

        $("#seat1_alphabet,#seat2_alphabet,#seat3_alphabet,#seat4_alphabet").html(
            `<option value="default" disabled selected>Select a Letter</option>`
        );
        $("#seat1_index,#seat2_index,#seat3_index,#seat4_index").html(
            `<option value="default" disabled selected>Select a Number</option>`
        );
        let seat_Alphabet = "";
        let seat_Alphabet_temp = [];
        $.each(houses, function (index) {
            if (houses[index].house == house) {
                $.each(houses[index].seats, function (index, seat) {
                    // console.log(seat.seatNumber.charAt(0));
                    if (seat_Alphabet_temp.indexOf(seat.seatNumber.charAt(0)) == -1) {
                        seat_Alphabet_temp.push(seat.seatNumber.charAt(0));
                    }
                });
            }
        });
        // console.log(seat_Alphabet_temp);
        $.each(seat_Alphabet_temp, function (index, seat) {
            // console.log(seat.seatNumber.charAt(0));
            seat_Alphabet += `
                <option value="${seat}">${seat}</option>
                `;
        });
        $("#seat1_alphabet,#seat2_alphabet,#seat3_alphabet,#seat4_alphabet").append(seat_Alphabet);
    }
}

function changeAmount(num) {
    var selectedamount = $("#amount").val();
    // console.log(selectedamount);
    if (num == 1) {
        if (selectedamount == 4) {
            alert("You can only book 4 tickets at most!");
        } else {
            $("#amount").val(parseInt(selectedamount) + 1);
            showAmount();
        }
    } else if (num == -1) {
        if (selectedamount == 1) {
            alert("You can only book 1 ticket at least!");
        } else {
            $("#amount").val(parseInt(selectedamount) - 1);
            showAmount();
        }
    }
}

function changeSvg(index) {
    $("#" + index).prop("checked", true);
    $("#svg_selecting").html("Selecting ticket " + index)
    var dropDownAlphabet = $("#seat" + index + "_alphabet").val();
    var dropDownNumber = $("#seat" + index + "_index").val();
    var addupValue = dropDownAlphabet + dropDownNumber;
    var color = $("#" + addupValue).attr("fill");
    // console.log(dropDownAlphabet, dropDownNumber);
    // console.log(addupValue);//work
    // console.log(color);//work
    if (color == "green") {
        if (selectedSeat[index - 1] != '') {
            $("#" + selectedSeat[index - 1]).attr("fill", 'green');
            $("#" + selectedSeat[index - 1]).attr("stroke", 'white');
            selectedSeat[index - 1] = '';
        }
        $("#" + addupValue).attr("fill", 'orange');
        $("#" + addupValue).attr("stroke", 'red');
        // selectedSeat[index-1] = addupValue;

        if (index == 1) {
            ticket_1_seat = addupValue;
        } else if (index == 2) {
            ticket_2_seat = addupValue;
        } else if (index == 3) {
            ticket_3_seat = addupValue;
        } else if (index == 4) {
            ticket_4_seat = addupValue;
        }
        selectedSeat = [ticket_1_seat, ticket_2_seat, ticket_3_seat, ticket_4_seat];
        // console.log(selectedSeat);
    } else if (color == "orange") {
        //find which radio is selected
        var findIndex = selectedSeat.indexOf(addupValue);
        if (findIndex != -1) {
            $("#" + selectedSeat[findIndex]).attr("fill", 'green');
            $("#" + selectedSeat[findIndex]).attr("stroke", 'white');
            selectedSeat[findIndex] = '';
            if (findIndex == 0) {
                ticket_1_seat = '';
            } else if (findIndex == 1) {
                ticket_2_seat = '';
            } else if (findIndex == 2) {
                ticket_3_seat = '';
            } else if (findIndex == 3) {
                ticket_4_seat = '';
            }

            $("#seat" + (findIndex + 1) + "_alphabet").val('default').trigger('change');
            $("#" + addupValue).attr("fill", 'orange');
            $("#" + addupValue).attr("stroke", 'red');
            // selectedSeat[index-1] = addupValue;
            if (index == 1) {
                ticket_1_seat = addupValue;
            } else if (index == 2) {
                ticket_2_seat = addupValue;
            } else if (index == 3) {
                ticket_3_seat = addupValue;
            } else if (index == 4) {
                ticket_4_seat = addupValue;
            }
            selectedSeat = [ticket_1_seat, ticket_2_seat, ticket_3_seat, ticket_4_seat];
            console.log(selectedSeat);
        }
    } else if (color == "black") {
        alert("This seat is already booked!");
        $("#seat" + index + "_index").val('default').trigger('change');
    }
}

function updateSeat() {
    console.log("updated")
    var show_house = $("svg rect").attr("id");
    if (show_house) {
        $.ajax({
            url: '/moviesession/getall',
            method: 'GET',
            success: function (response) {
                // console.log(response)
                if (response.status === 'success') {
                    const moviesessions = response.moviesessions;
                    // console.log(moviesessions);
                    localStorage.setItem("moviesessions", JSON.stringify(moviesessions));
                } else {
                    alert('Unknown error');
                }
            },
            error: function (xhr, status, error) {
                // Error handling
                if (xhr.status === 401) {
                    console.log(xhr.responseJSON.message)
                } else {
                    console.error('Error:', error);
                    alert('Unknown error');
                }
            }
        });
        const name = $("#movie_Session").val().split(", ")[1];
        const starttime = $("#movie_Session").val().split(", ")[2];
        const endtime = $("#movie_Session").val().split(", ")[3];
        const house = $("#movie_Session").val().split(", ")[4];
        if (house) {
            showSeat(name, starttime, endtime, house);
        }
    }
}



//1. Check the svg is shown,
//2. Check the session selected option and check 
function showSeat(movie_Name, movie_start, movie_end, movie_house) {
    const session = JSON.parse(localStorage.getItem("moviesessions"));
    // console.log(session);
    var house = $("svg rect").attr("id");
    // console.log(house);
    if (house) {
        $.each(session, function (index) {
            // console.log(JSON.parse(session)[index].moviename);
            if (session[index].moviename == movie_Name && session[index].starttime == movie_start && session[index].endtime == movie_end && session[index].house == movie_house) {
                var bookedSeat = session[index].seats;
                // console.log(bookedSeat);
                for (var key in bookedSeat) {
                    if (key == "A") {
                        // console.log(bookedSeat[key]);
                        $.each(bookedSeat[key], function (i) {
                            var seat_status = bookedSeat[key][i];
                            if (seat_status == "1" || seat_status == "X" || seat_status == "R") {
                                if ($("#A" + (i + 1)).attr("fill") == "orange") {
                                    alert("Please select another seat for A" + (i + 1))
                                    for (var index in selectedSeat) {
                                        if (selectedSeat[index] == "A" + (i + 1)) {
                                            $("#seat" + (parseInt(index) + 1) + "_index").val('default').trigger('change');
                                            selectedSeat[index + 1] = '';
                                            if (index == 1) {
                                                ticket_1_seat = '';
                                            } else if (index == 2) {
                                                ticket_2_seat = '';
                                            } else if (index == 3) {
                                                ticket_3_seat = '';
                                            } else if (index == 4) {
                                                ticket_4_seat = '';
                                            }
                                        }
                                    }

                                }
                                $("#A" + (i + 1)).attr("fill", 'black');
                                $("#A" + (i + 1)).attr("stroke", 'red');
                            }
                            if (seat_status == "0") {
                                if ($("#A" + (i + 1)).attr("fill") != "orange") {
                                    $("#A" + (i + 1)).attr("fill", 'green');
                                    $("#A" + (i + 1)).attr("stroke", 'white')
                                }
                            }

                        });
                    }
                    if (key == "B") {
                        // console.log(bookedSeat[key]);
                        $.each(bookedSeat[key], function (i) {
                            var seat_status = bookedSeat[key][i];
                            // console.log(seat_status);
                            if (seat_status == "1" || seat_status == "X" || seat_status == "R") {
                                if ($("#B" + (i + 1)).attr("fill") == "orange") {
                                    alert("Please select another seat for B" + (i + 1))
                                    for (var index in selectedSeat) {
                                        if (selectedSeat[index] == "B" + (i + 1)) {
                                            $("#seat" + (parseInt(index) + 1) + "_index").val('default').trigger('change');
                                            selectedSeat[index + 1] = '';
                                            if (index == 1) {
                                                ticket_1_seat = '';
                                            } else if (index == 2) {
                                                ticket_2_seat = '';
                                            } else if (index == 3) {
                                                ticket_3_seat = '';
                                            } else if (index == 4) {
                                                ticket_4_seat = '';
                                            }
                                        }
                                    }
                                }
                                $("#B" + (i + 1)).attr("fill", 'black');
                                $("#B" + (i + 1)).attr("stroke", 'red');
                            }
                            if (seat_status == "0") {
                                if ($("#B" + (i + 1)).attr("fill") != "orange") {
                                    $("#B" + (i + 1)).attr("fill", 'green');
                                    $("#B" + (i + 1)).attr("stroke", 'white')
                                }
                            }

                        });
                    }
                    if (key == "C") {
                        // console.log(bookedSeat[key]);
                        $.each(bookedSeat[key], function (i) {
                            var seat_status = bookedSeat[key][i];
                            // console.log(seat_status);
                            if (seat_status == "1" || seat_status == "X" || seat_status == "R") {
                                if ($("#C" + (i + 1)).attr("fill") == "orange") {
                                    alert("Please select another seat for C" + (i + 1))
                                    for (var index in selectedSeat) {
                                        if (selectedSeat[index] == "C" + (i + 1)) {
                                            $("#seat" + (parseInt(index) + 1) + "_index").val('default').trigger('change');
                                            selectedSeat[index + 1] = '';
                                            if (index == 1) {
                                                ticket_1_seat = '';
                                            } else if (index == 2) {
                                                ticket_2_seat = '';
                                            } else if (index == 3) {
                                                ticket_3_seat = '';
                                            } else if (index == 4) {
                                                ticket_4_seat = '';
                                            }
                                        }
                                    }
                                }
                                $("#C" + (i + 1)).attr("fill", 'black');
                                $("#C" + (i + 1)).attr("stroke", 'red');
                            }
                            if (seat_status == "0") {
                                if ($("#C" + (i + 1)).attr("fill") != "orange") {
                                    $("#C" + (i + 1)).attr("fill", 'green');
                                    $("#C" + (i + 1)).attr("stroke", 'white')
                                }
                            }

                        });
                    }
                    if (key == "D") {
                        // console.log(bookedSeat[key]);
                        $.each(bookedSeat[key], function (i) {
                            var seat_status = bookedSeat[key][i];
                            // console.log(seat_status);
                            if (seat_status == "1" || seat_status == "X" || seat_status == "R") {
                                if ($("#D" + (i + 1)).attr("fill") == "orange") {
                                    alert("Please select another seat for D" + (i + 1))
                                    for (var index in selectedSeat) {
                                        if (selectedSeat[index] == "D" + (i + 1)) {
                                            $("#seat" + (parseInt(index) + 1) + "_index").val('default').trigger('change');
                                            selectedSeat[index + 1] = '';
                                            if (index == 1) {
                                                ticket_1_seat = '';
                                            } else if (index == 2) {
                                                ticket_2_seat = '';
                                            } else if (index == 3) {
                                                ticket_3_seat = '';
                                            } else if (index == 4) {
                                                ticket_4_seat = '';
                                            }
                                        }
                                    }
                                }
                                $("#D" + (i + 1)).attr("fill", 'black');
                                $("#D" + (i + 1)).attr("stroke", 'red');
                            }
                            if (seat_status == "0") {
                                if ($("#D" + (i + 1)).attr("fill") != "orange") {
                                    $("#D" + (i + 1)).attr("fill", 'green');
                                    $("#D" + (i + 1)).attr("stroke", 'white')
                                }
                            }

                        });
                    }
                    if (key == "E") {
                        // console.log(bookedSeat[key]);
                        $.each(bookedSeat[key], function (i) {
                            var seat_status = bookedSeat[key][i];
                            // console.log(seat_status);
                            if (seat_status == "1" || seat_status == "X" || seat_status == "R") {
                                if ($("#E" + (i + 1)).attr("fill") == "orange") {
                                    alert("Please select another seat for E" + (i + 1))
                                    for (var index in selectedSeat) {
                                        if (selectedSeat[index] == "E" + (i + 1)) {
                                            $("#seat" + (parseInt(index) + 1) + "_index").val('default').trigger('change');
                                            selectedSeat[index + 1] = '';
                                            if (index == 1) {
                                                ticket_1_seat = '';
                                            } else if (index == 2) {
                                                ticket_2_seat = '';
                                            } else if (index == 3) {
                                                ticket_3_seat = '';
                                            } else if (index == 4) {
                                                ticket_4_seat = '';
                                            }
                                        }
                                    }
                                }
                                $("#E" + (i + 1)).attr("fill", 'black');
                                $("#E" + (i + 1)).attr("stroke", 'red');
                            }
                            if (seat_status == "0") {
                                if ($("#E" + (i + 1)).attr("fill") != "orange") {
                                    $("#E" + (i + 1)).attr("fill", 'green');
                                    $("#E" + (i + 1)).attr("stroke", 'white')
                                }
                            }

                        });
                    }
                    if (key == "F") {
                        // console.log(bookedSeat[key]);
                        $.each(bookedSeat[key], function (i) {
                            var seat_status = bookedSeat[key][i];
                            // console.log(seat_status);
                            if (seat_status == "1" || seat_status == "X" || seat_status == "R") {
                                if ($("#F" + (i + 1)).attr("fill") == "orange") {
                                    alert("Please select another seat for F" + (i + 1))
                                    for (var index in selectedSeat) {
                                        if (selectedSeat[index] == "F" + (i + 1)) {
                                            $("#seat" + (parseInt(index) + 1) + "_index").val('default').trigger('change');
                                            selectedSeat[index + 1] = '';
                                            if (index == 1) {
                                                ticket_1_seat = '';
                                            } else if (index == 2) {
                                                ticket_2_seat = '';
                                            } else if (index == 3) {
                                                ticket_3_seat = '';
                                            } else if (index == 4) {
                                                ticket_4_seat = '';
                                            }
                                        }
                                    }
                                }
                                $("#F" + (i + 1)).attr("fill", 'black');
                                $("#F" + (i + 1)).attr("stroke", 'red');
                            }
                            if (seat_status == "0") {
                                if ($("#F" + (i + 1)).attr("fill") != "orange") {
                                    $("#F" + (i + 1)).attr("fill", 'green');
                                    $("#F" + (i + 1)).attr("stroke", 'white')
                                }
                            }

                        });
                    }
                }
            }
        });
    }
}

$(document).ready(function () {

    reset();
    var svgElement = $(".seating-plan");
    $('#login', '#logout', "#house").hide();
    //auth login information
    $.ajax({
        url: '/auth/me',
        method: 'GET',
        success: function (response) {
            // console.log(response)
            if (response.status === 'success') {
                // User is logged in, handle the response data
                console.log('Logged in user:', response.user.username);
                console.log('Role:', response.user.role);
                username = response.user.username;
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
    var param1 = urlParams.get('param1');
    var param2 = urlParams.get('session');
    var param3 = urlParams.get('param2');


    $(".Type2").hide();
    $(".Type3").hide();
    $(".Type4").hide();
    $("#movie_img").hide();
    // importSeat("A");
    var optionElement = $("#movie_Name");
    $.ajax({
        url: "/movie/getall",
        dataType: "json",
        success: function (jsonData) {
            try {
                // console.log(jsonData);
                var movies = jsonData.movies;
                localStorage.setItem("movies", JSON.stringify(movies));
                $.each(movies, function (index) {
                    // console.log(movies[index].name);
                    var option = `
                    <option value="${movies[index].name}">
                    ${movies[index].name}
                    </option>
                `;
                    optionElement.append(option);
                    // $("#movie_Name").val("default").trigger('change');
                    //get price element
                    adult_price = parseInt(movies[index].aPrice)
                    student_price = parseInt(movies[index].sPrice)
                    elderly_price = parseInt(movies[index].ePrice)

                });
                if (param1 != null) {
                    console.log(param1);
                    $("#movie_Name").val(param1).trigger('change');
                }
                if (param2 != null) {
                    var booking_id = param2.split(" | ")[0];
                    var booking_name = param2.split(" | ")[1];
                    var booking_house = param2.split(" | ")[2];
                    var booking_start = param2.split(" | ")[3];
                    var booking_end = param2.split(" | ")[4];
                    var temp_option = booking_id + ", " + booking_name + ", " + booking_start + ", " + booking_end + ", " + booking_house;
                    // console.log(param2);
                    // console.log(temp_option);
                    $("#movie_Name").val(booking_name).trigger('change');
                    $("#movie_Session").val(temp_option).trigger('change');
                    // if(param2 == 'Adult'){
                    //     $("#option1").prop("checked", true);
                    // }else if(param2 == 'Student'){
                    //     $("#option2").prop("checked", true);
                    // }else if(param2 == 'Elderly'){
                    //     $("#option3").prop("checked", true);
                    // }

                }
                if (param3 != null) {
                    if (param3 == 'Adult') {
                        $("#option1").prop("checked", true);
                    } else if (param3 == 'Student') {
                        $("#option2").prop("checked", true);
                    } else if (param3 == 'Elderly') {
                        $("#option3").prop("checked", true);
                    }
                    calculatePrice(1);
                }
                // console.log(adult_price);
                // console.log(student_price);
                // console.log(elderly_price);
            } catch (error) {
                console.log("Error processing JSON data:", error);
            }
        },
        error: function () {
            console.log("Error fetching JSON data.");
        }

    })
        .done(function () {
        });

    $.ajax({
        url: '/moviesession/getall',
        method: 'GET',
        success: function (response) {
            // console.log(response)
            if (response.status === 'success') {
                const moviesessions = response.moviesessions;
                // console.log(moviesessions);
                localStorage.setItem("moviesessions", JSON.stringify(moviesessions));
            } else {
                alert('Unknown error');
            }
        },
        error: function (xhr, status, error) {
            // Error handling
            if (xhr.status === 401) {
                console.log(xhr.responseJSON.message)
            } else {
                console.error('Error:', error);
                alert('Unknown error');
            }
        }
    });

    $.ajax({
        url: '/house/getall',
        method: 'GET',
        success: function (response) {
            // console.log(response)
            if (response.status === 'success') {
                const houses = response.houses;
                // console.log(moviesessions);
                localStorage.setItem("houses", JSON.stringify(houses));
            } else {
                alert('Unknown error');
            }
        },
        error: function (xhr, status, error) {
            // Error handling
            if (xhr.status === 401) {
                console.log(xhr.responseJSON.message)
            } else {
                console.error('Error:', error);
                alert('Unknown error');
            }
        }
    });

    svgElement.on("click", "circle, text", function () {
        // console.log("clicked");
        var elementId = $(this).attr("id");
        var tableId = $(this).text();
        var seat_selected = $('input[name="seatRaido"]:checked');
        //check circle or text is clicked
        if (elementId) {
            var color = $("#" + elementId).attr("fill");
            // console.log(color);//work
            var indexofRadio = seat_selected.attr("id");
            if (color == "green") {
                // console.log(indexofRadio);//work
                if (indexofRadio) {
                    if ((selectedSeat[indexofRadio - 1]) != '') {
                        $("#" + selectedSeat[indexofRadio - 1]).attr("fill", 'green');
                        $("#" + selectedSeat[indexofRadio - 1]).attr("stroke", 'white');
                        selectedSeat[indexofRadio - 1] = '';
                        $("#seat" + indexofRadio + "_alphabet").val('default').trigger('change');
                    }
                    $("#" + elementId).attr("fill", 'orange');
                    $("#" + elementId).attr("stroke", 'red');
                    $("#seat" + indexofRadio + "_alphabet").val(elementId.charAt(0));
                    importNumber(indexofRadio, elementId.split(elementId.charAt(0))[1]);

                    if (indexofRadio == 1) {
                        ticket_1_seat = elementId;
                    } else if (indexofRadio == 2) {
                        ticket_2_seat = elementId;
                    } else if (indexofRadio == 3) {
                        ticket_3_seat = elementId;
                    } else if (indexofRadio == 4) {
                        ticket_4_seat = elementId;
                    }
                    selectedSeat = [ticket_1_seat, ticket_2_seat, ticket_3_seat, ticket_4_seat];
                    // console.log(selectedSeat);
                    if ($("#amount").val() > indexofRadio) {
                        $("#" + (parseInt(indexofRadio) + 1)).prop("checked", true);
                        $("#svg_selecting").html("Selecting ticket " + (parseInt(indexofRadio) + 1))
                    } else {
                        $("#1").prop("checked", true);
                        $("#svg_selecting").html("Selecting ticket 1")
                    }
                }
            } else if (color == "orange") {
                // console.log(indexofRadio);//work
                //find which radio is selected
                var index = selectedSeat.indexOf(elementId);
                if (index != -1) {
                    $("#" + elementId).attr("fill", 'green');
                    $("#" + elementId).attr("stroke", 'white');
                    selectedSeat[index] = '';
                    // console.log(selectedSeat);
                    $("#" + (parseInt(index) + 1)).prop("checked", true);
                    $("#svg_selecting").html("Selecting ticket " + (parseInt(index) + 1))
                    $("#seat" + (parseInt(index) + 1) + "_alphabet").val('default').trigger('change');
                }
            }
        } else if (tableId) {
            color = $("#" + tableId).attr("fill");
            // console.log(color);//work
            indexofRadio = seat_selected.attr("id");
            if (color == "green") {
                // console.log(indexofRadio);//work
                if (indexofRadio) {
                    if ((selectedSeat[indexofRadio - 1]) != '') {
                        $("#" + selectedSeat[indexofRadio - 1]).attr("fill", 'green');
                        $("#" + selectedSeat[indexofRadio - 1]).attr("stroke", 'white');
                        selectedSeat[indexofRadio - 1] = '';
                        $("#seat" + indexofRadio + "_alphabet").val('default').trigger('change');
                    }
                    $("#" + tableId).attr("fill", 'orange');
                    $("#" + tableId).attr("stroke", 'red');
                    $("#seat" + indexofRadio + "_alphabet").val(tableId.charAt(0));
                    importNumber(indexofRadio, tableId.split(tableId.charAt(0))[1]);
                    if (indexofRadio == 1) {
                        ticket_1_seat = tableId;
                    } else if (indexofRadio == 2) {
                        ticket_2_seat = tableId;
                    } else if (indexofRadio == 3) {
                        ticket_3_seat = tableId;
                    } else if (indexofRadio == 4) {
                        ticket_4_seat = tableId;
                    }
                    selectedSeat = [ticket_1_seat, ticket_2_seat, ticket_3_seat, ticket_4_seat];
                    // console.log(selectedSeat);
                    if ($("#amount").val() > indexofRadio) {
                        $("#" + (parseInt(indexofRadio) + 1)).prop("checked", true);
                        $("#svg_selecting").html("Selecting ticket " + (parseInt(indexofRadio) + 1))
                    } else {
                        $("#1").prop("checked", true);
                        $("#svg_selecting").html("Selecting ticket 1")
                    }
                }
            } else if (color == "orange") {
                // console.log(indexofRadio);//work
                //find which radio is selected
                index = selectedSeat.indexOf(tableId);
                if (index != -1) {
                    $("#" + tableId).attr("fill", 'green');
                    $("#" + tableId).attr("stroke", 'white');
                    selectedSeat[index] = '';
                    // console.log(selectedSeat);
                    $("#" + (parseInt(index) + 1)).prop("checked", true);
                    $("#svg_selecting").html("Selecting ticket " + (parseInt(index) + 1));
                    $("#seat" + (parseInt(index) + 1) + "_alphabet").val('default').trigger('change');
                }
            }
        }
    });

    $('#movie_Name').on('change', function () {
        reset();
        const movie_Name = $(this).val();
        const data = localStorage.getItem("movies");
        const session = JSON.parse(localStorage.getItem("moviesessions"));
        // console.log(session)
        const movies = JSON.parse(data);
        // console.log(movies);
        $.each(movies, function (index) {
            // console.log(movies[index].name);
            if (movies[index].name == movie_Name) {
                // console.log(movies[index].name);
                adult_price = parseInt(movies[index].aPrice);
                student_price = parseInt(movies[index].sPrice);
                elderly_price = parseInt(movies[index].ePrice);
                calculatePrice(1);
                calculatePrice(2);
                calculatePrice(3);
                calculatePrice(4);
                // console.log(jsonFilePath);
                $("#movie_img").attr("src", movies[index].image).fadeIn();
            }
        });
        $("#movie_Session").html(`<option value="default" disabled selected>Select a Session</option>`);
        $.each(session, function (index) {
            // console.log(JSON.parse(session)[index].moviename);
            if (session[index].moviename == movie_Name) {
                var sesion_context = `
                    <option value="${session[index]._id}, ${movie_Name}, ${session[index].starttime}, ${session[index].endtime}, ${session[index].house}">
                        ${session[index].starttime} - ${session[index].endtime}, House ${session[index].house}
                    </option>
                `
                $("#movie_Session").append(sesion_context);
            }
        });
    });


    $("#movie_Session").on('change', function () {
        const name = $(this).val().split(", ")[1];
        const starttime = $(this).val().split(", ")[2];
        const endtime = $(this).val().split(", ")[3];
        const house = $(this).val().split(", ")[4];
        // console.log(house);
        if (house) {
            importSeat(house);
            $(".seating-plan").fadeIn();
            showSeat(name, starttime, endtime, house);
        }
    });

    $("#reset").on("click", function () {
        // console.log("reseted")
        reset();
    });

    $("#book_btn").on("click", function (event) {
        event.preventDefault();
        validateForm();
    });

});

setInterval(function () {
    updateSeat();
}, 5000);

