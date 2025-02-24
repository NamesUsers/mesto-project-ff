import { loadCards, createCard, deleteCard, likeCard, handleImageClick } from './card.js';
import { openPopup, closePopup, openImagePopup } from './modal.js';

loadCards(openImagePopup);

const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const popupCloseButtons = document.querySelectorAll('.popup__close');
const editProfileForm = document.querySelector('.popup_type_edit .popup__form');
const addCardForm = document.querySelector('.popup_type_new-card .popup__form');

function fillEditProfileForm() {
  const editProfilePopup = document.querySelector('.popup_type_edit');
  const nameInput = editProfilePopup.querySelector('input[name="name"]');
  const descriptionInput = editProfilePopup.querySelector('input[name="description"]');

  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
}

editButton.addEventListener('click', () => {
  fillEditProfileForm();
  const editProfilePopup = document.querySelector('.popup_type_edit');
  openPopup(editProfilePopup);
});

editProfileForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const editProfilePopup = document.querySelector('.popup_type_edit');
  const nameInput = editProfilePopup.querySelector('input[name="name"]');
  const descriptionInput = editProfilePopup.querySelector('input[name="description"]');

  profileName.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;

  closePopup(editProfilePopup);
});

addCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const addCardPopup = document.querySelector('.popup_type_new-card');
  const nameImageInput = addCardPopup.querySelector('input[name="place-name"]');
  const imageInput = addCardPopup.querySelector('input[name="link"]');

  const newCardData = {
    name: nameImageInput.value,
    link: imageInput.value
  };

  const placeList = document.querySelector('.places__list');
  const newCardElement = createCard(newCardData, deleteCard, likeCard, (data) => handleImageClick(data, openImagePopup));
  placeList.prepend(newCardElement);

  addCardForm.reset();
  closePopup(addCardPopup);
});

addButton.addEventListener('click', () => {
  const addCardPopup = document.querySelector('.popup_type_new-card');
  openPopup(addCardPopup);
});

popupCloseButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const popup = button.closest('.popup');
    closePopup(popup);
  });
});