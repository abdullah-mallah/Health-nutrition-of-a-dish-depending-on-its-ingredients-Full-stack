
const api = "http://localhost:5000/api/users";

let allRecipes = []; // Global variable to store all fetched recipes
let UserId; 

document.addEventListener("DOMContentLoaded", function () {

  UserId = sessionStorage.getItem('UserId');
  
  const path = window.location.pathname;
  if (path.includes('signup')) {
    const signupForm = document.querySelector('#signup_signupForm');
    signupForm.addEventListener('submit', signupFormSubmitHandler);
  } else if (path.includes('login')) {
    const loginForm = document.querySelector('#login_loginForm');
    loginForm.addEventListener('submit', loginFormSubmitHandler);
  } else if (path.includes('recipes')) {
    const recipeForm = document.querySelector('#RecipeForm');
    recipeForm.addEventListener('submit', fetchRecipes);
    // Adding listeners to checkboxes
    ['vegan', 'vegetarian', 'alcoholFree', 'highProtein', 'lowCarb', 'highFiber', 'lowFat', 'eggFree', 'fishFree', 'glutenFree', 'dairyFree'].forEach(id => {
      document.getElementById(id).addEventListener('change', filterAndDisplayRecipes);
    });
  } else if (path.includes('home')) {
    home()
  } else if (path.includes('nutritions')) {
    fetchIngrediants();
  } else if (path.includes('favourites')) {
    getFavouriteRecipes()
  } else if (path.includes('profile')) {
    getAcooutInfo();
  }
});


