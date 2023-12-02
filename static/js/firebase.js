import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js'
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";
// import fs from './fs/promises';
// console.log("testing");
// import config from '../../src/config.js';

const firebaseConfig = {
    apiKey: "AIzaSyBWeBGKNi57QVDl1NS7MTX8SP-cDPiolVg",
    authDomain: "eie4432-groupproject.firebaseapp.com",
    projectId: "eie4432-groupproject",
    storageBucket: "eie4432-groupproject.appspot.com",
    messagingSenderId: "1056617214994",
    appId: "1:1056617214994:web:724e09f74a2815c80194cb",
    measurementId: "G-7CNEWDLBV6"
};
// console.log("testing");

//not working yet
// const firebaseConfig = {
//     apiKey: config.API_KEY,
//     authDomain: config.AUTH_DOMAIN,
//     projectId: config.PROJECT_ID,
//     storageBucket: config.STORAGE_BUCKET,
//     messagingSenderId: config.MESSAGING_SENDER_ID,
//     appId: config.APP_ID,
//     measurementId: config.MEASUREMENT_ID
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);
var file;

$(document).ready(function() {
    // console.log("ready");

    $("#add_movie_image,#edit_movie_image").hide();

    $("#add_movie_name").on("blur", function() {
        if ($(this).val() == "") {
            // $("#add_movie_name_message").text("Please enter a movie name");
            $("#add_movie_image").hide();
        }else{
            $("#add_movie_image").fadeIn();
        }
    });

    $("#edit_movie_name").on("change", function() {
        if ($(this).val() == "") {
            // $("#add_movie_name_message").text("Please enter a movie name");
            $("#edit_movie_image").hide();
        }else{
            $("#edit_movie_image").fadeIn();
        }
    });

    $("#add_movie_image").click(function(event) {
        const filename = $("#add_movie_name").val();
        if (filename == "") {
          alert("Please enter a filename");
          return;
        }
    });
    
    $('#edit_movie_btn').on('click', async function (event) {
      if (!window.confirm('Are you sure you want to update?')) {
        return;
      }
      event.preventDefault();
      const edit_movie_name = $('#edit_movie_name').val();
      const edit_movie_type = $('#edit_movie_type').val();
      const edit_movie_adult_fee = $('#edit_movie_adult_fee').val();
      const edit_movie_student_fee = $('#edit_movie_student_fee').val();
      const edit_movie_elderly_fee = $('#edit_movie_elderly_fee').val();
      const edit_movie_duration = $('#edit_movie_duration').val();
      const add_image_url = $('#edit_movie_image_message').text();
      // const edit_movie_image = $('#edit_movie_image').val();
      var movie_img = $('#edit_movie_image')[0].files[0];
      console.log(movie_img);
      if (
        !edit_movie_name ||
        !edit_movie_type ||
        !edit_movie_adult_fee ||
        !edit_movie_student_fee ||
        !edit_movie_elderly_fee ||
        !edit_movie_duration
      ) {
        alert('Information cannot be empty');
        return;
      }
      const formData = new FormData();
      formData.append('edit_movie_name', edit_movie_name);
      formData.append('edit_movie_type', edit_movie_type);
      formData.append('edit_movie_adult_fee', edit_movie_adult_fee);
      formData.append('edit_movie_student_fee', edit_movie_student_fee);
      formData.append('edit_movie_elderly_fee', edit_movie_elderly_fee);
      formData.append('edit_movie_duration', edit_movie_duration);
      console.log(movie_img);
      if (movie_img == undefined) {
        $.ajax({
          url: '/movie/edit2',
          method: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          success: function (response) {
            if (response.status === 'success') {
              alert('Movie: ' + response.movie.name + ' is edited');
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
        // return;
      }else{
        const allowedFormats = ["image/jpeg", "image/png"]; // Add or modify the allowed file formats as needed
        if (!allowedFormats.includes(movie_img.type)) {
            // Invalid file format
            console.log("Invalid file format. Please select a JPEG or PNG file.");
            alert("Invalid file format. Please select a JPEG or PNG file.");
            return;
          }
          await addMovie(movie_img, edit_movie_name,"edit", formData);
      }
      
      // if (add_image_url != "") {
      //   formData.append('add_image_url', add_image_url);
      // }
      // formData.append('edit_movie_image', edit_movie_image);
  
      // $.ajax({
      //   url: '/movie/edit',
      //   method: 'POST',
      //   data: formData,
      //   processData: false,
      //   contentType: false,
      //   success: function (response) {
      //     if (response.status === 'success') {
      //       alert('Movie: ' + response.movie.name + ' is edited');
      //       window.location.href = '/admin.html';
      //     } else {
      //       alert(response.message);
      //     }
      //   },
      //   error: function (xhr, status, error) {
      //     if (xhr.status === 400) {
      //       alert(xhr.responseJSON.message);
      //     } else {
      //       alert('error: ' + xhr.status);
      //     }
      //   },
      // });
      // // await addMovie(movie_img, add_movie_name,"add");
    });

      $('#add_movie_btn').on('click', async function (event) {
        if (!window.confirm('Are you sure you want to add?')) {
          return;
        }
        event.preventDefault();
        const add_movie_name = $('#add_movie_name').val();
        const add_movie_type = $('#add_movie_type').val();
        const add_movie_adult_fee = $('#add_movie_adult_fee').val();
        const add_movie_student_fee = $('#add_movie_student_fee').val();
        const add_movie_elderly_fee = $('#add_movie_elderly_fee').val();
        const add_movie_duration = $('#add_movie_duration').val();
        const add_image_url = $('#add_movie_image_message').text();
        
        if (file == null) {
            console.log("No file selected");
            return;
        }
    
        if (
          !add_movie_name ||
          !add_movie_type ||
          !add_movie_adult_fee ||
          !add_movie_student_fee ||
          !add_movie_elderly_fee ||
          !add_movie_duration
        ) {
          alert('Information cannot be empty');
          return;
        }
        if(file){
          const allowedFormats = ["image/jpeg", "image/png"]; // Add or modify the allowed file formats as needed
        
          if (!allowedFormats.includes(file.type)) {
              // Invalid file format
              console.log("Invalid file format. Please select a JPEG or PNG file.");
              return;
          }
        }
        await addMovie(file, add_movie_name,"add");
        
      });

    $("#add_movie_image").on("change", function(event) {
        console.log("file selected");
        const filename = $("#add_movie_name").val();
        
        if (filename == "") {
          console.log("Please enter a filename");
          $("#add_movie_image").val("");
          return;
        }
        
        // Get the selected file
        file = event.target.files[0];
        if (file == null) {
          console.log("No file selected");
          return;
        }
        
        // File and filename are valid, proceed with your desired actions
        // addMovie(file, filename,"add");
    });
    
    $("#edit_movie_image").on("change", function(event) {
        console.log("file selected");
        const filename = $("#edit_movie_name").val();
        
        if (filename == "") {
          console.log("Please choose a movie first");
          $("#edit_movie_image").val("");
          return;
        }
        
        // Get the selected file
        const file = event.target.files[0];
        if (file == null) {
          console.log("No file selected");
          return;
        }
    
      });

      $("#register_img").on("change", function(event) {
        console.log("file selected");
        const filename = $("#register_img").val();
        
        // Get the selected file
        file = event.target.files[0];
        if (file == null) {
          console.log("No file selected");
          return;
        }
    
      });

      $("#profile_img").on("change", function(event) {
        console.log("file selected");
        
        // Get the selected file
        file = event.target.files[0];
        if (file == null) {
          console.log("No file selected");
          return;
        }
    
      });

    $("#delete_movie_btn").click(function(event) {
        event.preventDefault();
        console.log("delete button clicked");
        const filename = $("#delete_movie_input").val();
        console.log(filename);
        const select_movie = $("#delete_movie_name").val();
        if (filename == "") {
            console.log("Please enter a filename");
            return;
        }else if (filename != select_movie) {
            console.log("Please enter the correct movie name");
            return;
        }else{
            // let filename_formated = encodeURIComponent(filename);
            deleteMovie(filename);
        }
    });

    $('#register-btn').on('click', async function (event) {
      event.preventDefault();
      const username = $('#register-name').val();
      const email = $('#register-email').val();
      const password1 = $('#register-pw1').val();
      const password2 = $('#register-pw2').val();
      const gender = $('#register-gender').val();
      const birthdate = $('#register-birthdate').val();
  
      const img = $('#register_img')[0].files[0];
  
      if (!username || !password1 || !password1) {
        alert('Username and password cannot be empty');
        return;
      }
  
      if (password1 !== password2) {
        alert('Password mismatch!');
        return;
      }

      if (password1.length < 8) {
        alert('Password must be at least 8 characters!');
        return;
      }
  
      if (!email) {
        alert('Please enter your email');
        return;
      }
      if (!gender) {
        alert('Please enter your gender');
        return;
      }
      if (!birthdate) {
        alert('Please enter your birthdate');
        return;
      }
      if(img != undefined){
        const allowedFormats = ["image/jpeg", "image/png"]; // Add or modify the allowed file formats as needed
        if (!allowedFormats.includes(file.type)) {
            // Invalid file format
            console.log("Invalid file format. Please select a JPEG or PNG file.");
            alert("Invalid file format. Please select a JPEG or PNG file.");
            return;
        }
      }
      // console.log(img);
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password1);
      formData.append('email', email);
      formData.append('gender', gender);
      formData.append('birthdate', birthdate);
      formData.append('img', null);
       $.ajax({
        url:'/auth/register',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          console.log(response);
          if (response.status === 'success') {
            const formData2 = new FormData();
            formData2.append('username', username);
            $.ajax({
              url:'/auth/account_id',
              method: 'POST',
              data: formData2,
              processData: false,
              contentType: false,
              success: async function (response) {
                if (response.status === 'success') {
                  var account= response.data;
                  console.log(account._id);
                  if(img != undefined){
                    await registerUser(img, account._id);
                  }else{
                    window.location.href = '/login.html';
                  }
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
          } else {
            alert('Unknown error');
          }
        },
        error: function (xhr, error) {
          if (xhr.status === 401) {
            alert(xhr.responseJSON.message);
          } else {
            // console.error('Error:', error);
            alert(xhr.responseJSON.message);
            // alert('Unknown error');
          }
        },
      });
    });

    $('#edit-btn').on('click', async function (event) {
      event.preventDefault();

      await submitEditForm();
  });
});

async function registerUser(file_data, filename){
  if(file_data){
    // Create a storage reference from our storage service
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file_data);
    uploadTask.on('state_changed', 
        (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            // switch (snapshot.state) {
            // case 'paused':
            //     console.log('Upload is paused');
            //     break;
            // case 'running':
            //     console.log('Upload is running');
            //     break;
            // }
        }, 
        (error) => {
            // Handle unsuccessful uploads
        }, 
        () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                const formData = new FormData();
                formData.append('id', filename);
                formData.append('img', downloadURL);
              
                $.ajax({
                  url: '/auth/uploadImgURL',
                  method: 'POST',
                  data: formData,
                  processData: false,
                  contentType: false,
                  success: function (response) {
                    if (response.status === 'success') {
                      // alert('User: ' + response.user.username + ' is registered');
                      alert('Image upload successfully and account created successfully')
                      window.location.href = '/login.html';
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
        }
    )
  }
}

async function editUserImg(file_data, filename, form){
  if(file_data != undefined){
    // Create a storage reference from our storage service
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file_data);
    uploadTask.on('state_changed', 
        (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            // switch (snapshot.state) {
            // case 'paused':
            //     console.log('Upload is paused');
            //     break;
            // case 'running':
            //     console.log('Upload is running');
            //     break;
            // }
        }, 
        (error) => {
            // Handle unsuccessful uploads
        }, 
        () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                const formData = form;
                formData.append('img', downloadURL);
                $.ajax({
                  url: 'auth/edit2',
                  method: 'POST',
                  data: formData,
                  processData: false,
                  contentType: false,
                  success: function (response) {
                      // Handle successful response
                      console.log(response);
                      if (response.status == 'success') {
                          // alert(`Update success!\nUsername: ${response.user.username}\nEmail: ${response.user.email}\nGender: ${response.user.gender}\nBirthdate: ${response.user.birthdate.replace("T", ' ')}`);
                          alert(response.user.username +" successfully updated! and Login again!");
                          $("#logout-btn").click();
            
                      }
                  },
                  error: function (xhr, status, error) {
                      // Handle error
                      if (xhr.status === 400 || xhr.status === 500) {
                          alert(xhr.responseJSON.message);
                      } else {
                          alert('error: ' + xhr.status);
                      }
            
                  }
              });
              });
        }
    )
        // return Promise.resolve(uploadUrl);
  }
  // return Promise.resolve(uploadUrl);
}

async function addMovie(file, filename, call, form) {
    const add_movie_name = $('#add_movie_name').val();
    const add_movie_type = $('#add_movie_type').val();
    const add_movie_adult_fee = $('#add_movie_adult_fee').val();
    const add_movie_student_fee = $('#add_movie_student_fee').val();
    const add_movie_elderly_fee = $('#add_movie_elderly_fee').val();
    const add_movie_duration = $('#add_movie_duration').val();
    
    // Check the file format
    if (file) {

        // const image_name = encodeURIComponent(file.name);
        // const image_name = file.name;
        const image_name = filename;
        console.log(image_name);
        // Create a storage reference from our storage service
        const storageRef = ref(storage, image_name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed', 
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                // switch (snapshot.state) {
                // case 'paused':
                //     console.log('Upload is paused');
                //     break;
                // case 'running':
                //     console.log('Upload is running');
                //     break;
                // }
            }, 
            (error) => {
                // Handle unsuccessful uploads
            }, 
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    if (call == "add") {
                        $("#add_movie_image_message").text(downloadURL);
                        const add_image_url = $('#add_movie_image_message').text();
                        const formData = new FormData();
                        formData.append('add_movie_name', add_movie_name);
                        formData.append('add_movie_type', add_movie_type);
                        formData.append('add_movie_adult_fee', add_movie_adult_fee);
                        formData.append('add_movie_student_fee', add_movie_student_fee);
                        formData.append('add_movie_elderly_fee', add_movie_elderly_fee);
                        formData.append('add_movie_duration', add_movie_duration);
                        formData.append('add_image_url', add_image_url);
                    
                        $.ajax({
                          url: '/movie/add',
                          method: 'POST',
                          data: formData,
                          processData: false,
                          contentType: false,
                          success: function (response) {
                            if (response.status === 'success') {
                              alert('Movie: ' + response.movie.name + ' is added');
                              file = null;
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
                    }else if (call == "edit") {
                        $("#edit_movie_image_message").text(downloadURL);
                        // const edit_movie_name = downloadURL;
                        const formData2 = form;
                        formData2.append('edit_image_url', downloadURL);
                        $.ajax({
                          url: '/movie/edit',
                          method: 'POST',
                          data: formData2,
                          processData: false,
                          contentType: false,
                          success: function (response) {
                            if (response.status === 'success') {
                              alert('Movie: ' + response.movie.name + ' is edited');
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

                    }
                    // if (add_image_url == "") {
                    //     alert('Please upload image or wait for it');
                    //     return;
                    //   }
                    
                });
            }
        )
    }
}

function deleteMovie(filename) {
    // let filename_formated = encodeURIComponent(filename);
    let filename_formated = filename;
    // Create a reference to the file to delete
    const desertRef = ref(storage, filename_formated);

    // Delete the file
    deleteObject(desertRef).then(() => {
        console.log('File deleted successfully');
    }).catch((error) => {
       console.log(error);
    });
}

async function submitEditForm() {
  // $('#edit-email').val();
  // $('#edit-name').val();
  // $('#edit-gender').val();
  // $('#edit-birthdate').val();
  var user_name;
  $.ajax({
    url: '/auth/me',
    method: 'GET',
    success: function (response) {
        if (response.status === 'success') {
            // User is logged in, handle the response data
            user_name = response.user.username;
            const formData2 = new FormData();
            formData2.append('username',user_name);
            var user_id;
            $.ajax({
              url:'/auth/account_id',
              method: 'POST',
              data: formData2,
              processData: false,
              contentType: false,
              success: async function (response) {
                if (response.status === 'success') {
                  var account= response.data;
                  user_id = account._id;
                  console.log(account._id);
                  var profile_img = $('#profile_img')[0].files[0];
                  console.log(profile_img);
                  const formData = new FormData();
                  formData.append('_id', user_id);
                  formData.append('username', $('#edit-name').val());
                  formData.append('email', $('#edit-email').val());
                  formData.append('gender', $('#edit-gender').val());
                  formData.append('birthdate', $('#edit-birthdate').val());
                  if(profile_img != undefined){
                    const allowedFormats = ["image/jpeg", "image/png"]; // Add or modify the allowed file formats as needed
                    if (!allowedFormats.includes(profile_img.type)) {
                        // Invalid file format
                        console.log("Invalid file format. Please select a JPEG or PNG file.");
                        alert("Invalid file format. Please select a JPEG or PNG file.");
                        return;
                    }

                    await editUserImg(profile_img, user_id, formData);
                  
                  }else{
                    $.ajax({
                        url: 'auth/edit',
                        method: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (response) {
                            // Handle successful response
                            console.log(response);
                            if (response.status == 'success') {
                                alert("Successfully updated! and Login again!");
                                $("#logout-btn").click();
                  
                            }
                        },
                        error: function (xhr, status, error) {
                            // Handle error
                            if (xhr.status === 400 || xhr.status === 500) {
                                alert(xhr.responseJSON.message);
                            } else {
                                alert('error: ' + xhr.status);
                            }
                  
                        }
                    });

                  }
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
  

}
  

