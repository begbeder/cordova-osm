
$(document).ready(function() {
	var window_Width = $(window).width();
	var window_Height = $(window).height();
	// очистка поиска
	$('#what').on('input', function(){
		if($(this).val()) {
			$(this).addClass('ui-autocomplete-clean');
		} else {
			$(this).removeClass('ui-autocomplete-clean');
		}
	});
	$('.ui-autocomplete-clean_button').on('click', function(){
		$('#what').val('');
		$('#what').removeClass('ui-autocomplete-clean');
	});
	// close sidebar
	$('.control-btn_close').on('click', function(){
		// $('.sidebar').hide();
		$('.list__item').remove();
		$('.sidebar-view header').removeClass('open');
		$('.sidebar').fadeOut();
	});
	
	// click button
	$('.leaflet-control a').on('click', function(){
		return false;
	});
	// перенес с индекса
	$('#what').autocomplete({
	source: function (request, response) {
			$.ajax({
				url: "/catalog/search/",
				data: {"AJAX_CALL": "Y", "request_type": "where", "request": request.term},
				dataType: 'json',
				success: function(data){
					// .slice(0, 10) ограничение макс 10 результатов
					// response(data);
					if( data !== null ) { 
						response(data.slice(0, 10)); 
					} else { 
						$('#what').val('no results');
						response(data); 
					}
				}
			});
		},
		delay: 500,
		max:10,
		minLength: 3,
		open: function(event, ui) {  // отпработка клика на мобилках
	        $('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
	    },
		}).data("ui-autocomplete")._renderItem = function (ul, item) {
			switch (item.label){
				case 'Город':
					item.label = '<span class="city">Город</span>';
					break;
				case 'Район':
					item.label = '<span class="area">Район</span>';
					// район как пример раздел
					item.data = 'area';

					break;
				case 'Микрорайон':
					item.label = '<span class="area">Микрорайон</span>';
					break;
				case 'Улица':
					item.label = '<span class="street">Улица</span>';
					// улица как пример геоточка
					// item.data = '56.0087996, 92.870769';
					item.data = 'street';
					break;
				default:
					item.label = '';
					item.data = '';
				break;
			}
			// совпадение запроса и результата
			var item_val = String(item.value).replace(
            	new RegExp(this.term, "gi"), "<strong>$&</strong>");
    		return $("<li></li>")
        		.data("item.autocomplete", item)
        		.append('<a data-search="'+ item.data +'">' + item_val + item.label + '</a>')
        		.appendTo(ul);
		};
	// для стилей 
	$('.ui-autocomplete').addClass('search_catalog-list');
	// обработчики шаблонов

	// обработка поиска	classYarmapConstr
		// обработка поиска	classYarmapConstr
	function YarmapConstr(params) {
		// public
		this.run = function() {}
		this.clear = function() {
			$('.list__item').remove();
			$('.sidebar-view header').removeClass('open');
			$('.sidebar').stop().fadeOut();

		}
		this.addResult = function() {
			console.log('addResult');
			switch(params) {
			case 'street':
				// вызов функции выведения метки на карте
				addPointMap();
		    break;
		    case 'area':
		    	// вызов функции выведение списка результатов
		    	// clear();
		    	addList();
		    break;
		    case 'geo':
		    	// вызов функции выведение списка результатов
		    	addList();
		    break;
			}
		}
		// private
		// function clear() {
		// 	$('.list__item').remove();
		// 	$('.sidebar-view header').removeClass('open');
		// 	$('.sidebar').fadeOut();

		// }
		function template_constr(param, where) {
			console.log('template_constr');
			if( ! param.hasClass('open') ) {
				param.addClass('open');
				switch(where) {
					case 'list':
						var templ = $.tmpl(list_tmpl, requestDataList);
						templ.appendTo('.list');
				    break;
					case 'list_detail':
						var templ = $.tmpl(item_detail, requestDataDetail);
						param.siblings('#item-card__detail').append(templ);
				    break;
				    case 'worktime':
						var templ = $.tmpl(item_worktime, requestWorkTime);
						param.siblings('.worktime-table_more').append(templ);
				    break;
				}
			} else {
				param.siblings('.worktime-table_more').stop().slideToggle('fast');
			}
		}
		function addPointMap() {
			console.log('addPointMap');
			var params = [56.0087996, 92.870769];
			L.popup().setLatLng(params).setContent(template).openOn(map);
			$.tmpl(pointMap, requestPointMap).appendTo('.leaflet-popup-content');	
		}
		function addList() {
			console.log('addList');
			$('body').removeClass('min').addClass('search');
			$('.sidebar').stop().fadeIn();

	    	// клик по элементу
				var param = $('.sidebar-view header');
				var where = 'list';
				template_constr(param, where);
			// блок формирование деталки раздела
			$('body').on('click', '.item-card__name', function(){
				var param = $(this);
				var where = 'list_detail';
				template_constr(param, where);
			});
			// блок время работы в деталке
			$('body').on('click', '.worktime_more', function(){
				var param = $(this);
				var where = 'worktime';
				template_constr(param, where);
			}); 
		}
	};

	// клик по элементу списка результатов
	$('body').on('click', '.ui-menu-item', function(){
		// параметр из элемента списка
		var params = $(this).children('a').attr('data-search');
		var yarmap = new YarmapConstr(params);
		yarmap.clear();
		yarmap.addResult();
	});	
	// клик по элементу геоточка на карте
	$('body').on('click', '.offices_a', function(){
		// параметр из элемента списка
		var params = $(this).attr('data-search');
		var yarmap = new YarmapConstr(params);
		yarmap.clear();
		yarmap.addResult();
	});
	// клик по форме
	$('.header__search form').on('submit', function(){
		var params = 'area';
		var yarmap = new YarmapConstr(params);
		yarmap.clear();
		yarmap.addResult();
		return false;
	});
	// вызов функции инлайн
	 function addClick(params){
	 	var yarmap = new YarmapConstr(params);
		yarmap.addResult();
	 };

});
// ready end

// old vers


// $(document).ready(function() {
// 	var window_Width = $(window).width();
// 	var window_Height = $(window).height();
// 	// очистка поиска
// 	$('#what').on('input', function(){
// 		if($(this).val()) {
// 			$(this).addClass('ui-autocomplete-clean');
// 		} else {
// 			$(this).removeClass('ui-autocomplete-clean');
// 		}
// 	});
// 	$('.ui-autocomplete-clean_button').on('click', function(){
// 		$('#what').val('');
// 		$('#what').removeClass('ui-autocomplete-clean');
// 	});
// 	// close sidebar
// 	$('.control-btn_close').on('click', function(){
// 		// $('.sidebar').hide();
// 		$('.list__item').remove();
// 		$('.sidebar-view header').removeClass('open');
// 		$('.sidebar').fadeOut();
// 	});
	
// 	// click button
// 	$('.leaflet-control a').on('click', function(){
// 		return false;
// 	});
// 	// перенес с индекса
// 	$('#what').autocomplete({
// 	source: function (request, response) {
// 			$.ajax({
// 				url: "/catalog/search/",
// 				data: {"AJAX_CALL": "Y", "request_type": "where", "request": request.term},
// 				dataType: 'json',
// 				success: function(data){
// 					// .slice(0, 10) ограничение макс 10 результатов
// 					// response(data);
// 					if( data !== null ) { 
// 						response(data.slice(0, 10)); 
// 					} else { 
// 						$('#what').val('no results');
// 						response(data); 
// 					}
// 				}
// 			});
// 		},
// 		delay: 500,
// 		max:10,
// 		minLength: 3,
// 		open: function(event, ui) {  // отпработка клика на мобилках
// 	        $('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
// 	    },
// 		}).data("ui-autocomplete")._renderItem = function (ul, item) {
// 			switch (item.label){
// 				case 'Город':
// 					item.label = '<span class="city">Город</span>';
// 					break;
// 				case 'Район':
// 					item.label = '<span class="area">Район</span>';
// 					// район как пример раздел
// 					item.data = 'area';

// 					break;
// 				case 'Микрорайон':
// 					item.label = '<span class="area">Микрорайон</span>';
// 					break;
// 				case 'Улица':
// 					item.label = '<span class="street">Улица</span>';
// 					// улица как пример геоточка
// 					// item.data = '56.0087996, 92.870769';
// 					item.data = 'street';
// 					break;
// 				default:
// 					item.label = '';
// 					item.data = '';
// 				break;
// 			}
// 			// совпадение запроса и результата
// 			var item_val = String(item.value).replace(
//             	new RegExp(this.term, "gi"), "<strong>$&</strong>");
//     		return $("<li></li>")
//         		.data("item.autocomplete", item)
//         		.append('<a data-search="'+ item.data +'">' + item_val + item.label + '</a>')
//         		.appendTo(ul);
// 		};
// 	// для стилей 
// 	$('.ui-autocomplete').addClass('search_catalog-list');
// 	// обработчики шаблонов

// 	// обработка поиска	classYarmapConstr
// 	function YarmapConstr(params) {
// 		// public
// 		this.run = function() {}
// 		this.clear = function() {
// 			$('.list__item').remove();
// 			$('.sidebar-view header').removeClass('open');
// 			$('.sidebar').fadeOut();

// 		}
// 		this.addResult = function() {
// 			console.log('addResult');
// 			switch(params) {
// 			case 'street':
// 				// вызов функции выведения метки на карте
// 				addPointMap();
// 		    break;
// 		    case 'area':
// 		    	// вызов функции выведение списка результатов
// 		    	addList();
// 		    break;
// 			}
// 		}
// 		// private
// 		function template_constr(param, where) {
// 			console.log('template_constr');
// 			if( ! param.hasClass('open') ) {
// 				param.addClass('open');
// 				switch(where) {
// 					case 'list':
// 						var templ = $.tmpl(list_tmpl, requestDataList);
// 						templ.appendTo('.list');
// 				    break;
// 					case 'list_detail':
// 						var templ = $.tmpl(item_detail, requestDataDetail);
// 						param.siblings('#item-card__detail').append(templ);
// 				    break;
// 				    case 'worktime':
// 						var templ = $.tmpl(item_worktime, requestWorkTime);
// 						param.siblings('.worktime-table_more').append(templ);
// 				    break;
// 				}
// 			} else {
// 				param.siblings('.worktime-table_more').stop().slideToggle('fast');
// 			}
// 		}
// 		function addPointMap() {
// 			console.log('addPointMap');
// 			var params = [56.0087996, 92.870769];
// 			L.popup().setLatLng(params).setContent(template).openOn(map);
// 			$.tmpl(pointMap, requestPointMap).appendTo('.leaflet-popup-content');	
// 		}
// 		function addList() {
// 			console.log('addList');
// 			$('body').removeClass('min').addClass('search');
// 			$('.sidebar').fadeIn();

// 	    	// клик по элементу
// 				var param = $('.sidebar-view header');
// 				var where = 'list';
// 				template_constr(param, where);
// 			// блок формирование деталки раздела
// 			$('body').on('click', '.item-card__name', function(){
// 				var param = $(this);
// 				var where = 'list_detail';
// 				template_constr(param, where);
// 			});
// 			// блок время работы в деталке
// 			$('body').on('click', '.worktime_more', function(){
// 				var param = $(this);
// 				var where = 'worktime';
// 				template_constr(param, where);
// 			}); 
// 		}
// 	};

// 	// клик по элементу списка результатов
// 	$('body').on('click', '.ui-menu-item', function(){
// 		// параметр из элемента списка
// 		var params = $(this).children('a').attr('data-search');
// 		var yarmap = new YarmapConstr(params);
// 		yarmap.clear();
// 		yarmap.addResult();
// 	});	
// 	// клик по элементу геоточка на карте
// 	$('body').on('click', '.offices_a', function(){
// 		// параметр из элемента списка
// 		// $('.sidebar').show();
// 		var params = $(this).attr('data-search');
// 		var yarmap = new YarmapConstr(params);
// 		yarmap.clear();
// 		yarmap.addResult();
// 	});
// 	// клик по форме
// 	$('.header__search form').on('submit', function(){
// 		var params = 'area';
// 		var yarmap = new YarmapConstr(params);
// 		yarmap.clear();
// 		yarmap.addResult();
// 		return false;
// 	});

// });


