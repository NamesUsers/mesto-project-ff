
export function enableValidation(config) {
  const forms = Array.from(document.querySelectorAll(config.formSelector));

  forms.forEach((form) => {
    const inputs = Array.from(form.querySelectorAll(config.inputSelector));
    const submitButton = form.querySelector(config.submitButtonSelector);

    form.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });

    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        validateInput(input);
        toggleInputError(form, input, config);
        toggleSubmitButton(form, submitButton, config);
      });
    });

    toggleSubmitButton(form, submitButton, config);
  });
}

export function validateInput(input) {
  const patternError = input.dataset.errorMessage;

  if (input.validity.patternMismatch && patternError) {
    input.setCustomValidity(patternError);
  } else {
    input.setCustomValidity('');
  }

  return input.validity.valid;
}

function toggleInputError(form, input, config) {
  if (!input.validity.valid) {
    showInputError(form, input, config);
  } else {
    hideInputError(form, input, config);
  }
}

function showInputError(form, input, config) {
  input.classList.add(config.inputErrorClass);
  const errorElement = form.querySelector(`.${input.name}-error`);

  if (errorElement) {
    errorElement.textContent = input.validationMessage;
    errorElement.classList.add(config.errorClass);
  }
}

function hideInputError(form, input, config) {
  input.classList.remove(config.inputErrorClass);
  const errorElement = form.querySelector(`.${input.name}-error`);

  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove(config.errorClass);
  }
}

export function toggleSubmitButton(form, submitButton, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const isValid = inputs.every(input => input.validity.valid);

  submitButton.disabled = !isValid;
  submitButton.classList.toggle(config.inactiveButtonClass, !isValid);
}

export function clearValidation(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const submitButton = form.querySelector(config.submitButtonSelector);

  inputs.forEach((input) => {
    input.setCustomValidity('');
    hideInputError(form, input, config);
  });

  toggleSubmitButton(form, submitButton, config);
}
