document.addEventListener("DOMContentLoaded", function () {
  const api = "http://localhost:5000/api/users";
  const url = "http://localhost:5000/api/reciepes"; //example of totally another rout with another use
  const path = window.location.pathname;
  if (path.includes('signup.html')) {
    const signupForm = document.querySelector('#signupForm');
    signupForm.addEventListener('submit', signupFormSubmitHandler(api));
  } else if (path.includes('login.html')) {
    const loginForm = document.querySelector('#loginForm');
    loginForm.addEventListener('submit', loginFormSubmitHandler);
  }
});

function signupFormSubmitHandler(event,api) {
  event.preventDefault();
  console.log('Handling signup form submission');
  const newUsername = document.getElementById('Name').value;
  const newEmail = document.getElementById('E-mail').value;
  const newPassword = document.getElementById('Password').value;
  // check input.. 
  // could make this into its own function 
  const userData = { newUserName, newEmail, newPassword }; //preparing them to become a json 
  fetch(`${api}/${signup}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData), //the body holds the data I'm sending to the route
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            return response.json().then(data => {
              throw new Error(data.message); // Assuming the JSON contains a "message" property with the error message
            });
          }
        })
        .then((data) => {
          // Refresh the list after adding
          alert(data.message);
        })
        .catch((error) => {
          alert(error.message)
        });
  alert(`Creating account with username: ${newUsername}, E-mail: ${newEmail} and password: ${newPassword}`);
}

function loginFormSubmitHandler(event) {
  event.preventDefault();
  console.log('Handling login form submission');
  const email = document.getElementById('E-mail').value;
  const password = document.getElementById('password').value;
  //check input..
}

function checkNewInput(input,type){
  return null;
    // if (newUsername || newEmail || newPassword .includes("^\w(?:\w|[.-](?=\w)){3,31}$")) {ERROR alert...}
  // if (check if  username is not too long > 15 ||email is not too long||password is not too long){}
  // if (newEmail ... in correct format ie (**** @ {gmail,yahoo,,,, ****}. com){
  // send email 
  // return message}
}

function fetchPost(req, res, next){
  // const userData = { newUserName, newEmail, newPassword }; //preparing them to become a json 
  // fetch(${api}/${req}, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(userData), //the body holds the data I'm sending to the route
  //     })
  //       .then((response) => {
  //         if (response.ok) {
  //           return response.json();
  //         } else {
  //           return response.json().then(data => {
  //             throw new Error(data.message); // Assuming the JSON contains a "message" property with the error message
  //           });
  //         }
  //       })
  //       .then((data) => {
  //         // Refresh the list after adding
  //         alert(data.message);
  //       })
  //       .catch((error) => {
  //         alert(error.message)
  //       });
  // alert(`Creating account with username: ${newUsername}, E-mail: ${newEmail} and password: ${newPassword}`);
}

// you can make the query injections as a seperate function since it is being used so often
// you can then take the check validity based on type 
// checking if too long can be part of the query check or validity
// side quest Action listener
