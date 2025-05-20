export function setupFormValidation() {
  const form = document.getElementById("registrationForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateForm()) {
      saveAccount();
      // Give feedback
      const msgEl = document.getElementById("accountFeedbackMessage");
      msgEl.textContent = `Account Created Successfully`;
      // Show feedback modal
      const cartModal = new bootstrap.Modal(
        document.getElementById("accountFeedbackModal")
      );
      cartModal.show();
      form.reset();
    }
  });

  //Maybe Added later
  // Add real-time validation
  /*document.getElementById('email').addEventListener('blur', validateEmail);
    document.getElementById('password').addEventListener('input', validatePassword);
    document.getElementById('confirmPassword').addEventListener('blur', validateConfirmPassword);
    document.getElementById('phone').addEventListener(validatePhoneNumber);*/
}

function validateForm() {
  return (
    validateFirstName() &&
    validateLastName() &&
    validateEmail() &&
    validatePassword() &&
    validateConfirmPassword() &&
    validatePostalCode() &&
    validatePhoneNumber()
  );
}

function validateFirstName() {
  const firstName = document.getElementById("firstName");
  const re = /^[a-zA-Z]{2,}$/;
  if (!re.test(firstName.value.trim())) {
    alert("First name must be at least 2 letters and contain only alphabets");
    firstName.focus();
    return false;
  }
  return true;
}

function validateLastName() {
  const lastName = document.getElementById("lastName");
  const re = /^[a-zA-Z]{2,}$/;
  if (!re.test(lastName.value.trim())) {
    alert("Last name must be at least 2 letters and contain only alphabets");
    lastName.focus();
    return false;
  }
  return true;
}

function validatePhoneNumber() {
  const phone = document.getElementById("phone");
  const regExPhone =
    /^(\+\d{1,2}\s?)?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/;
  if (!regExPhone.test(phone.value.trim())) {
    alert("Please enter a valid phone number (e.g., 123-456-7890)");
    phone.focus();
    return false;
  }
  return true;
}

function validateEmail() {
  const email = document.getElementById("email");
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.value.trim())) {
    alert("Please enter a valid email address (e.g., user@example.com)");
    email.focus();
    return false;
  }
  return true;
}

function validatePassword() {
  const password = document.getElementById("password");
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (!re.test(password.value)) {
    alert(
      "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number"
    );
    password.focus();
    return false;
  }
  return true;
}

function validateConfirmPassword() {
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match");
    confirmPassword.focus();
    return false;
  }
  return true;
}

function validatePostalCode() {
  const postalCode = document.getElementById("postalCode");
  const re = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
  if (!re.test(postalCode.value.trim())) {
    alert("Please enter a valid Canadian postal code (e.g., A1A 1A1)");
    postalCode.focus();
    return false;
  }
  return true;
}

function saveAccount() {
  const formData = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    postalCode: document.getElementById("postalCode").value,
  };

  localStorage.setItem("userAccount", JSON.stringify(formData));
}
