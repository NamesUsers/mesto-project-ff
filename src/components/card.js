import { openImagePopup } from './modal.js';
import { initialCards } from '../cards.js';

export function deleteCard(cardElement) {
    cardElement.remove();
}

export function createCard(cardData) {
    const cardTemplate = document.querySelector('#card-template');
    const cardElement = cardTemplate.content.querySelector('.places__item').cloneNode(true);

    cardElement.querySelector('.card__image').src = cardData.link;
    cardElement.querySelector('.card__image').alt = cardData.name;
    cardElement.querySelector('.card__title').textContent = cardData.name;

    const deleteButton = cardElement.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', function() {
        deleteCard(cardElement);
    });

    const likeButton = cardElement.querySelector('.card__like-button');
    likeButton.addEventListener('click', function() {
        likeButton.classList.toggle('card__like-button_is-active');
    });

    const editImage = cardElement.querySelectorAll('.card__image');
    editImage.forEach(function(image) {
        image.addEventListener('click', function() {
            openImagePopup(cardData);
        });
    });

    return cardElement;
}

export function loadCards() {
    const placeList = document.querySelector('.places__list');
    initialCards.forEach(function(card) {
        const cardElement = createCard(card);
        placeList.append(cardElement);
    });
}

