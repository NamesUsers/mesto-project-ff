import { createCard, likeCard } from './card.js';
import { openPopup, closePopup } from './modal.js';
import { enableValidation, clearValidation, validationConfig } from './validation.js';
import {
  getUserData,
  getInitialCards,
  updateUserData,
  updateAvatar,
  addNewCard,
  deleteCard
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
  openPopup(confirmDeletePopup);

  const confirmDeleteForm = confirmDeletePopup.querySelector('.popup__form');
  const confirmDeleteButton = confirmDeletePopup.querySelector('.popup__button');
  confirmDeleteButton.focus();

  confirmDeleteForm.removeEventListener('submit', handleConfirmDelete);
  confirmDeleteForm.addEventListener('submit', handleConfirmDelete);

  function handleConfirmDelete(evt) {
    evt.preventDefault();

    deleteCard(cardId)
      .then(() => {
        cardElement.remove();
        closePopup(confirmDeletePopup);
      })
      .catch(err => {
        console.error('Ошибка при удалении карточки:', err);
      });
  }
}

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
    });
});

addButton.addEventListener('click', () => {
  addCardForm.reset();
  clearValidation(addCardForm, validationConfig);
  openPopup(addCardPopup);
});

addCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

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
    });
});

profileImage.addEventListener('click', () => {
  editAvatarForm.reset();
  clearValidation(editAvatarForm, validationConfig);
  openPopup(editAvatarPopup);
});

editAvatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const avatarUrl = avatarInput.value;

  updateAvatar(avatarUrl)
    .then(data => {
      profileImage.style.backgroundImage = `url(${data.avatar})`;
      closePopup(editAvatarPopup);
    })
    .catch(err => {
      console.error('Ошибка при обновлении аватара:', err);
    });
});

popupCloseButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const popup = button.closest('.popup');
    const form = popup.querySelector('.popup__form');
    if (form) {
      form.reset();
      clearValidation(form, validationConfig);
    }
    closePopup(popup);
  });
});

enableValidation(validationConfig);