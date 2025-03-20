export function enableValidation({
    formSelector,
    inputSelector,
    submitButtonSelector,
    inactiveButtonClass,
    inputErrorClass,
    errorClass
  }) {
    const forms = Array.from(document.querySelectorAll(formSelector));
  
    forms.forEach((form) => {
      form.addEventListener('submit', (evt) => {
        evt.preventDefault(); 
      });
  
      const inputs = Array.from(form.querySelectorAll(inputSelector));
      const submitButton = form.querySelector(submitButtonSelector);
  
      inputs.forEach((input) => {
        input.addEventListener('input', () => {
          input.setCustomValidity(''); 
          validateInput(form, input); 
          toggleInputError(form, input, inputErrorClass, errorClass);
          toggleSubmitButton(form, submitButton, inactiveButtonClass);
        });
  
        input.addEventListener('blur', () => {
          validateInput(form, input);
          toggleInputError(form, input, inputErrorClass, errorClass);
          toggleSubmitButton(form, submitButton, inactiveButtonClass);
        });
      });
  
      
      toggleSubmitButton(form, submitButton, inactiveButtonClass);
    });
  }
  
  export function toggleSubmitButton(form, submitButton, inactiveButtonClass) {
    const inputs = Array.from(form.querySelectorAll('.popup__input'));
    const isFormValid = inputs.every(input => input.validity.valid);
  
    if (isFormValid) {
      submitButton.classList.remove(inactiveButtonClass);
      submitButton.disabled = false;
    } else {
      submitButton.classList.add(inactiveButtonClass);
      submitButton.disabled = true;
    }
  }
  
  export function toggleInputError(form, input, inputErrorClass, errorClass) {
    if (!input.validity.valid) {
      showInputError(form, input, inputErrorClass, errorClass);
    } else {
      hideInputError(form, input, inputErrorClass, errorClass);
    }
  }
  
  function showInputError(form, input, inputErrorClass, errorClass) {
    input.classList.add(inputErrorClass); 
    const errorElement = form.querySelector(`.${input.name}-error`);
  
    if (errorElement) {
      errorElement.classList.add(errorClass);
      errorElement.textContent = getCustomErrorMessage(input); 
    }
  }
  
  function hideInputError(form, input, inputErrorClass, errorClass) {
    input.classList.remove(inputErrorClass);
    const errorElement = form.querySelector(`.${input.name}-error`);
    if (errorElement) {
      errorElement.classList.remove(errorClass);
      errorElement.textContent = ''; 
    }
  }
  
  function getCustomErrorMessage(input) {
    // Сначала проверяем, пустое ли поле
    if (input.validity.valueMissing) {
      return input.validationMessage;
    }
  
    // Затем проверяем длину
    if (input.validity.tooShort || input.validity.tooLong) {
      return `Длина должна быть от ${input.minLength} до ${input.maxLength} символов.`;
    }
  
    
    if (input.name === 'link') {
      if (input.validity.typeMismatch) {
        return 'Введите корректный URL.';
      }
    }
  
    // Для остальных полей проверяем регулярные выражения
    if (input.name === 'name' || input.name === 'place-name' || input.name === 'description') {
      const isValidPattern = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(input.value);
      if (!isValidPattern) {
        return 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы.';
      }
    }
  
    
    return '';
  }
  
  export function validateInput(form, input) {
    if (input.name === 'name' || input.name === 'place-name') {
      return validateNameInput(input);
    } else if (input.name === 'description') {
      return validateDescriptionInput(input);
    } else if (input.name === 'link') {
      return validateLinkInput(input);
    }
    return input.validity.valid;
  }
  
  function validateNameInput(input) {
    const isValidLength = input.value.length >= 2 && input.value.length <= 40;
    const isValidPattern = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(input.value);
  
    
    if (input.validity.valueMissing) {
      input.setCustomValidity(input.validationMessage); 
    } else if (!isValidLength) {
      input.setCustomValidity(`Длина должна быть от ${input.minLength} до ${input.maxLength} символов.`);
    } else if (!isValidPattern) {
      input.setCustomValidity('Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы.');
    } else {
      input.setCustomValidity(''); 
    }
  
    
    return input.validity.valid && isValidLength && isValidPattern;
  }
  
  function validateDescriptionInput(input) {
    const isValidLength = input.value.length >= 2 && input.value.length <= 200;
    const isValidPattern = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(input.value);
  
    
    if (input.validity.valueMissing) {
      input.setCustomValidity(input.validationMessage); 
    } else if (!isValidLength) {
      input.setCustomValidity(`Длина должна быть от ${input.minLength} до ${input.maxLength} символов.`);
    } else if (!isValidPattern) {
      input.setCustomValidity('Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы.');
    } else {
      input.setCustomValidity(''); 
    }
  
    return input.validity.valid && isValidLength && isValidPattern;
  }
  
  function validateLinkInput(input) {
    const isValid = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/\S*)?$/i.test(input.value);
  
    
    if (input.validity.valueMissing) {
      input.setCustomValidity(input.validationMessage); 
    } else if (!isValid) {
      input.setCustomValidity('Введите корректный URL.');
    } else {
      input.setCustomValidity(''); 
    }
  
    return input.validity.valid && isValid;
  }
  
  export function clearValidation(form, validationConfig) {
    if (validationConfig && validationConfig.inputErrorClass && validationConfig.errorClass) {
      const { inputErrorClass, errorClass } = validationConfig;
      const formFields = Array.from(form.querySelectorAll('.popup__input'));
      formFields.forEach((field) => {
        field.classList.remove(inputErrorClass);
      });
  
      const errorElements = Array.from(form.querySelectorAll(`.${errorClass}`));
      errorElements.forEach((error) => {
        error.textContent = '';
      });
    }
  }
  
  export function validateForm(form) {
    let isValid = true;
    const inputs = Array.from(form.querySelectorAll('.popup__input'));
  
    inputs.forEach((input) => {
      if (!validateInput(form, input)) {
        isValid = false;
      }
    });
  
    return isValid;
  }