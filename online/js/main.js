// var InputSearch = {
// 	Init: function (src, where) { // инициализация плагинов,загрузка

// 		// var src = 'js/template/list_tmpl.htm'; // будет пераваться в параметре

// 		if( src.length !== 0) {
// 			$.get( src, function (data) {
// 				data_tmpl = data;
// 				console.log( data_tmpl );
// 				// вынести в ран
// 				var templ = $.tmpl(data_tmpl, requestDataList);
// 				templ.appendTo(where);
// 			});

// 		} else {
// 			console.log('get error');
// 		}

// 	},
// 	Run: function (data_tmpl, where) { // работа с дом, обрааботка результата
// 		// this.name = name;
// 		var where = '.list';
// 		if(!data_tmpl) {
// 			// var templ = $.tmpl(data_tmpl, requestDataList);
// 				// console.log('0' + data_tmpl );
// 				// templ.appendTo('.list');
// 		} else {
// 		// 	console.log('tmpl error');
// 		}

// 	},
// 	Clean: function(name) { // очистка пред результата
// 		this.name = name;
// 	}
// };
// // var run = new InputSearch.Run('Run');
// // var clean = new InputSearch.Clean('Clean');
// var src = 'js/template/list_tmpl.htm';
// var where = '.list';
// var init = new InputSearch.Init(src, where);
// // var run = InputSearch.Run(init, where);

// console.log('1' + init);

// Y.StartWin = function() {};
// Y.Popup = function() {};
// Y.ItemSingle = function() {};
// Y.ItemList = function() {}
// Y.InputSearch = function() {
// 	var search = $('#searchInput'); // header__search
// 	var searchForm = searchInput.find('form');
// 	var searchInput = searchInput.find('input');
// 	var searchButton = searchInput.find('button');
// 	// иниц автокомплита
// 	// загрузка поиска
// 	// очистка поиска
// 	function cleanSearch() {

// 	}
	// function seachLoad(){
	// 	var q = searchInput.val();
	// 	$.get('//yarmap.alfateam.ru/online/autocomplete.json', function(data){
	// 		if(data.status != 'error'){
				
	// 		} else {
	// 			alert(data.result);
	// 		}
	// 	}, 'json')
	// },

// };


$(document).ready(function() {
	var window_Width = $(window).width();
	var window_Height = $(window).height();
	// очистка поиска
	// $('#what').on('input', function(){
	// 	input_s.Search('input');
	// });
	// $('.ui-autocomplete-clean_button').on('click', function(){
	// 	input_s.Search('clean_click');
	// });
	// $('.header__search form').on('submit', function(event){
	// 	input_s.Search('submit');
	// 	event.preventDefault();
	// });
	// input_s.Search('autocomplete');
	// start.run();
	// click button
	$('.leaflet-control a').on('click', function(){
		return false;
	});
	// перенес с индекса
	// $('#what').autocomplete({
	// source: function (request, response) {
	// 		$.ajax({
	// 			url: "/catalog/search/",
	// 			data: {"AJAX_CALL": "Y", "request_type": "where", "request": request.term},
	// 			dataType: 'json',
	// 			success: function(data){
	// 				// .slice(0, 10) ограничение макс 10 результатов
	// 				// response(data);
	// 				if( data !== null ) { 
	// 					response(data.slice(0, 10)); 
	// 				} else { 
	// 					$('#what').val('no results');
	// 					response(data); 
	// 				}
	// 			}
	// 		});
	// 	},
	// 	delay: 500,
	// 	max:10,
	// 	minLength: 3,
	// 	open: function(event, ui) {  // отпработка клика на мобилках
	//         $('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
	//     },
	// 	}).data("ui-autocomplete")._renderItem = function (ul, item) {
	// 		switch (item.label){
	// 			case 'Город':
	// 				item.label = '<span class="city">Город</span>';
	// 				break;
	// 			case 'Район':
	// 				item.label = '<span class="area">Район</span>';
	// 				// район как пример раздел
	// 				item.data = 'area';

	// 				break;
	// 			case 'Микрорайон':
	// 				item.label = '<span class="area">Микрорайон</span>';
	// 				break;
	// 			case 'Улица':
	// 				item.label = '<span class="street">Улица</span>';
	// 				// улица как пример геоточка
	// 				item.coord = [56.0087996, 92.870769];
	// 				item.data = 'street';
	// 				break;
	// 			default:
	// 				item.label = '';
	// 				item.data = '';
	// 			break;
	// 		}
	// 		// совпадение запроса и результата
	// 		var item_val = String(item.value).replace(
 //            	new RegExp(this.term, "gi"), "<strong>$&</strong>");
 //    		return $("<li></li>")
 //        		.data("item.autocomplete", item)
 //        		.append('<a data-coord="'+ item.coord +'" data-search="'+ item.data +'"  onclick="addClick( $(this) );">' + item_val + item.label + '</a>')
 //        		.appendTo(ul);
	// 	};
	// для стилей 
	$('.ui-autocomplete').addClass('search_catalog-list');
	// обработчики шаблонов

	// вызов функции инлайн


});
// ready end