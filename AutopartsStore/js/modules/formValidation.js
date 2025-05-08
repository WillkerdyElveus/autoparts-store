export function setupFormValidation() {
    const form = document.getElementById('registrationForm');
    if (!form) return;
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm()) {
        saveAccount();
        alert('Account created successfully!');
        form.reset();
      }
    });
  
    // Add real-time validation
    document.getElementById('email').addEventListener('blur', validateEmail);
    document.getElementById('password').addEventListener('input', validatePassword);
    document.getElementById('confirmPassword').addEventListener('blur', validateConfirmPassword);
  }
  
  function validateForm() {
    return validateEmail() && 
           validatePassword() && 
           validateConfirmPassword() &&
           validatePostalCode();
  }
  
  function validateEmail() {
    const email = document.getElementById('email');
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email.value)) {
      alert('Please enter a valid email address');
      email.focus();
      return false;
    }
    return true;
  }
  
  function validatePassword() {
    const password = document.getElementById('password');
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!re.test(password.value)) {
      alert('Password must contain at least 8 characters, including one uppercase, one lowercase, and one number');
      password.focus();
      return false;
    }
    return true;
  }
  
  //TODO Password doesnt work yet
  /*function validateConfirmPassword() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    if (password.value !== confirmPassword.value) {
      alert('Passwords do not match');
      confirmPassword.focus();
      return false;
    }
    return true;
  }*/

    function validateConfirmPassword() {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const errorElement = document.getElementById('passwordError');
      
        // Clear any previous error states
        confirmPassword.classList.remove('is-invalid');
        errorElement.style.display = 'none';
      
        if (password.value !== confirmPassword.value) {
          // Show error message
          confirmPassword.classList.add('is-invalid');
          errorElement.style.display = 'block';
          confirmPassword.focus();
          return false;
        }
      
        return true;
      }
  
  function validatePostalCode() {
    const postalCode = document.getElementById('postalCode');
    const re = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    if (!re.test(postalCode.value)) {
      alert('Please enter a valid Canadian postal code (A1A 1A1)');
      postalCode.focus();
      return false;
    }
    return true;
  }
  
  function saveAccount() {
    const formData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      postalCode: document.getElementById('postalCode').value
    };
    
    localStorage.setItem('userAccount', JSON.stringify(formData));
  }