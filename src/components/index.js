import { createCard } from './card.js';
import { openPopup, closePopup } from './modal.js';
import { enableValidation, clearValidation, validateForm, toggleInputError } from './validation.js';
import {
  getUserData,
  getInitialCards,
  updateUserData,
  updateAvatar,
  addNewCard,
  deleteCard,
  likeCard,
  unlikeCard
} from './api.js';

const placeList = document.querySelector('.places__list');
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const profileImage = document.querySelector('.profile__image');
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const popupCloseButtons = document.querySelectorAll('.popup__close');
const editProfileForm = document.querySelector('.popup_type_edit .popup__form');
const addCardForm = document.querySelector('.popup_type_new-card .popup__form');
const editAvatarForm = document.querySelector('.popup_type_edit-avatar .popup__form');
const editProfilePopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const editAvatarPopup = document.querySelector('.popup_type_edit-avatar');
const imagePopup = document.querySelector('.popup_type_image');
const confirmDeletePopup = document.querySelector('.popup_type_confirm-delete');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');
const avatarInput = editAvatarForm.querySelector('input[name="avatar"]');

let currentUserId = null;

function renderLoading(button, isLoading, defaultText = 'Сохранить') {
  if (isLoading) {
    button.textContent = 'Сохранение...';
    button.disabled = true;
  } else {
    button.textContent = defaultText;
    button.disabled = false;
  }
}

function openImagePopup(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openPopup(imagePopup);
}

profileImage.addEventListener('click', () => {
  clearValidation(editAvatarForm, validationConfig);
  toggleSubmitButton(editAvatarForm);
  openPopup(editAvatarPopup);
});

editAvatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const submitButton = editAvatarForm.querySelector(validationConfig.submitButtonSelector);
  renderLoading(submitButton, true);

  const avatarUrl = avatarInput.value;

  updateAvatar(avatarUrl)
    .then(data => {
      profileImage.style.backgroundImage = `url(${data.avatar})`;
      closePopup(editAvatarPopup);
    })
    .catch(err => {
      console.error('Ошибка при обновлении аватара:', err);
    })
    .finally(() => {
      renderLoading(submitButton, false);
    });
});

function toggleSubmitButton(form) {
  const submitButton = form.querySelector(validationConfig.submitButtonSelector);
  const isValid = Array.from(form.querySelectorAll(validationConfig.inputSelector)).every(input => input.validity.valid);
  
  if (isValid) {
    submitButton.classList.remove(validationConfig.inactiveButtonClass);
    submitButton.disabled = false;
  } else {
    submitButton.classList.add(validationConfig.inactiveButtonClass);
    submitButton.disabled = true;
  }
}

getUserData()
  .then(userData => {
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    currentUserId = userData._id;
    if (userData.avatar) {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
    }
  })
  .catch(err => {
    console.error('Ошибка при загрузке данных пользователя:', err);
  });

getInitialCards()
  .then(cardsData => {
    cardsData.forEach((card) => {
      const newCardElement = createCard(card, openImagePopup, currentUserId, handleDeleteCard);
      placeList.append(newCardElement);
    });
  })
  .catch(err => {
    console.error('Ошибка при загрузке данных карточек:', err);
  });

function handleDeleteCard(cardId, cardElement) {
  openPopup(confirmDeletePopup);

  const confirmDeleteForm = confirmDeletePopup.querySelector('.popup__form');
  const submitButton = confirmDeleteForm.querySelector('.popup__button');
  submitButton.focus();
  confirmDeleteForm.onsubmit = (evt) => {
    evt.preventDefault();
    deleteCard(cardId)
      .then(() => {
        cardElement.remove();
        closePopup(confirmDeletePopup);
      })
      .catch(err => {
        console.error('Ошибка при удалении карточки:', err);
      });
  };
}

function fillEditProfileForm() {
  const nameInput = editProfilePopup.querySelector('input[name="name"]');
  const descriptionInput = editProfilePopup.querySelector('input[name="description"]');

  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
}

editButton.addEventListener('click', () => {
  fillEditProfileForm();
  clearValidation(editProfileForm, validationConfig);
  toggleSubmitButton(editProfileForm);
  openPopup(editProfilePopup);
});

editProfileForm.addEventListener('input', () => {
  toggleSubmitButton(editProfileForm);
  toggleInputError(editProfileForm, editProfileForm.querySelector('input[name="name"]'), validationConfig.inputErrorClass, validationConfig.errorClass);
  toggleInputError(editProfileForm, editProfileForm.querySelector('input[name="description"]'), validationConfig.inputErrorClass, validationConfig.errorClass);
});

editProfileForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const submitButton = editProfileForm.querySelector(validationConfig.submitButtonSelector);
  renderLoading(submitButton, true);

  const nameInput = editProfilePopup.querySelector('input[name="name"]');
  const descriptionInput = editProfilePopup.querySelector('input[name="description"]');

  const newName = nameInput.value;
  const newAbout = descriptionInput.value;

  updateUserData(newName, newAbout)
    .then(data => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closePopup(editProfilePopup);
    })
    .catch((err) => {
      console.error('Ошибка при обновлении данных пользователя:', err);
    })
    .finally(() => {
      renderLoading(submitButton, false);
    });
});

function initializeForm(form) {
  const formFields = form.querySelectorAll('.popup__input');
  formFields.forEach((field) => {
    field.classList.remove('popup__input_type_error');
  });

  const errorElements = form.querySelectorAll('.error-message');
  errorElements.forEach((error) => {
    error.textContent = '';
  });
}

addButton.addEventListener('click', () => {
  initializeForm(addCardForm);
  clearValidation(addCardForm, validationConfig);
  toggleSubmitButton(addCardForm);
  openPopup(addCardPopup);
});

addCardForm.addEventListener('input', (evt) => {
  const inputField = evt.target;
  const form = inputField.closest('.popup__form');

  toggleSubmitButton(form);
  toggleInputError(form, inputField, validationConfig.inputErrorClass, validationConfig.errorClass);
});

addCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const submitButton = addCardForm.querySelector(validationConfig.submitButtonSelector);
  renderLoading(submitButton, true);

  if (validateForm(addCardForm)) {
    const nameImageInput = addCardPopup.querySelector('input[name="place-name"]');
    const imageInput = addCardPopup.querySelector('input[name="link"]');

    const newCardData = {
      name: nameImageInput.value,
      link: imageInput.value
    };

    addNewCard(newCardData.name, newCardData.link)
      .then(cardData => {
        const newCardElement = createCard(cardData, openImagePopup, currentUserId, handleDeleteCard);
        placeList.prepend(newCardElement);

        addCardForm.reset();
        toggleSubmitButton(addCardForm);
        closePopup(addCardPopup);
      })
      .catch(err => {
        console.error('Ошибка при добавлении карточки:', err);
      })
      .finally(() => {
        renderLoading(submitButton, false);
      });
  }
});

popupCloseButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const popup = button.closest('.popup');
    const form = popup.querySelector('.popup__form');
    if (form) {
      clearValidation(form, validationConfig);
      form.reset();
      toggleSubmitButton(form);
    }
    
    closePopup(popup);
  });
});

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'error-message_visible'
};

enableValidation(validationConfig);
