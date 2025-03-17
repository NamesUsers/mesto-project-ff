export function clearValidation(form) {
  const nameLengthError = form.querySelector('.name-length-error');
  const nameFormatError = form.querySelector('.name-format-error');
  const descriptionLengthError = form.querySelector('.description-length-error');
  const descriptionFormatError = form.querySelector('.description-format-error');
  const placeLengthError = form.querySelector('.place-length-error');
  const placeFormatError = form.querySelector('.place-format-error');
  const urlFormatError = form.querySelector('.url-format-error');

  if (nameLengthError) nameLengthError.textContent = '';
  if (nameFormatError) nameFormatError.textContent = '';
  if (descriptionLengthError) descriptionLengthError.textContent = '';
  if (descriptionFormatError) descriptionFormatError.textContent = '';
  if (placeLengthError) placeLengthError.textContent = '';
  if (placeFormatError) placeFormatError.textContent = '';
  if (urlFormatError) urlFormatError.textContent = '';
}

export function validateForm(form) {
  let isValid = true;
  clearValidation(form);

  const nameInput = form.querySelector('input[name="name"]');
  const descriptionInput = form.querySelector('input[name="description"]');
  const placeNameInput = form.querySelector('input[name="place-name"]');
  const linkInput = form.querySelector('input[name="link"]');

  if (nameInput) {
      isValid = updateNameErrors(form) && isValid;
  }

  if (descriptionInput) {
      isValid = updateDescriptionErrors(form) && isValid;
  }

  if (placeNameInput) {
      isValid = updatePlaceNameErrors(form) && isValid;
  }

  if (linkInput) {
      isValid = updateLinkErrors(form) && isValid;
  }

  return isValid;
}

export function updateNameErrors(form) {
  const nameInput = form.querySelector('input[name="name"]');
  if (!nameInput) return true; 

  const nameLengthError = form.querySelector('.name-length-error');
  const nameFormatError = form.querySelector('.name-format-error');

  if (nameInput.value.length === 0) {
      nameLengthError.textContent = nameInput.validationMessage;
      return false;
  } else if (nameInput.value.length < 2 || nameInput.value.length > 40) {
      nameLengthError.textContent = "Имя должно содержать от 2 до 40 символов.";
      return false;
  } else if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(nameInput.value)) {
      nameFormatError.textContent = "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы";
      return false;
  }

  return true;
}

export function updateDescriptionErrors(form) {
  const descriptionInput = form.querySelector('input[name="description"]');
  if (!descriptionInput) return true;

  const descriptionLengthError = form.querySelector('.description-length-error');
  const descriptionFormatError = form.querySelector('.description-format-error');

  if (descriptionInput.value.length === 0) {
      descriptionLengthError.textContent = descriptionInput.validationMessage;
      return false;
  } else if (descriptionInput.value.length < 2 || descriptionInput.value.length > 200) {
      descriptionLengthError.textContent = "Описание должно содержать от 2 до 200 символов.";
      return false;
  } else if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(descriptionInput.value)) {
      descriptionFormatError.textContent = "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы";
      return false;
  }

  return true;
}

export function updatePlaceNameErrors(form) {
  const placeNameInput = form.querySelector('input[name="place-name"]');
  if (!placeNameInput) return true;

  const placeLengthError = form.querySelector('.place-length-error');
  const placeFormatError = form.querySelector('.place-format-error');

  if (placeNameInput.value.length === 0) {
      placeLengthError.textContent = placeNameInput.validationMessage;
      return false;
  } else if (placeNameInput.value.length < 2 || placeNameInput.value.length > 30) {
      placeLengthError.textContent = "Название места должно содержать от 2 до 30 символов";
      return false;
  } else if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(placeNameInput.value)) {
      placeFormatError.textContent = "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы";
      return false;
  }

  return true;
}

export function updateLinkErrors(form) {
  const linkInput = form.querySelector('input[name="link"]');
  if (!linkInput) return true; 

  const urlFormatError = form.querySelector('.url-format-error');

  if (linkInput.value.length === 0) {
      urlFormatError.textContent = linkInput.validationMessage;
      return false;
  } else if (!/^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/\S*)?$/i.test(linkInput.value)) {
      urlFormatError.textContent = "Введите корректный URL.";
      return false;
  }

  return true;
}