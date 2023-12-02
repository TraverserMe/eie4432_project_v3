// 20046876D HUI Lai Yuk, Alex
// 20062785D LEE Kin Nang, Harry
var data = {};
var username = '';
var password = '';
var email = '';
var userInfo;


$(document).ready(function () {
  $('#register-page, #register-label, #login-switch').hide();
  $('#login-name, #login-pw').val('');
  $('#register-name, #register-email, #register-pw1, #register-pw2').val('');

  $('#register-switch').click(function () {
    $('#login-page, #forgot-page,#login-label,#register-switch').hide();
    $('#register-page, #register-label, #login-switch').slideDown(1000).show();
    $('#register-name, #register-email, #register-pw1, #register-pw2').val('');
  });

  $('#forgot-switch').click(function () {
    if ($('#forgot-page').is(':visible')) {
      $('#forgot-page').slideUp(1000);
      $('#login-pw,#login-btn,#pw-label').slideDown(1200);
    } else {
      $('#forgot-page').slideDown(1000).show();
      $('#login-pw,#login-btn,#pw-label').hide();

    }
  });

  $('#login-switch').click(function () {
    $('#register-page,#forgot-page, #register-label, #login-switch').hide();
    $('#login-page, #login-label, #register-switch, #login-btn, #forgot-switch').slideDown(1000).show();
    $('#login-name, #login-pw').val('');
  });
  //show the container after loading

  $('#container').css('display', 'flex');

  $('#login-name, #login-pw').on('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      $('#login-btn').click(); // Trigger the click event of the login button
    }
  });

  $('#login-btn').on('click', function (event) {
    event.preventDefault();
    // Get the username and password from the input fields
    const username = $('#login-name').val();
    const password = $('#login-pw').val();

    // Check if the username and password are not empty
    if (!username || !password) {
      alert('Username and password cannot be empty');
      return;
    }

    // Create a FormData object and append the username and password
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    // Send a POST request to the login endpoint
    $.ajax({
      url: '/auth/login',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.status === 'success') {
          alert('Logged in as ' + response.user.username + ' (' + response.user.role + ')');
          window.location.href = '/index.html';
        } else {
          alert('Unknown error');
        }
      },
      error: function (xhr, error) {
        if (xhr.status === 401) {
          alert(xhr.responseJSON.message);
        } else {
          console.error('Error:', error);
          alert('Unknown error');
        }
      },
    });
  });

  // $('#register-btn').on('click', function (event) {
  //   event.preventDefault();
  //   const username = $('#register-name').val();
  //   const email = $('#register-email').val();
  //   const password1 = $('#register-pw1').val();
  //   const password2 = $('#register-pw2').val();
  //   const gender = $('#register-gender').val();
  //   const birthdate = $('#register-birthdate').val();

  //   // const img = $('#img')[0].files[0];

  //   if (!username || !password1 || !password1) {
  //     alert('Username and password cannot be empty');
  //     return;
  //   }

  //   if (password1 !== password2) {
  //     alert('Password mismatch!');
  //     return;
  //   }

  //   if (!email) {
  //     alert('Please enter your email');
  //     return;
  //   }
  //   if (!gender) {
  //     alert('Please enter your gender');
  //     return;
  //   }
  //   if (!birthdate) {
  //     alert('Please enter your birthdate');
  //     return;
  //   }
  //   // if (!img) {
  //   //   alert('You can upload profile photo later');
  //   // }

  //   const formData = new FormData();
  //   formData.append('username', username);
  //   formData.append('password', password1);
  //   formData.append('email', email);
  //   formData.append('gender', gender);
  //   formData.append('birthdate', birthdate);
  //   // formData.append('img', img);

  //   $.ajax({
  //     url: '/auth/register',
  //     type: 'POST',
  //     data: formData,
  //     processData: false,
  //     contentType: false,
  //     success: function (response) {
  //       if (response.status === 'success') {
  //         alert(`Welcome, ${response.user.username}!\nYou can login with your account now!`);
  //         window.location.href = '/login.html';
  //       } else {
  //         alert(response.message);
  //       }
  //     },
  //     error: function (xhr, error) {
  //       if (xhr.status === 400 || xhr.status === 500) {
  //         alert(xhr.responseJSON.message);
  //       } else {
  //         alert('error: ' + xhr.status);
  //       }

  //     },
  //   });
  // });

  $('#forgot-btn').on('click', function (event) {
    event.preventDefault();
    const username = $('#login-name').val();
    const email = $('#forgot-email').val();
    const password1 = $('#forgot-pw').val();

    if (!username || !password1) {
      alert('Username and password cannot be empty');
      return;
    }

    if (!email) {
      alert('Please enter your email');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password1);
    formData.append('email', email);

    $.ajax({
      url: 'auth/forgot',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.status === 'success') {
          // Success handling
          console.log('Password reset successfully');
          alert('Password reset successfully');
          window.location.href = '/login.html';
        } else {
          // Error handling
          console.log('Password reset failed:', response.message);
          alert('Password reset failed:', response.message);

        }
      },
      error: function (xhr, status, error) {
        if (xhr.status === 400 || xhr.status === 500) {
          alert(xhr.responseJSON.message);
        } else {
          alert('Error: ' + xhr.status);
        }
      }
    });
  });

});
