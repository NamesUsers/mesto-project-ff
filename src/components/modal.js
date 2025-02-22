export function openPopup(popup) {
  popup.classList.remove('popup_is-animated');
  popup.classList.add('popup_is-opened');
  requestAnimationFrame(() => {
      popup.classList.add('popup_is-animated');
      popup.style.opacity = '1';
      popup.style.visibility = 'visible';
      popup.style.pointerEvents = 'auto';
  });
  document.addEventListener('keydown', closeEsc);
}

export function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
  popup.style.opacity = '0';
  popup.style.pointerEvents = 'none';
  setTimeout(() => {
      popup.style.visibility = 'hidden';
      popup.classList.remove('popup_is-animated');
  }, 600);
}

export function closeEsc(evt) {
  if (evt.key === 'Escape') {
      const openedPopup = document.querySelector('.popup_is-opened');
      if (openedPopup) {
          closePopup(openedPopup);
      }
  }
}

export function openImagePopup(cardData) {
  const imagePopup = document.querySelector('.popup_type_image');
  const imageCaption = imagePopup.querySelector('.popup__caption');
  const popupImage = imagePopup.querySelector('.popup__image');

  imageCaption.textContent = cardData.name;
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;

  openPopup(imagePopup);
}

const popups = document.querySelectorAll('.popup');

popups.forEach(function(popup) {
  popup.addEventListener('click', function(event) {
      if (event.target === popup) {
          closePopup(popup);
      }
  });
});
