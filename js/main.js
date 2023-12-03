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
    console.log(data);
    $(document).ready(function () {
      let smc_id = $('#smc-number');
      let smc_size = $('#smc-size');
      let smc_status = $('#smc-status');
      let smc_price = $('#smc-price');
			let smc_card = $('#svg-map-card');
      // Обработчики клика на ген план
      for (let node of document.getElementById('svg-map').childNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
					id_element = node.getAttribute('id').split('-');
          id_element = id_element[id_element.length - 1];
					let foundObject = data.find((obj) => obj.id === parseInt(id_element));

            if (foundObject) {
              console.log(foundObject);
							if (foundObject.status === 'забронирован') {
								$(node).addClass('reserved');	
								$(node).removeClass('sold');
							} else
							if (foundObject.status === 'свободен') {
								$(node).removeClass('reserved');	
								$(node).removeClass('sold');
							} else {
								$(node).addClass('sold');
								$(node).removeClass('reserved');
							}
            } else {
              console.log(`Объект с id ${id_element} не найден`);
            }
          node.addEventListener('click', (event) => {
            el = event.currentTarget;
            id_element = el.getAttribute('id').split('-');
            id_element = id_element[id_element.length - 1];

            let foundObject = data.find((obj) => obj.id === parseInt(id_element));

            if (foundObject) {
              console.log(foundObject);
							if (foundObject.status === 'забронирован') {
								smc_card.addClass('svg-map-card__reserved');	
								smc_card.removeClass('svg-map-card__sold');
							} else
							if (foundObject.status === 'свободен') {
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
    });
  })
  .catch((error) => {
    console.error('There has been a problem with your fetch operation:', error);
  });

// Для попапа карты

// open faq
$(document).ready(function () {
  $('.faq__question').click(function (event) {
    if ($('.faq__items').hasClass('one')) {
      $('.faq__question').not($(this)).removeClass('active');
      $('.faq__answer').not($(this).next()).slideUp(300);
    }
    $(this).toggleClass('active').next().slideToggle(300);
  });
});
