document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('.login-form');
    const signupForm = document.querySelector('.signup-form');
    const showSignup = document.getElementById('showSignup');
  
    showSignup.addEventListener('click', function (e) {
      e.preventDefault();
      loginForm.style.display = 'none'; 
      signupForm.style.display = 'block'; 
    });
  
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      
      alert(`Logging in with username: ${username} and password: ${password}`);
    });
  
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const newUsername = document.getElementById('newUsername').value;
      const newPassword = document.getElementById('newPassword').value;
  
      
      alert(`Creating account with username: ${newUsername} and password: ${newPassword}`);
    });
  });
