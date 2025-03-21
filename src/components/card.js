import { deleteCard, likeCard as likeCardOnServer, unlikeCard as unlikeCardOnServer } from './api.js';

export function deleteCardElement(cardElement) {
  cardElement.remove();
}

export function likeCard(likeButton, likeCountElement, cardId) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');

  if (isLiked) {
    unlikeCardOnServer(cardId)
      .then(updatedCard => {
        likeCountElement.textContent = updatedCard.likes.length;
        likeButton.classList.remove('card__like-button_is-active');
      })
      .catch(err => console.error('Ошибка при снятии лайка:', err));
  } else {
    likeCardOnServer(cardId)
      .then(updatedCard => {
        likeCountElement.textContent = updatedCard.likes.length;
        likeButton.classList.add('card__like-button_is-active');
      })
      .catch(err => console.error('Ошибка при постановке лайка:', err));
  }
}

export function createCard(cardData, openImagePopup, currentUserId, handleDeleteCard, likeCard) {
  const cardTemplate = document.querySelector('#card-template');
  const cardElement = cardTemplate.content.querySelector('.places__item').cloneNode(true);

  
  cardElement.querySelector('.card__image').src = cardData.link;
  cardElement.querySelector('.card__image').alt = cardData.name;
  cardElement.querySelector('.card__title').textContent = cardData.name;

  
  const likeCountElement = cardElement.querySelector('.card__like-count');
  likeCountElement.textContent = cardData.likes.length;

  
  const likeButton = cardElement.querySelector('.card__like-button');
  if (cardData.likes.some(like => like._id === currentUserId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  
  likeButton.addEventListener('click', () => likeCard(likeButton, likeCountElement, cardData._id));

  
  const deleteButton = cardElement.querySelector('.card__delete-button');
  if (cardData.owner._id !== currentUserId) {
    deleteButton.style.display = 'none';
  } else {
    deleteButton.addEventListener('click', () => handleDeleteCard(cardData._id, cardElement));
  }

  
  const cardImage = cardElement.querySelector('.card__image');
  cardImage.addEventListener('click', () => openImagePopup(cardData));

  return cardElement;
}