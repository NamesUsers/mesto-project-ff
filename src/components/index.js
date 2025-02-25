import { createCard, deleteCard, likeCard } from './card.js';
import { openPopup, closePopup } from './modal.js';
import { initialCards } from '../cards.js';

const placeList = document.querySelector('.places__list');
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const popupCloseButtons = document.querySelectorAll('.popup__close');
const editProfileForm = document.querySelector('.popup_type_edit .popup__form');
const addCardForm = document.querySelector('.popup_type_new-card .popup__form');
const editProfilePopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

function loadCards(openImagePopup) {
    initialCards.forEach((card) => {
        const cardElement = createCard(card, openImagePopup);
        placeList.append(cardElement);
    });
}

function openImagePopup(cardData) {
    popupImage.src = cardData.link;
    popupImage.alt = cardData.name;
    popupCaption.textContent = cardData.name;

    openPopup(imagePopup);
}

loadCards(openImagePopup);

function fillEditProfileForm() {
    const nameInput = editProfilePopup.querySelector('input[name="name"]');
    const descriptionInput = editProfilePopup.querySelector('input[name="description"]');

    nameInput.value = profileName.textContent;
    descriptionInput.value = profileDescription.textContent;
}

editButton.addEventListener('click', () => {
    fillEditProfileForm();
    openPopup(editProfilePopup);
});

editProfileForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const nameInput = editProfilePopup.querySelector('input[name="name"]');
    const descriptionInput = editProfilePopup.querySelector('input[name="description"]');

    profileName.textContent = nameInput.value;
    profileDescription.textContent = descriptionInput.value;

    closePopup(editProfilePopup);
});

addCardForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const nameImageInput = addCardPopup.querySelector('input[name="place-name"]');
    const imageInput = addCardPopup.querySelector('input[name="link"]');

    const newCardData = {
        name: nameImageInput.value,
        link: imageInput.value
    };

    const newCardElement = createCard(newCardData, openImagePopup);
    placeList.prepend(newCardElement);

    addCardForm.reset();
    closePopup(addCardPopup);
});

addButton.addEventListener('click', () => {
    openPopup(addCardPopup);
});

popupCloseButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const popup = button.closest('.popup');
        closePopup(popup);
    });
});
