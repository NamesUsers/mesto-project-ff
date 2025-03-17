import { createCard } from './card.js';
import { openPopup, closePopup } from './modal.js';
import { initialCards } from '../cards.js';
import { validateForm, clearValidation, updateNameErrors, updateDescriptionErrors, updatePlaceNameErrors, updateLinkErrors } from './validation.js';

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

function toggleSubmitButton(form) {
    const submitButton = form.querySelector('.popup__button');
    submitButton.disabled = !validateForm(form);
}

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
    clearValidation(editProfileForm); // Очистка ошибок при открытии
    toggleSubmitButton(editProfileForm); 
    openPopup(editProfilePopup);
});

editProfileForm.addEventListener('input', () => {
    toggleSubmitButton(editProfileForm);
});

editProfileForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    if (validateForm(editProfileForm)) {
        const nameInput = editProfilePopup.querySelector('input[name="name"]');
        const descriptionInput = editProfilePopup.querySelector('input[name="description"]');

        profileName.textContent = nameInput.value;
        profileDescription.textContent = descriptionInput.value;

        closePopup(editProfilePopup);
    }
});

function initializeForm(form) {
    const formFields = form.querySelectorAll('.popup__input');
    formFields.forEach((field) => {
        field.classList.remove('popup__input_type_error');
    });

    const errorElements = form.querySelectorAll('.popup__error');
    errorElements.forEach((error) => {
        error.textContent = '';
    });
}

function handleFormInput(evt) {
    const inputField = evt.target;
    const form = inputField.closest('.popup__form');

    const isFormValid = validateForm(form);

    updateFormErrors(form, isFormValid);

    toggleSubmitButton(form);
}

function updateFormErrors(form, isFormValid) {
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

    if (!isFormValid) {
        updateNameErrors(form);
        updateDescriptionErrors(form);
        updatePlaceNameErrors(form);
        updateLinkErrors(form);
    }
}

addButton.addEventListener('click', () => {
    initializeForm(addCardForm); 
    clearValidation(addCardForm); // Очистка ошибок при открытии
    toggleSubmitButton(addCardForm); 
    openPopup(addCardPopup);
});

addCardForm.addEventListener('input', handleFormInput);

addCardForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    if (validateForm(addCardForm)) {
        const nameImageInput = addCardPopup.querySelector('input[name="place-name"]');
        const imageInput = addCardPopup.querySelector('input[name="link"]');

        const newCardData = {
            name: nameImageInput.value,
            link: imageInput.value
        };

        const newCardElement = createCard(newCardData, openImagePopup);
        placeList.prepend(newCardElement);

        addCardForm.reset();
        toggleSubmitButton(addCardForm);
        closePopup(addCardPopup);
    }
});

// Закрытие попапов
popupCloseButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const popup = button.closest('.popup');
        const form = popup.querySelector('.popup__form');
        clearValidation(form); 
        form.reset(); // Сброс формы при закрытии
        toggleSubmitButton(form); // Обновление состояния кнопки
        closePopup(popup);
    });
});