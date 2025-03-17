import { clearValidation } from './validation.js';

export function openPopup(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscClose);
  popup.addEventListener('click', handleOverlayClick);
}

export function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscClose);
  popup.removeEventListener('click', handleOverlayClick);
}

function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      const form = openedPopup.querySelector('.popup__form');
      if (form) {
        clearValidation(form); 
        form.reset(); 
      }
      closePopup(openedPopup);
    }
  }
}

function handleOverlayClick(evt) {
  if (evt.target.classList.contains('popup')) {
    const form = evt.target.querySelector('.popup__form');
    if (form) {
      clearValidation(form); 
      form.reset(); 
    }
    closePopup(evt.target);
  }
}