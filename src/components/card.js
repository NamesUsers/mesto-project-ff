import { openImagePopup } from './modal.js';
import { initialCards } from '../cards.js';

export function deleteCard(cardElement) {
    cardElement.remove();
}

export function likeCard(likeButton) {
    likeButton.classList.toggle('card__like-button_is-active');
}

export function handleImageClick(cardData, openImagePopup) {
    openImagePopup(cardData);
}

export function createCard(cardData, deleteCard, likeCard, handleImageClick) {
    const cardTemplate = document.querySelector('#card-template');
    const cardElement = cardTemplate.content.querySelector('.places__item').cloneNode(true);

    cardElement.querySelector('.card__image').src = cardData.link;
    cardElement.querySelector('.card__image').alt = cardData.name;
    cardElement.querySelector('.card__title').textContent = cardData.name;

    const deleteButton = cardElement.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', () => deleteCard(cardElement));

    const likeButton = cardElement.querySelector('.card__like-button');
    likeButton.addEventListener('click', () => likeCard(likeButton));

    const cardImage = cardElement.querySelector('.card__image');
    cardImage.addEventListener('click', () => handleImageClick(cardData, openImagePopup));

    return cardElement;
}

export function loadCards(openImagePopup) {
    const placeList = document.querySelector('.places__list');
    initialCards.forEach((card) => {
        const cardElement = createCard(card, deleteCard, likeCard, (data) => handleImageClick(data, openImagePopup));
        placeList.append(cardElement);
    });
}