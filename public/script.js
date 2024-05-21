const DEPLOY_URL = "http://localhost:5000"

const user_api = `${DEPLOY_URL}/api/users`;

let allRecipes = []; // Global variable to store all fetched recipes
let UserId; 
let userName1;

document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname;
  UserId = sessionStorage.getItem('UserId');
  token = sessionStorage.getItem('token');
  if (!UserId && !path.includes('login')) {
    window.location.href = 'login.html';
  } else {
    if (path.includes('login')) {
      const signupForm = document.querySelector('#signup_signupForm');
      const loginForm = document.querySelector('#login_loginForm');
      const sign_in_btn = document.querySelector("#sign-in-btn");
      const sign_up_btn = document.querySelector("#sign-up-btn");
      const container = document.querySelector(".container");
      const sign_in_btn2 = document.querySelector("#sign-in-btn2");
      const sign_up_btn2 = document.querySelector("#sign-up-btn2");
      sign_up_btn.addEventListener("click", () => {
        container.classList.add("sign-up-mode");
      });
      sign_in_btn.addEventListener("click", () => {
        container.classList.remove("sign-up-mode");
      });
      sign_up_btn2.addEventListener("click", () => {
        container.classList.add("sign-up-mode2");
      });
      sign_in_btn2.addEventListener("click", () => {
        container.classList.remove("sign-up-mode2");
      });
      signupForm.addEventListener('submit', signupFormSubmitHandler);
      loginForm.addEventListener('submit', loginFormSubmitHandler);
    } else if (path.includes('recipes')) {
      const recipeForm = document.querySelector('#RecipeForm');
      recipeForm.addEventListener('submit', fetchRecipes);
      // Adding listeners to checkboxes
      ['vegan', 'vegetarian', 'alcoholFree', 'highProtein', 'lowCarb', 'highFiber', 'lowFat', 'eggFree', 'fishFree', 'glutenFree', 'dairyFree'].forEach(id => {
        document.getElementById(id).addEventListener('change', filterAndDisplayRecipes);
      });
    } else if (path.includes('home')) {
      const userName = sessionStorage.getItem('userName1');
      if (userName) {
        displayWelcomeMessage(userName);
      }
    } else if (path.includes('ingredients')) {
      fetchIngrediants();
    } else if (path.includes('favourites')) {
      getFavouriteRecipes()
    } else if (path.includes('profile')) {
      getAcooutInfo();
    } else if (path.includes('dashboard')) {
      adminDashBordSU();
    }
    else if (path.includes("about")) {
      About();
    }
    else if (path.includes("nutritions")) {
      const buttonsContainer = document.querySelector('#nutritionsButtons');
      const deleteButton = document.createElement('button');
      deleteButton.className = 'deleteNutritionButton';
      deleteButton.innerHTML = '<i class="fas fa-trash-alt" aria-hidden="true"></i> Delete ALL Entries History'
      deleteButton.onclick = () => deleteEntry(UserId);
      buttonsContainer.appendChild(deleteButton);
    }
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
  fetch(`${DEPLOY_URL}/signup`, {
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
          window.location.href = 'login.html';
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
    fetch(`${DEPLOY_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData), //the body holds the data I'm sending to the route
      })
      .then((response) => {
        if (response.ok) {
          return response.json();  
        } else if (response.status === 401) {  
          return response.json().then(data => {
            alert(data.message); 
          });
        } else {
            return response.json().then(data => {
              throw new Error(data.message); // Assuming the JSON contains a "message" property with the error message
            });
          }
        })
        .then((data) => {
        userName1 = data.user.userName; // Assuming the API response includes the user's name
        sessionStorage.setItem('userName1', userName1);

          UserId = data.user.id;
          sessionStorage.setItem('UserId', UserId);
          token = data.token.Token
          sessionStorage.setItem('token', token);
          window.location.href = 'home.html';
        })
        .catch((error) => {
          alert(error.message)
        });
  // alert(`logged in to E-mail: ${Email} and password: ${Password}`);
      }
}
function displayWelcomeMessage(userName) {
  const welcomeMessage = document.getElementById('welcomeMessage');
  welcomeMessage.textContent = `Welcome ${userName}`;
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
    fetch(`${DEPLOY_URL}/api/recipes/${food}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // Ensure this is correctly set
      }
    })
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
      <button type="button" class="cardButton" id="saveRecipe-${recipeLabelSanitized}" data-calories="${recipe.calories}" data-sugar="${recipe.sugar}" data-protein="${recipe.protein}" >Add to favourites</button>
      <button type="button" class="cardButton" onclick="openDatePicker('${recipeLabelSanitized}', '${recipe.calories}', '${recipe.protein}', '${recipe.sugar}' )">Schedule Meal</button>
      <div style="display:none;" id="datePicker-${recipeLabelSanitized}">
          <input type="date" id="dateInput-${recipeLabelSanitized}">
          <button type="button" onclick="saveMealDate('${recipeLabelSanitized}', '${recipe.calories}', '${recipe.protein}', '${recipe.sugar}')">Save Date</button>
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

    fetch(`${DEPLOY_URL}/api/favourites/save`, {
    method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // Ensure this is correctly set
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
    alert('Recipe saved successfully!');
  }
})
.catch(error => console.error('Failed to save recipe:', error));


  } else {
    console.log('UserId not set. Cannot save recipe.');
  }
}
// calorie, protein and sugar Entry tab function
let selectedRecipeId; // This will store the recipe id for which the date is being set
function openDatePicker(recipeLabelSanitized, calories, protein, sugar) {
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
  const dataElement = document.getElementById(`saveRecipe-${recipeLabelSanitized}`);
  const calories = dataElement.getAttribute('data-calories');
  const protein = dataElement.getAttribute('data-protein');
  const sugar = dataElement.getAttribute('data-sugar');
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
      calories: calories,
      protein: protein,
      sugar: sugar,
  };

  
  fetch(`${DEPLOY_URL}/api/nutritions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Ensure this is correctly set
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

//////////// nutritions tab
function fetchEntries() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  const url = `${DEPLOY_URL}/api/nutritions/${UserId}?startDate=${startDate}&endDate=${endDate}`;

  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Ensure this is correctly set
    }
  })
    .then(response => response.json())
    .then(data => {
      displayNutritionsData(data);
      openModal('nutritionsDataModal');
    })
    .catch(error => console.error('Failed to fetch entries:', error));
}
function displayNutritionsData(data) {
  const container = document.getElementById('nutritionsData');
  container.innerHTML = '';  // Clear previous data
if(data.length>0) {
  data.forEach(day => {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'nutrition-day';  // Add a class for styling

    const date = document.createElement('div');
    date.className = 'nutrition-date';
    date.textContent = `Date: ${day._id}`;
    dayDiv.appendChild(date);

    // Creating the calorie info with icon
    const calories = document.createElement('div');
    calories.className = 'nutrition-calories';
    calories.innerHTML = `<i class="fas fa-fire"></i> Total Calories: ${day.totalCalories} kcal`;  // Using 'fas fa-fire' for calories icon
    dayDiv.appendChild(calories);

    // Creating the protein info with icon
    const protein = document.createElement('div');
    protein.className = 'nutrition-protein';
    protein.innerHTML = `<i class="fas fa-dumbbell"></i> Total Protein: ${day.totalProtein} g`;  // Using 'fas fa-dumbbell' for protein icon
    dayDiv.appendChild(protein);

    // Creating the sugar info with icon
    const sugar = document.createElement('div');
    sugar.className = 'nutrition-sugar';
    sugar.innerHTML = `<i class="fas fa-candy-cane"></i> Total Sugar: ${day.totalSugar} g`;  // Using 'fas fa-candy-cane' for sugar icon
    dayDiv.appendChild(sugar);

    container.appendChild(dayDiv);
    });
  } else {
    const noData = document.createElement('div');
    noData.className = 'no-data';
    noData.textContent = 'You did not schedule any meals at this date or you did not slelect date';
    container.appendChild(noData);
  }
}
function fetchSumLast30Days() {
  const url = `${DEPLOY_URL}/api/nutritions/last30days/${UserId}`;

  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Ensure this is correctly set
    }
  })
    .then(response => response.json())
    .then(data => {
      displaySumLast30Days(data);
      openModal('last30DaysSumModal');
    })
    .catch(error => console.error('Failed to fetch sum of last 30 days:', error));
}
function displaySumLast30Days(data) {
  const container = document.getElementById('last30DaysSum');
  container.innerHTML = '';  // Clear previous data

  if (data.length > 0) {
    data.forEach(day => {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'sum-day';

      const date = document.createElement('div');
      date.className = 'sum-date';
      date.textContent = `Date: ${day._id}`;
      dayDiv.appendChild(date);

      const totalCalories = document.createElement('div');
      totalCalories.className = 'sum-calories';
      totalCalories.innerHTML = `<i class="fas fa-fire"></i> Total Calories: ${day.totalCalories} kcal`;

      const totalProtein = document.createElement('div');
      totalProtein.className = 'sum-protein';
      totalProtein.innerHTML = `<i class="fas fa-dumbbell"></i> Total Protein: ${day.totalProtein} g`;

      const totalSugar = document.createElement('div');
      totalSugar.className = 'sum-sugar';
      totalSugar.innerHTML = `<i class="fas fa-candy-cane"></i> Total Sugar: ${day.totalSugar} g`;

      dayDiv.appendChild(totalCalories);
      dayDiv.appendChild(totalProtein);
      dayDiv.appendChild(totalSugar);

      container.appendChild(dayDiv);
    });
  } else {
    const noData = document.createElement('div');
    noData.className = 'no-data';
    noData.textContent = 'You did not schedule any meals for the last 30 days';
    container.appendChild(noData);
  }
}
function deleteEntry(userId) {
  const url = `${DEPLOY_URL}/api/nutritions/${userId}`;

  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Ensure this is correctly set
    }
  })
    .then(response => {
      if (response.ok) {
        alert('Entry deleted successfully');
      } else {
        throw new Error('Failed to delete entry');
      }
    })
    .catch(error => console.error('Error deleting entry:', error));
}
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'block';
}
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'none';
}
// Close modals when clicking outside
window.onclick = function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  });
}

//////////// profile tab functions
function getAcooutInfo() {
  fetch(`${DEPLOY_URL}/api/users/getAccountInfo/${UserId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Ensure this is correctly set
    }
  })
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("accountInfoRows");
      tableBody.innerHTML = ""; // Clear existing rows
      data.accountInfos.forEach((accountInfo) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = accountInfo.userName;
        row.insertCell(1).textContent = accountInfo.email;
        row.insertCell(2).textContent = "******"

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
        password.type = "password";
        password.placeholder = "New Password"; 
        row.cells[2].innerHTML = "";
        row.cells[2].appendChild(password);
    
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "Confirm Update";
        confirmBtn.onclick = function () {
            if (checkNewInput(password.value,"password")) { 
                updateAccount(UserId, {
                    userName: userName.value,
                    email: email.value,
                    password: password.value,
                    admin: accountInfo.admin,
                });
            } else {
                alert("Password should be at least 8 characters long.");
            }
        };
        row.cells[3].innerHTML = ""; // Clear previous buttons
        row.cells[3].appendChild(confirmBtn);
      }
    

    
      function updateAccount(id, updatedData) {
        fetch(`${DEPLOY_URL}/api/users/uppdateAccount/${id}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // Ensure this is correctly set
          },
          body: JSON.stringify(updatedData),
        })
          .then((response) => {
            if (response.ok) {
              userName1 = updatedData.userName; // Assuming the API response includes the user's name
        sessionStorage.setItem('userName1', userName1);
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
function deleteAccount() {
  deleteEntry(UserId);
  deleteAllFavouriteRecipes(UserId);
  deleteAcount(UserId)
  logout();
}
function deleteAllFavouriteRecipes(UserId) {
  fetch(`${DEPLOY_URL}/api/favourites/deleteAllFavouriteRecipes/${UserId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Ensure this is correctly set
    }
  })
}
function logout() {
  fetch('/api/logout', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('UserId');
      window.location.href = 'login.html';
    })
    .catch(error => console.error('Error logging out:', error));
}