//////////// Login and signup functions
function signupFormSubmitHandler(event) {
  event.preventDefault();
  console.log('Handling signup form submission');
  let newUsername = document.getElementById('signup_Name').value;
  let newEmail = document.getElementById('signup_E-mail').value;
  let newPassword = document.getElementById('signup_Password').value;
  let admin =document.getElementById('signup_Admin').checked;
  if (!checkNewInput(newUsername, 'username') || !checkNewInput(newEmail, 'email') || !checkNewInput(newPassword, 'password')){
    //switch 
    alert('Please enter the data  in the correct format');
  }else{
  // could make this into its own function 
    let currentUser = { userName: newUsername, email: newEmail, password: newPassword,admin: admin} //preparing them to become a json 
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
  const Email = document.getElementById('login_E-mail').value;
  const Password = document.getElementById('login_password').value;
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
          UserId = data.user.id;

          sessionStorage.setItem('UserId', UserId);  // Save to session storage
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

//////////// recipe tab functions
function fetchRecipes(event) {
  event.preventDefault();
  const food = document.getElementById('foodInput').value;

  if (food) { // Fetch new recipes every time the form is submitted
    fetch(`http://localhost:5000/api/recipes/${food}`)
    .then(response => response.json())
    .then(recipes => {
        allRecipes = recipes; // Store fetched recipes
        filterAndDisplayRecipes(); // Filter and display recipes after fetching
    })
    .catch(error => {
        console.error('Error fetching recipes:', error);
        alert('Failed to fetch recipes.');
    });
  } else {
    alert('Please enter a food item.');
  }
}

function filterAndDisplayRecipes() {
  const vegan = document.getElementById('vegan').checked;
  const vegetarian = document.getElementById('vegetarian').checked;
  const alcoholFree = document.getElementById('alcoholFree').checked;
  const highProtein = document.getElementById('highProtein').checked;
  const lowCarb = document.getElementById('lowCarb').checked;
  const lowFat = document.getElementById('lowFat').checked;
  const highFiber = document.getElementById('highFiber').checked;
  const eggFree = document.getElementById('eggFree').checked;
  const fishFree = document.getElementById('fishFree').checked;
  const glutenFree = document.getElementById('glutenFree').checked;
  const dairyFree = document.getElementById('dairyFree').checked;

  // Get the value of maximum calories input field
  const maxCalories = document.getElementById('maxCalories').value;

  const filteredRecipes = allRecipes.filter(recipe => {
    const dietFilters =
      (!vegan || recipe.healthLabels.includes('Vegan')) &&
      (!vegetarian || recipe.healthLabels.includes('Vegetarian')) &&
      (!alcoholFree || recipe.healthLabels.includes('Alcohol-Free')) &&
      (!highProtein || recipe.dietLabels.includes('High-Protein')) &&
      (!lowCarb || recipe.dietLabels.includes('Low-Carb')) &&
      (!lowFat || recipe.dietLabels.includes('Low-Fat')) &&
      (!highFiber || recipe.dietLabels.includes('High-Fiber')) &&
      (!eggFree || recipe.healthLabels.includes('Egg-Free')) &&
      (!fishFree || recipe.healthLabels.includes('Fish-Free')) &&
      (!glutenFree || recipe.healthLabels.includes('Gluten-Free')) &&
      (!dairyFree || recipe.healthLabels.includes('Dairy-Free'));

    // Filter condition for maximum calories
    const meetsMaxCalories = maxCalories === '' || recipe.calories <= maxCalories;

    // Return true only if all filter conditions are met
    return dietFilters && meetsMaxCalories;
  });

  displayRecipeCount(filteredRecipes.length); // Display the count of filtered recipes
  displayRecipes(filteredRecipes); // Display the recipes themselves
}



function displayRecipeCount(count) {
  const countContainer = document.getElementById('recipeCount');
  if (!countContainer) {
    console.error('Recipe count display element not found!');
    return;
  }
  countContainer.textContent = `Showing ${count} recipe(s) that match your filters.`;
}

function displayRecipes(recipes) {
  const recipesContainer = document.getElementById('recipes');
  recipesContainer.innerHTML = ''; // Clear previous results

  recipes.forEach(recipe => {
    const recipeLabelSanitized = recipe.label.replace(/[^a-zA-Z0-9]/g, '_'); // Replace non-alphanumeric characters with underscores
    const recipeElement = document.createElement('div');
    recipeElement.className = 'recipe-card'; // Assign class for styling
    const ingredients = recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('');
    recipeElement.innerHTML = `
    <img src="${recipe.image}" alt="Recipe image">
    <div class="recipe-card-content">
    <h3 id="recipeName-${recipeLabelSanitized}">${recipe.label}</h3>
    <p>Meal Type: ${recipe.mealType}</p>
    <p>Calories: ${recipe.calories} kcal</p>
    <p>Protein: ${recipe.protein} g</p>
    <p>Sugar: ${recipe.sugar} g</p>
    <h4>Ingredients:</h4>
    <ul>${ingredients}</ul>

    <div class="recipe-card-buttons">
      <button type="button" class="cardButton" id="saveRecipe-${recipeLabelSanitized}" data-calories="${recipe.calories}">Add to favourites</button>
      <button type="button" class="cardButton" onclick="openDatePicker('${recipeLabelSanitized}', '${recipe.calories}')">Schedule Meal</button>
      <div style="display:none;" id="datePicker-${recipeLabelSanitized}">
          <input type="date" id="dateInput-${recipeLabelSanitized}">
          <button type="button" onclick="saveMealDate('${recipeLabelSanitized}', '${recipe.calories}')">Save Date</button>
      </div>
    </div>
`;

    recipesContainer.appendChild(recipeElement);
    document.getElementById(`saveRecipe-${recipeLabelSanitized}`).addEventListener('click', function() {
      saveRecipe(recipe);
    });
  });
}

///////// favourites tab functions
function saveRecipe(recipe) {
  if (UserId) {
    const recipeData = {
      user_id: UserId,
      recipe_name: recipe.label,
      calories: recipe.calories,
      image: recipe.image
    };

    fetch('http://localhost:5000/api/favourites/save', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(recipeData)
})
.then(response => {
  if (response.status === 409) {
    // Handle conflict
    alert('This recipe has already been saved.');
    return;
  }
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  if (data) {
    console.log('Recipe saved:', data);
    alert('Recipe saved successfully!');
  }
})
.catch(error => console.error('Failed to save recipe:', error));


  } else {
    console.log('UserId not set. Cannot save recipe.');
  }
}

//// calorie Entry tab function
let selectedRecipeId; // This will store the recipe id for which the date is being set

function openDatePicker(recipeLabelSanitized, calories) {
    selectedRecipeId = recipeLabelSanitized; // Store the current recipe ID
    const modal = document.getElementById('dateModal');
    modal.style.display = 'block'; // Show the modal
}

function confirmDateSelection() {
  const date = document.getElementById('modalDateInput').value;
  if (!date) {
      alert('Please select a date.');
      return;
  }
  const modal = document.getElementById('dateModal');
  modal.style.display = 'none'; // Hide the modal

  saveMealDate(selectedRecipeId, date);
}
function cancelDateSelection() {
  const modal = document.getElementById('dateModal');
  modal.style.display = 'none'; // Hide the modal
}


function saveMealDate(recipeLabelSanitized, date) {
  const caloriesElement = document.getElementById(`saveRecipe-${recipeLabelSanitized}`);
  const calories = caloriesElement.getAttribute('data-calories');
  const recipeNameElement = document.getElementById(`recipeName-${recipeLabelSanitized}`);
  const recipeName = recipeNameElement.textContent.trim();

  if (!date) {
      alert('Please select a date.');
      return;
  }

  const recipeData = {
      user_id: UserId,
      date: date,
      recipe_name: recipeName,
      calories: calories
  };

  
  fetch('http://localhost:5000/api/calorieEntries', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(recipeData)
})
.then(response => {
    if (response.status === 409) {
        alert('This recipe has already been scheduled for this date.');
        return null;
    } else if (!response.ok) {
        throw new Error(`HTTP status ${response.status}: ` + response.statusText);
    }
    return response.json();
})
.then(data => {
    if (data) {
        alert('Meal scheduled successfully!');
    }
})
.catch(error => {
    console.error('Failed to schedule meal:', error);
    alert('Failed to schedule meal: ' + error.message);
});

}





