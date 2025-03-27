import { createCard, likeCard } from './card.js';
import { openPopup, closePopup } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';
import {
  getUserData,
  getInitialCards,
  updateUserData,
  updateAvatar,
  addNewCard,
  deleteCard
} from './api.js';

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'error-message_visible'
};

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
const confirmDeleteForm = confirmDeletePopup.querySelector('.popup__form');
const confirmDeleteButton = confirmDeletePopup.querySelector('.popup__button');

let currentUserId = null;
let cardToDelete = null;

function openImagePopup(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openPopup(imagePopup);
}

Promise.all([getUserData(), getInitialCards()])
  .then(([userData, cardsData]) => {
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    currentUserId = userData._id;
    if (userData.avatar) {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
    }
    cardsData.forEach((card) => {
      const newCardElement = createCard(card, openImagePopup, currentUserId, handleDeleteCard, likeCard);
      placeList.append(newCardElement);
    });
  })
  .catch(err => {
    console.error('Ошибка при загрузке данных:', err);
  });

function handleDeleteCard(cardId, cardElement) {
  cardToDelete = { cardId, cardElement };
  openPopup(confirmDeletePopup);
  confirmDeleteButton.focus();
}

confirmDeleteForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  if (!cardToDelete) return;

  deleteCard(cardToDelete.cardId)
    .then(() => {
      cardToDelete.cardElement.remove();
      cardToDelete = null;
      closePopup(confirmDeletePopup);
    })
    .catch(err => {
      console.error('Ошибка при удалении карточки:', err);
    });
});

editButton.addEventListener('click', () => {
  const nameInput = editProfilePopup.querySelector('input[name="name"]');
  const descriptionInput = editProfilePopup.querySelector('input[name="description"]');
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
  clearValidation(editProfileForm, validationConfig);
  openPopup(editProfilePopup);
});

editProfileForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = editProfileForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';

  const nameInput = editProfilePopup.querySelector('input[name="name"]');
  const descriptionInput = editProfilePopup.querySelector('input[name="description"]');

  updateUserData(nameInput.value, descriptionInput.value)
    .then(data => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closePopup(editProfilePopup);
    })
    .catch(err => {
      console.error('Ошибка при обновлении данных пользователя:', err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
});

addButton.addEventListener('click', () => {
  addCardForm.reset();
  clearValidation(addCardForm, validationConfig);
  openPopup(addCardPopup);
});

addCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = addCardForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';

  const nameInput = addCardPopup.querySelector('input[name="place-name"]');
  const imageInput = addCardPopup.querySelector('input[name="link"]');

  addNewCard(nameInput.value, imageInput.value)
    .then(cardData => {
      const newCardElement = createCard(cardData, openImagePopup, currentUserId, handleDeleteCard, likeCard);
      placeList.prepend(newCardElement);
      addCardForm.reset();
      closePopup(addCardPopup);
    })
    .catch(err => {
      console.error('Ошибка при добавлении карточки:', err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
});

profileImage.addEventListener('click', () => {
  editAvatarForm.reset();
  clearValidation(editAvatarForm, validationConfig);
  openPopup(editAvatarPopup);
});

editAvatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = editAvatarForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';

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
      submitButton.textContent = originalText;
    });
});

popupCloseButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const popup = button.closest('.popup');
    closePopup(popup);
  });
});

enableValidation(validationConfig);
