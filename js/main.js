AOS.init();

// JSONParser
// Имя файла JSON
const filename = 'js/data.json';

// Запрос на файл
fetch(filename)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then((data) => {
    // Обработка полученных данных
    $(document).ready(function () {
      let smc_id = $('#smc-number');
      let smc_size = $('#smc-size');
      let smc_status = $('#smc-status');
      let smc_price = $('#smc-price');
      let smc_card = $('#svg-map-card');
      let mfp = $('#modal-order-place');
      // Обработчики клика на ген план
      for (let node of document.getElementById('svg-map').childNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          id_element = node.getAttribute('id').split('-');
          id_element = id_element[id_element.length - 1];
          let foundObject = data.find((obj) => obj.id === parseInt(id_element));

          if (foundObject) {
            if (foundObject.status === 'забронирован') {
              $(node).addClass('reserved');
            } else if (foundObject.status === 'свободен') {
              $(node).addClass('available');
            } else {
              $(node).addClass('sold');
            }
          } else {
            console.log(`Объект с id ${id_element} не найден`);
          }
          $(node).on('click', function (event) {
            el = event.currentTarget;
            id_element = el.getAttribute('id').split('-');
            id_element = id_element[id_element.length - 1];

            let foundObject = data.find((obj) => obj.id === parseInt(id_element));

            if (foundObject) {
              if (foundObject.status === 'забронирован') {
                smc_card.addClass('svg-map-card__reserved');
                smc_card.removeClass('svg-map-card__sold');
              } else if (foundObject.status === 'свободен') {
                smc_card.removeClass('svg-map-card__reserved');
                smc_card.removeClass('svg-map-card__sold');
              } else {
                smc_card.addClass('svg-map-card__sold');
                smc_card.removeClass('svg-map-card__reserved');
              }
              smc_id.text(id_element);
              smc_size.text(foundObject.square);
              smc_status.text(foundObject.status);
              smc_price.text(foundObject.price);
              mfp.val(id_element);
            } else {
              console.log(`Объект с id ${id_element} не найден`);
            }
          });
        }
        // node.addEventListener('mouseover', (event) => {
        //   el = event.currentTarget;
        //   console.log(el.getAttribute('id'));
        // });
      }
      $('#svg-map')
        .contents()
        .each(function (index, node) {
          if ($(node).hasClass('available')) {
            $(node).click();
            return false;
          }
        });
    });
  })
  .catch((error) => {
    console.error('There has been a problem with your fetch operation:', error);
  });

// <FAQ> =========================================================
$(document).ready(function () {
  $('.faq__question').click(function (event) {
    if ($('.faq__items').hasClass('one')) {
      $('.faq__question').not($(this)).removeClass('active');
      $('.faq__answer').not($(this).next()).slideUp(300);
    }
    $(this).toggleClass('active').next().slideToggle(300);
  });
});

// </FAQ> =========================================================
// <POPUPS> =========================================================

const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding');

let unlock = true;
const timeout = 500;
const stack = [];

if (popupLinks.length > 0) {
  for (let index = 0; index < popupLinks.length; index++) {
    const popupLink = popupLinks[index];
    // listeners for popup links
    popupLink.addEventListener('click', function (e) {
      const popupName = popupLink.getAttribute('href').replace('#', '');
      const curentPopup = document.getElementById(popupName);
      popupOpen(curentPopup);
      e.preventDefault();
    });
  }
}

const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
  for (let index = 0; index < popupCloseIcon.length; index++) {
    const el = popupCloseIcon[index];
    el.addEventListener('click', function (e) {
      popupClose(el.closest('.popup'));
      e.preventDefault();
    });
  }
}

function popupOpen(curentPopup) {
  if (curentPopup && unlock) {
    if (stack.length == 0) {
      bodyLock();
    }
    stack.push(curentPopup);

    curentPopup.classList.add('open');
    let clickedElement = null;

    curentPopup.addEventListener('mousedown', function (e) {
      clickedElement = e.target;
    });
    curentPopup.addEventListener('mouseup', function (e) {
      if (e.target === clickedElement) {
        if (!e.target.closest('.popup__content')) {
          popupClose(e.target.closest('.popup'));
        }
      }
    });
  }
}
function popupClose(popupActive, doUnlock = true) {
  if (unlock) {
    popupActive.classList.remove('open');
    let index = stack.indexOf(popupActive);
    if (index > -1) {
      stack.splice(index, 1);
    }
    if (stack.length == 0) {
      bodyUnLock();
    }
  }
}

function bodyLock() {
  const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
  if (lockPadding.length > 0) {
    for (let index = 0; index < lockPadding.length; index++) {
      const el = lockPadding[index];
      el.style.paddingRight = lockPaddingValue;
    }
  }
  body.style.paddingRight = lockPaddingValue;
  body.classList.add('lock');

  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
}

function bodyUnLock() {
  setTimeout(function () {
    if (lockPadding.length > 0) {
      for (let index = 0; index < lockPadding.length; index++) {
        const el = lockPadding[index];
        el.style.paddingRight = '0px';
      }
    }

    body.style.paddingRight = '0px';
    body.classList.remove('lock');
  }, timeout);

  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    let item = stack[stack.length - 1];
    popupClose(item);
  }
});

document.querySelector('.modal-order__form').addEventListener('submit', function (event) {
  event.preventDefault();
  let item = stack[stack.length - 1];
  popupClose(item);
});
// </POPUPS> =========================================================
// <SMOOTH SCROLL> ===================================================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth',
    });
  });
});

// </SMOOTH SCROLL> ===================================================
// <INPUT ANIMATION> ==================================================

$(document).ready(function () {
  $('.input-cpc')
    .on('focus', function () {
      $(this).closest('.input-cpp').removeClass('required');
      $(this).closest('.input-cpp').addClass('focused');
    })
    .on('blur', function () {
      if ($(this).val() == '') {
        $(this).closest('.input-cpp').removeClass('focused');
        $(this).closest('.input-cpp').addClass('required');
      }
    });
});

// </INPUT ANIMATION> ==================================================
// <PHONE MASK> =======================================================

$(document).ready(function () {
  $('#modal-order-phone').inputmask();
});

// </PHONE MASK> =======================================================
