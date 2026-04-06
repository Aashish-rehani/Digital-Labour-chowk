// Email validation
const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

// Phone number validation (basic)
const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone.replace(/\D/g, ""));
};

// Password validation (min 6 characters)
const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Name validation
const validateName = (name) => {
  return name && name.trim().length >= 2;
};

// Validate required fields
const validateRequiredFields = (fields) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      return { valid: false, field: key };
    }
  }
  return { valid: true };
};

// Validate user registration input
const validateUserRegistration = (data) => {
  const { name, email, phone, password } = data;

  if (!validateName(name)) {
    return { valid: false, message: "Invalid name" };
  }
  if (!validateEmail(email)) {
    return { valid: false, message: "Invalid email" };
  }
  if (!validatePhone(phone)) {
    return { valid: false, message: "Invalid phone number" };
  }
  if (!validatePassword(password)) {
    return { valid: false, message: "Password must be at least 6 characters" };
  }

  return { valid: true };
};

// Validate worker registration input
const validateWorkerRegistration = (data) => {
  const { name, email, phone, password, skill, location } = data;

  if (!validateName(name)) {
    return { valid: false, message: "Invalid name" };
  }
  if (!validateEmail(email)) {
    return { valid: false, message: "Invalid email" };
  }
  if (!validatePhone(phone)) {
    return { valid: false, message: "Invalid phone number" };
  }
  if (!validatePassword(password)) {
    return { valid: false, message: "Password must be at least 6 characters" };
  }
  if (!skill || !skill.trim()) {
    return { valid: false, message: "Skill is required" };
  }
  if (!location || !location.trim()) {
    return { valid: false, message: "Location is required" };
  }

  return { valid: true };
};

// Validate job request input
const validateJobRequest = (data) => {
  const { title, description, location, skill, wage } = data;

  if (!title || !title.trim()) {
    return { valid: false, message: "Job title is required" };
  }
  if (!description || !description.trim()) {
    return { valid: false, message: "Job description is required" };
  }
  if (!location || !location.trim()) {
    return { valid: false, message: "Location is required" };
  }
  if (!skill || !skill.trim()) {
    return { valid: false, message: "Skill requirement is required" };
  }
  if (!wage || wage <= 0) {
    return { valid: false, message: "Wage must be greater than 0" };
  }

  return { valid: true };
};

module.exports = {
  validateEmail,
  validatePhone,
  validatePassword,
  validateName,
  validateRequiredFields,
  validateUserRegistration,
  validateWorkerRegistration,
  validateJobRequest,
};