//////////// tracker tab
function fetchEntries() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  const url = `http://localhost:5000/api/calorieEntries/${UserId}?startDate=${startDate}&endDate=${endDate}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);  // Log data to console
        displayCalorieData(data);  // Function to display data in the browser
    })
    .catch(error => console.error('Failed to fetch entries:', error));
}

function displayCalorieData(data) {
    const container = document.getElementById('calorieData');
    container.innerHTML = '';  // Clear previous data
    data.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = `Date: ${day._id}, Total Calories: ${day.totalCalories}`;
        container.appendChild(dayDiv);
    });
}


//////////// profile tab functions
function getAcooutInfo() {
  fetch(`http://localhost:5000/api/users/getAccountInfo/${UserId}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const tableBody = document.getElementById("accountInfoRows");
      tableBody.innerHTML = ""; // Clear existing rows
      console.log(data.accountInfos)
      data.accountInfos.forEach((accountInfo) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = accountInfo.userName;
        row.insertCell(1).textContent = accountInfo.email;
        row.insertCell(2).textContent = accountInfo.password;

        const btn_uppdate = document.createElement("button");
        btn_uppdate.textContent = "Update";
        btn_uppdate.onclick = function () {
          transformRowToUpdateMode(row, accountInfo); //
        };
        row.insertCell(3).appendChild(btn_uppdate);
      });
      function transformRowToUpdateMode(row, accountInfo) {
        const userName = document.createElement("input");
        userName.type = "text";
        userName.value = accountInfo.userName;
        row.cells[0].innerHTML = "";
        row.cells[0].appendChild(userName);

        const email = document.createElement("input");
        email.type = "text";
        email.value = accountInfo.email;
        row.cells[1].innerHTML = "";
        row.cells[1].appendChild(email);

        const password = document.createElement("input");
        password.type = "text";
        password.value = accountInfo.password;
        row.cells[2].innerHTML = "";
        row.cells[2].appendChild(password);

        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "Confirm Update";
        confirmBtn.onclick = function () {
          updateAccount(UserId, {
            userName: userName.value,
            email: email.value,
            password: password.value,
            admin: accountInfo.admin,
          });
        };
        row.cells[3].innerHTML = ""; // Clear previous buttons
        row.cells[3].appendChild(confirmBtn);
      }
      function updateAccount(id, updatedData) {
        fetch(`http://localhost:5000/api/users/uppdateAccount/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
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
            getAcooutInfo(); // Refresh the list to show the updated info
          })
          .catch((error) => console.error("Error updating account info:", error));
      }
    })
    .catch((error) => console.error("Error fetching account info:", error));
}

//////////// ingrediant tab functions
function fetchIngrediants() {
  fetch("http://localhost:5000/api/ingrediants/getAllIngrediants")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const tableBody = document.getElementById("ingrediantsRows");
      tableBody.innerHTML = ""; // Clear existing rows
      console.log(data.ingrediants)
      data.ingrediants.forEach((ingrediant) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = ingrediant.name;
        row.insertCell(1).textContent = ingrediant.size;
        row.insertCell(2).textContent = ingrediant.fat;
        row.insertCell(3).textContent = ingrediant.cholesterol;
        row.insertCell(4).textContent = ingrediant.sodium;
        row.insertCell(5).textContent = ingrediant.carbohydrate;
        row.insertCell(6).textContent = ingrediant.sugar;
        row.insertCell(7).textContent = ingrediant.protein;
        row.insertCell(8).textContent = ingrediant.vitamin_c;
        row.insertCell(9).textContent = ingrediant.vitamin_d;
        row.insertCell(10).textContent = ingrediant.iron;
        row.insertCell(11).textContent = ingrediant.calcium;
        row.insertCell(12).textContent = ingrediant.potassium;
        row.insertCell(13).textContent = ingrediant.phosphorus;
      });
    })
    .catch((error) => console.error("Error fetching recipes:", error));
}

//////////// favourites tab functions
function getFavouriteRecipes() {
  fetch(`http://localhost:5000/api/favourites/getAllFavouriteRecipes/${UserId}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const tableBody = document.getElementById("favouriteRecipeRows");
      tableBody.innerHTML = ""; // Clear existing rows
      console.log(data.favouriteRecipes)
      data.favouriteRecipes.forEach((favouriteRecipe) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = favouriteRecipe.recipe_name;
        row.insertCell(1).textContent = favouriteRecipe.calories;

        // Create an image element
        const img = document.createElement('img');
        img.src = favouriteRecipe.image;
        img.alt = 'Favourite recipe image';
        img.style.width = '100px';
        img.style.height = 'auto';

        // Insert a new cell for the image
        const imgCell = row.insertCell(2);  // Create the new cell for the image
        imgCell.appendChild(img);  // Append the image to the new cell
        
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function () {
          deleteRecipe(UserId, favouriteRecipe.recipe_name);
        };
        row.insertCell(3).appendChild(deleteButton);
      });
      function deleteRecipe(UserId, recipe_name) {
        const favouriteRecipeData = { user_id: UserId, recipe_name: recipe_name }; //preparing them to become a json 
        fetch("http://localhost:5000/api/favourites/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(favouriteRecipeData),
        }).then((response) => {
            if (response.ok) {
              alert("Favourite recipe successfully deleted.");
              getFavouriteRecipes(); // Refresh the list after deletion
            } else {
              throw new Error("Failed to delete favourite recipe");
            }
          }).catch((error) => {
            console.error("Error deleting favourite recipe:", error);
            alert(error.message);
          });
      }
    })
    .catch((error) => console.error("Error fetching recipes:", error));
}


//////////// home tab functions
function home() { 
  // Get all images
  var images = document.querySelectorAll('.home_food-image');
  var currentIndex = 0;

  function showImage(index) {
    // Hide all images
    images.forEach(function (image) {
      image.style.display = 'none';
    });
    // Show the current image
    images[index].style.display = 'block';
  }

  function nextImage() {
    currentIndex++;
    if (currentIndex >= images.length) {
      currentIndex = 0;
    }
    showImage(currentIndex);
  }

  // Show the first image initially
  showImage(currentIndex);

  // Change image every 3 seconds
  setInterval(nextImage, 3000);
}

function fetchArticlesFromAPI() {
}

// you can make the query injections as a seperate function since it is being used so often
// you can then take the check validity based on type 
// checking if too long can be part of the query check or validity
// side quest Action listener
