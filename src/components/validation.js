export const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'error-message_visible'
};

export function enableValidation(config) {
  const forms = Array.from(document.querySelectorAll(config.formSelector));

  forms.forEach((form) => {
    form.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });

    const inputs = Array.from(form.querySelectorAll(config.inputSelector));
    const submitButton = form.querySelector(config.submitButtonSelector);

    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        input.setCustomValidity('');
        validateInput(input);
        toggleInputError(form, input, config.inputErrorClass, config.errorClass);
        toggleSubmitButton(form, submitButton, config.inactiveButtonClass, config.inputSelector);
      });

      input.addEventListener('blur', () => {
        validateInput(input);
        toggleInputError(form, input, config.inputErrorClass, config.errorClass);
        toggleSubmitButton(form, submitButton, config.inactiveButtonClass, config.inputSelector);
      });
    });

    toggleSubmitButton(form, submitButton, config.inactiveButtonClass, config.inputSelector);
  });
}

export function toggleSubmitButton(form, submitButton, inactiveButtonClass, inputSelector) {
  const inputs = Array.from(form.querySelectorAll(inputSelector));
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
    errorElement.textContent = input.validationMessage;
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

export function validateInput(input) {
  if (input.validity.valueMissing) {
    input.setCustomValidity(input.validationMessage);
  } else if (input.validity.tooShort || input.validity.tooLong) {
    input.setCustomValidity(`Длина должна быть от ${input.minLength} до ${input.maxLength} символов.`);
  } else if (input.validity.typeMismatch) {
    input.setCustomValidity('Введите корректный URL.');
  } else if (input.validity.patternMismatch || !validatePattern(input)) {
    input.setCustomValidity('Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы.');
  } else {
    input.setCustomValidity('');
  }

  return input.validity.valid;
}

function validatePattern(input) {
  const patterns = {
    'name': /^[a-zA-Zа-яА-ЯёЁ\s-]+$/,
    'description': /^[a-zA-Zа-яА-ЯёЁ\s-]+$/,
    'place-name': /^[a-zA-Zа-яА-ЯёЁ\s-]+$/
  };

  const pattern = patterns[input.name];
  if (pattern) {
    return pattern.test(input.value);
  }

  return true;
}

export function clearValidation(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));

  inputs.forEach((input) => {
    hideInputError(form, input, config.inputErrorClass, config.errorClass);
    input.setCustomValidity('');
  });

  const submitButton = form.querySelector(config.submitButtonSelector);
  toggleSubmitButton(form, submitButton, config.inactiveButtonClass, config.inputSelector);
}