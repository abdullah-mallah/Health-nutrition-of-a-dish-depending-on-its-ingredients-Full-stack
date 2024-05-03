const api = "http://localhost:5000/api/users";

document.addEventListener("DOMContentLoaded", function () {
  const url = "http://localhost:5000/api/reciepes"; //example of totally another rout with another use
  const path = window.location.pathname;
  if (path.includes('signup')) {
    const signupForm = document.querySelector('#signupForm');
    signupForm.addEventListener('submit', signupFormSubmitHandler);
  } else if (path.includes('login')) {
    const loginForm = document.querySelector('#loginForm');
    loginForm.addEventListener('submit', loginFormSubmitHandler);
  }
});

function signupFormSubmitHandler(event) {
  event.preventDefault();
  console.log('Handling signup form submission');
  let newUsername = document.getElementById('Name').value;
  let newEmail = document.getElementById('E-mail').value;
  let newPassword = document.getElementById('Password').value;
  if (!checkNewInput(newUsername, 'username') || !checkNewInput(newEmail, 'email') || !checkNewInput(newPassword, 'password')){
    //switch 
    alert('Please enter the data  in the correct format');
  }else{
  // could make this into its own function 
    let currentUser = { userName: newUsername, email: newEmail, password: newPassword} //preparing them to become a json 
  fetch(`${api}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
    body: JSON.stringify(currentUser), //the body holds the data I'm sending to the route
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
          window.location.href = 'home.html';
        })
        .catch((error) => {
          alert(error.message)
        });
  // alert(`Creating account with username: ${newUsername}, E-mail: ${newEmail} and password: ${newPassword}`);
      }
}

function loginFormSubmitHandler(event) {
  event.preventDefault();
  console.log('Handling login form submission');
  const Email = document.getElementById('E-mail').value;
  const Password = document.getElementById('password').value;
  if ( !checkNewInput(Email, 'email') || !checkNewInput(Password, 'password')){
    //switch
    alert('Please enter the data  in the correct format');
   
  }else{
  // could make this into its own function 
  const userData = { email: Email , password: Password }; //preparing them to become a json 
  fetch(`${api}/login`, {
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
          console.log(userData.password, userData.email)
          // Refresh the list after adding
          alert(data.message);
          window.location.href = 'home.html';
        })
        .catch((error) => {
          alert(error.message)
        });
  // alert(`logged in to E-mail: ${Email} and password: ${Password}`);
      }
}


function checkNewInput(input, type) {
  if (type === 'username') {
    // Check if username meets criteria
    if (!/^[\w.-]{3,15}$/.test(input)) {
      alert( "Username must be 3-15 characters long and can only contain letters, numbers, underscore, dot, or dash.");
      return false;
    }
  } else if (type === 'email') {
    // Check if email meets criteria
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
      alert("Invalid email format.");
      return false;
    }
  } else if (type === 'password') {
    // Check if password meets criteria
    if (input.length < 6) {
      alert("Password must be at least 6 characters long.");
      return false;
    }
  } else {
    console.log("Invalid type specified.");
    return false;
  }

  // If all criteria pass, return null (indicating success)
  return true;
}

function fetchRecipes() {
  const food = document.getElementById('foodInput').value;
  if (food) {
      fetch(`http://localhost:5000/api/recipes/${food}`)
      .then(response => response.json())
      .then(recipes => {
          const recipesContainer = document.getElementById('recipes');
          recipesContainer.innerHTML = ''; // Clear previous results

          recipes.forEach(recipe => {
              const recipeElement = document.createElement('div');
              recipeElement.innerHTML = `
                  <h3>${recipe.label}</h3>
                  <p>Calories: ${recipe.calories}</p>
              `;
              recipesContainer.appendChild(recipeElement);
          });
      })
      .catch(error => console.error('Error fetching recipes:', error));
  } else {
      alert('Please enter a food item.');
  }
}


// you can make the query injections as a seperate function since it is being used so often
// you can then take the check validity based on type 
// checking if too long can be part of the query check or validity
// side quest Action listener
