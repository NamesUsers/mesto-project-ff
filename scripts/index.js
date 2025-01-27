// @todo: Темплейт карточки


// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

function deleteCard(cardElementDelete){
  cardElementDelete.remove()
}

function createCard(cardData) {
  const cardTemplate = document.querySelector('#card-template'); 
  const cardElement = cardTemplate.content.querySelector('.places__item').cloneNode(true); 

  cardElement.querySelector('.card__image').src = cardData.link;
  cardElement.querySelector('.card__image').alt = cardData.name;
  cardElement.querySelector('.card__title').textContent = cardData.name;

  const deleteButton = cardElement.querySelector('.card__delete-button');
  deleteButton.addEventListener('click', function() {
    deleteCard(cardElement)
  });

  return cardElement;
}

function loadCards(){
  const placeList = document.querySelector('.places__list')

  initialCards.forEach(function(card){
    const cardElementPreload = createCard(card);
    placeList.append(cardElementPreload);
  });
}

loadCards();