//////////// ingrediant tab functions
function fetchIngrediants() {
  const searchForm = document.querySelector('#ingredientForm');
  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const searchedIngredient = document.getElementById('ingredientInput').value;
    fetch(`${DEPLOY_URL}/api/ingredients/${searchedIngredient}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // Ensure this is correctly set
      }
    })
      .then(response => response.json())
      .then(data => {
        const tableBody = document.getElementById("ingredientInfoRows");
        tableBody.innerHTML = ""; // Clear existing rows
        data.ingredients.results.forEach(ingredient => {
          const row = tableBody.insertRow();
          row.insertCell(0).textContent = ingredient.id;
          row.insertCell(1).textContent = ingredient.name;

          const btn_getId = document.createElement("button");
          btn_getId.textContent = "Show details";
          btn_getId.onclick = function () {
            getIngredientIdAndShowDetails(ingredient.id); //
          };
          row.insertCell(2).appendChild(btn_getId);
        });
      })
      .catch(error => {
        console.error('Error fetching recipes:', error);
        alert('Failed to fetch recipes.');
      });
  })
}
function getIngredientIdAndShowDetails(ingredientId) {
  fetch(`${DEPLOY_URL}/api/ingredients/getIngredient/${ingredientId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {
      const nutritionInfo = document.getElementById("nutritionInfo");
      nutritionInfo.innerHTML = ""; // Clear previous nutrition data

      const nutrients = data.ingredient.nutrition.nutrients;
      nutrients.forEach(nutrient => {
        const p = document.createElement("p");
        p.textContent = `${nutrient.name}: ${nutrient.amount} ${nutrient.unit} (${nutrient.percentOfDailyNeeds}% daily need)`;
        nutritionInfo.appendChild(p);
      });

      // Show the modal
      const modal = document.getElementById("nutritionModal");
      modal.style.display = "block";

      // Get the <span> element that closes the modal
      const span = document.getElementsByClassName("close")[0];

      // When the user clicks on <span> (x), close the modal
      span.onclick = function () {
        modal.style.display = "none";
      };

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function (event) {
        if (event.target === modal) {
          modal.style.display = "none";
        }
      };
    })
    .catch(error => {
      console.error('Error fetching ingredient details:', error);
      alert('Failed to fetch ingredient details.');
    });
}

//////////// favourites tab functions
function getFavouriteRecipes() {
  fetch(`${DEPLOY_URL}/api/favourites/getAllFavouriteRecipes/${UserId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Ensure this is correctly set
    }
  })
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("favouriteRecipeRows");
      tableBody.innerHTML = ""; // Clear existing rows
      data.favouriteRecipes.forEach((favouriteRecipe) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = favouriteRecipe.recipe_name;
        row.insertCell(1).textContent = favouriteRecipe.calories + " kcal";

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
        deleteButton.className = "delete-button";
        deleteButton.onclick = function () {
          deleteRecipe(UserId, favouriteRecipe.recipe_name);
        };
        row.insertCell(3).appendChild(deleteButton);
      });
      function deleteRecipe(UserId, recipe_name) {
        const favouriteRecipeData = { user_id: UserId, recipe_name: recipe_name }; //preparing them to become a json 
        fetch(`${DEPLOY_URL}/api/favourites/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
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


/////////// ADMIN \\\\\\\\\\\
function deleteAcount(userid){
  
  fetch(`${DEPLOY_URL}/api/users/deleteUser/${userid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Ensure this is correctly set
    }
  }).then(
    alert("user deleted successfully"),
    // console.log(userInfo(userid))
  

  ).then( 
    adminDashBordSU()
  ).catch((error) => console.error("Error fetching deleting user:", error))
}
function adminDashBordSU() {
  
  fetch(`${DEPLOY_URL}/api/users/getUsers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Ensure this is correctly set
    }
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data)
      const adminTable = document.getElementById("accountInfoRows");
      adminTable.textContent = '';
      data.allUsers.forEach(user => {
      
        userInfoSetup(user);
        // console.log(user)
      })
    })
    .catch((error) => console.error("Error fetching account info:", error));
}
function userInfoSetup(userInfo) {

  const user = userInfo;
  // console.log(user,"userInfoSetup")
  const tableBody = document.getElementById("accountInfoRows");
  const adminTable = document.getElementById("AdminUserTable");

 
  const row = tableBody.insertRow();
  row.insertCell(0).textContent = user.userName;
  row.insertCell(1).textContent = user.email;
  row.insertCell(2).textContent = "******"
  const id = user._id;
  
    const btn_delete = document.createElement("button");
    btn_delete.textContent = "Delete";
    btn_delete.onclick = function () {
      deleteAcount(id); //
    };
    row.insertCell(3).appendChild(btn_delete);
    // adminTable.appendChild(row);
};

/////////// about tab functions
function About(){
  var featureBoxes = document.querySelectorAll(".clickable-feature-box");
     featureBoxes.forEach(function(box) {
        box.addEventListener("click", function() {
            var target = box.getAttribute("data-target");
            if (target) {
                window.location.href = target;
            }
        });
    });
}
