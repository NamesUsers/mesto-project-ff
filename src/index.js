import './index.css';
import { initialCards } from './cards.js';

function deleteCard(cardElementDelete) {
  cardElementDelete.remove();
}

function createCard(cardData) {
  const cardTemplate = document.querySelector('#card-template'); 
  const cardElement = cardTemplate.content.querySelector('.places__item').cloneNode(true); 

  cardElement.querySelector('.card__image').src = cardData.link;
  cardElement.querySelector('.card__image').alt = cardData.name;
  cardElement.querySelector('.card__title').textContent = cardData.name;

  const deleteButton = cardElement.querySelector('.card__delete-button');
  deleteButton.addEventListener('click', function() {
    deleteCard(cardElement);
  });

  const likeButton = cardElement.querySelector('.card__like-button')
  likeButton.addEventListener('click', function(){
    likeButton.classList.toggle('card__like-button_is-active')
  })

  const editImage = cardElement.querySelectorAll('.card__image');
  editImage.forEach(function(image) {
  image.addEventListener('click', function() {
    const imagePopup = document.querySelector('.popup_type_image');
    const imageCaption = document.querySelector('.popup__caption')
    const popupImage = document.querySelector('.popup__image')
    imageCaption.textContent = cardData.name
    popupImage.src = cardData.link
    popupImage.alt = cardData.name
    imagePopup.classList.add('popup_is-animated', 'popup_is-opened' );
    document.addEventListener('keydown', closeEsc);
  });
});


  return cardElement;
}

function loadCards() {
  const placeList = document.querySelector('.places__list');

  initialCards.forEach(function(card) {
    const cardElementPreload = createCard(card);
    placeList.append(cardElementPreload);
  });
}

loadCards();

const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const profileName = document.querySelector('.profile__title'); 
const profileDescription = document.querySelector('.profile__description');
const popupCloseButtons = document.querySelectorAll('.popup__close');
const popups = document.querySelectorAll('.popup');
const likeButton = document.querySelector('.card__like-button')

function fillEditProfileForm() {
  const editProfileForm = document.querySelector('.popup_type_edit');
  const nameInput = editProfileForm.querySelector('input[name="name"]');
  const descriptionInput = editProfileForm.querySelector('input[name="description"]');

  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
}

editButton.addEventListener('click', function() {
  fillEditProfileForm(); 
  const editProfile = document.querySelector('.popup_type_edit');
  editProfile.classList.add('popup_is-animated', 'popup_is-opened' );
  document.addEventListener('keydown', closeEsc); 
});

const editProfileForm = document.querySelector('.popup_type_edit .popup__form');
editProfileForm.addEventListener('submit', function(evt) {
  evt.preventDefault(); 

  const nameInput = editProfileForm.querySelector('input[name="name"]');
  const descriptionInput = editProfileForm.querySelector('input[name="description"]');

  profileName.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;

  const editProfile = document.querySelector('.popup_type_edit');
  editProfile.classList.remove('popup_is-animated', 'popup_is-opened' );
  document.removeEventListener('keydown', closeEsc); 
});

const addCardForm = document.querySelector('.popup_type_new-card .popup__form');
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

  const addCard = document.querySelector('.popup_type_new-card');
  addCard.classList.remove('popup_is-animated', 'popup_is-opened' );
  document.removeEventListener('keydown', closeEsc); 
});

addButton.addEventListener('click', function() {
  const addCard = document.querySelector('.popup_type_new-card');
  addCard.classList.add('popup_is-animated', 'popup_is-opened' );
  document.addEventListener('keydown', closeEsc); 
});



popupCloseButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    const popup = this.closest('.popup');
    popup.classList.remove('popup_is-animated', 'popup_is-opened' );
    document.removeEventListener('keydown', closeEsc); 
  });
});

popups.forEach(function(popup) {
  popup.addEventListener('click', function(event) {
    if (event.target === popup) {
      popup.classList.remove('popup_is-animated', 'popup_is-opened' );
      document.removeEventListener('keydown', closeEsc);
    }
  });
});

function closeEsc(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      openedPopup.classList.remove('popup_is-animated', 'popup_is-opened' );
      document.removeEventListener('keydown', closeEsc);
    }
  }
}


likeButton.addEventListener('click', function(){
  likeButton.classList.toggle('card__like-button_is-active')
})

document.addEventListener('keydown', closeEsc);

