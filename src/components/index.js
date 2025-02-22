import { loadCards, createCard,  } from './card.js';
import { openPopup, closePopup, closeEsc } from './modal.js';

loadCards();

const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const popupCloseButtons = document.querySelectorAll('.popup__close');
const editProfileForm = document.querySelector('.popup_type_edit .popup__form');
const addCardForm = document.querySelector('.popup_type_new-card .popup__form');

function fillEditProfileForm() {
    const editProfileForm = document.querySelector('.popup_type_edit');
    const nameInput = editProfileForm.querySelector('input[name="name"]');
    const descriptionInput = editProfileForm.querySelector('input[name="description"]');

    nameInput.value = profileName.textContent;
    descriptionInput.value = profileDescription.textContent;
}

editButton.addEventListener('click', function() {
    fillEditProfileForm();
    const editProfilePopup = document.querySelector('.popup_type_edit');
    openPopup(editProfilePopup);
});

editProfileForm.addEventListener('submit', function(evt) {
    evt.preventDefault();
    const nameInput = editProfileForm.querySelector('input[name="name"]');
    const descriptionInput = editProfileForm.querySelector('input[name="description"]');

    profileName.textContent = nameInput.value;
    profileDescription.textContent = descriptionInput.value;

    const editProfilePopup = document.querySelector('.popup_type_edit');
    closePopup(editProfilePopup);
});

addCardForm.addEventListener('submit', function(evt) {
    evt.preventDefault();
    const nameImageInput = addCardForm.querySelector('input[name="place-name"]');
    const imageInput = addCardForm.querySelector('input[name="link"]');

    const newCardData = {
        name: nameImageInput.value,
        link: imageInput.value
    };

    const placeList = document.querySelector('.places__list');
    const newCardElement = createCard(newCardData);
    placeList.prepend(newCardElement);

    addCardForm.reset();
    const addCardPopup = document.querySelector('.popup_type_new-card');
    closePopup(addCardPopup);
});

addButton.addEventListener('click', function() {
    const addCardPopup = document.querySelector('.popup_type_new-card');
    openPopup(addCardPopup);
});

popupCloseButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        const popup = this.closest('.popup');
        closePopup(popup);
    });
});

document.addEventListener('keydown', closeEsc);
