var Yarmap = (function(){
	// приватный метод
	var funcPrivate = function () {
		return 'funcPrivate';
	};
	// публичный метод
	return {

		Init: function () { // загрузка плагинов, данных
			var that = this;
			var src = that.src,
				where = that.where,
				json = that.json;
			var getLoad = function (src, where, json) {

				if( src.length !== 0) {
					$.get( src, function (data) {
						data_tmpl = data;
						// console.log( data_tmpl );

						 runTmpl(data_tmpl, where, json);

					});

				} else {
					console.log('get error');
				}
			};
			var runTmpl = function (data_tmpl, where) { // сборка шаблона

				if( data_tmpl) {
					// console.log(json);
					$.tmpl(data_tmpl, json).appendTo(where);

				} else {
					console.log('tmpl error');
				}
			};
			// очистка старых данных
			if (where == '.list') {
				start.remove();
				list.close();
				list.run();
				getLoad(src, where);

			} else {
				list.Clean();
				getLoad(src, where);
			}
			
			
		},
		InitDetail: function (ob, id) { // загрузка плагинов, данных
			var that = this;
			var src = that.src,
				json = that.json;
			var where = $(ob).next('.item-card__detail');
			$(ob).addClass('load');
			var getLoad = function (src, where, json) {

				if( src.length !== 0 && where.is(':empty') ) {
					$.get( src, function (data) {
						data_tmpl = data;
						runTmpl(data_tmpl, where, json); // вставка шаблона в дом
						// анимация, открытие
						$(ob).parent().addClass('open');
						$(ob).next().slideDown('fast', function(){
							$('.sidebar-view main').mCustomScrollbar("scrollTo", '#'+$(ob).attr('id'));			
						});	

					});

				} else {
					console.log('get error');
				}
			};
			var runTmpl = function (data_tmpl, where) { // сборка шаблона 
				if( data_tmpl ) {
					$.tmpl(data_tmpl, json).appendTo(where);
				} else {
					console.log('tmpl error');
				}
			};
			getLoad(src, where);
			// return a + b;
		},
		Clean: function () {
			$(this.target).children().remove();
			// $('.sidebar').fadeOut();
			console.log('clean');
		},
		Search: function (mark) {
			var headSearch = $(this.target); // header__search
			var searchForm = headSearch.find('form');
			var searchInput = headSearch.find('input');
			var searchButton = headSearch.find('button'); 

			
			var run = function () {
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
								item.on = 'onclick="pointMap.geo()"';
								break;
							case 'Район':
								item.label = '<span class="area">Район</span>';
								// район как пример раздел
								item.on = 'onclick="list.Init()"';

								break;
							case 'Микрорайон':
								item.label = '<span class="area">Микрорайон</span>';
								break;
							case 'Улица':
								item.label = '<span class="street">Улица</span>';
								// улица как пример геоточка
								item.on = 'onclick="list.Init()"';
								break;
							default:
								item.label = '';
								item.on = '';

							break;
						}
						// совпадение запроса и результата
						var item_val = String(item.value).replace(
			            	new RegExp(this.term, "gi"), "<strong>$&</strong>");
			    		return $('<li ' + item.on +' ></li>')
			        		.data("item.autocomplete", item)
			        		.append('<a>' + item_val + item.label + '</a>')
			        		.appendTo(ul);
				};
			};
			var clean = function () {
				if( searchInput.val() ) {
					searchInput.addClass('ui-autocomplete-clean');
				} else {
					searchInput.removeClass('ui-autocomplete-clean');
				}
			};
			var clean_click = function () {
				searchInput.val('');
				searchInput.removeClass('ui-autocomplete-clean');
			};
			var submit = function () {
				console.log( searchInput.val() );
				return searchInput.val();
			};
			var button = function () {
				return searchInput.val();
			};
			switch (mark){
				case 'input':
					clean();
					break;
				case 'clean_click':
					clean_click();
					break;
				case 'submit':
					submit();
					break;
				case 'autocomplete':
					run();
					break;
				default:
				break;
			}

			
			// console.log( searchInput);
		},
		// funcPublic: funcPrivate

	}
})();
// базовые объекты
var List = function() {
	this.name = 'list';
	this.src = 'js/template/list_tmpl.htm';
	this.where = '.list';
	this.json = requestDataList;
	this.target = '.list';
	this.run = function() {
		$('.sidebar-view').show();
		$('.sidebar').fadeIn();
		console.log('list fadeIn');
	};
	this.close = function() {
		list.Clean();
		$('.sidebar').fadeOut();
		console.log('list fadeOut');
	};
};
var Item = function() {
	this.name = 'item_detail';
	this.src = 'js/template/item_detail.htm';
	this.json = requestDataDetail;
	this.toggle = function(ob) {
		$(ob).next().stop().slideToggle();
	}
};
var PointMap = function() {
	this.name = 'pointmap';
	this.src = 'js/template/pointMap.htm';
	this.where = '.leaflet-popup-content';
	this.json = requestPointMap;
	this.geo = function() {
		L.popup().setLatLng([56.010569, 92.852545]).setContent(pointMap.Init()).openOn(map);
	};
};
var StartWindow = function() {
	this.name = 'StartWindow';
	this.run = function() {
		$('.home-panel').show();
		$('.sidebar').fadeIn();
		console.log('start fadeIn');
	};
	this.remove = function() {
		$('.home-panel').remove();
	};
};
var InputSearch = function() {
	this.name = 'InputSearch';
	this.target = '#headSearch';
	// методы инпута
	this.input = function() {
		input_s.Search('input');
	};
	this.clean_click = function() {
		input_s.Search('clean_click');
	};
	this.close = function() {
		list.Clean();
		$('.sidebar').fadeOut();
		console.log('input fadeOut');
	};
	this.submit = function() {
		input_s.Search('submit');
		event.preventDefault();
	};
};

// наследование
List.prototype = Yarmap;
Item.prototype = Yarmap;
PointMap.prototype = Yarmap;
InputSearch.prototype = Yarmap;
StartWindow.prototype = Yarmap;


var list = new List();
var item = new Item();
var pointMap = new PointMap();
var input_s = new InputSearch();
var start = new StartWindow();
// отладочные константы

// вывод
// console.log( list.Init() );
// console.log( item.Init() );
// console.log( input_s.Search() );
// начало
	
// var Yarmap = (function(){
// 	// приватный метод
// 	var funcPrivate = function () {
// 		return 'funcPrivate';
// 	};
// 	// публичный метод
// 	return {
// 		func: function (a, b) {

// 			var that = this;
// 			var helperFunc = function (c, d) {
// 				// console.log( that );
// 				console.log('help ' + (d - c) );
// 				// that.multiply = c*d;
// 				return   d - c ;
// 			};

// 			helperFunc(a, b);
// 			return a + b;
// 		},
// 		funcPublic: funcPrivate

// 	}
// })();
// // базовые объекты
// var Input = function() {
// 	this.name = 'input';
// };
// // наследование
// Input.prototype = Yarmap;

// var inputS = new Input();


// // вывод
// console.log( Yarmap.func(1, 40 ) );
// console.log( inputS.func(1,35) );
// console.log( inputS.funcPublic() );
// console.log( inputS );