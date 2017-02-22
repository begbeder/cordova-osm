// предварительно
	var Y = {
		arrGeo: {}, // Географические объекты
		arr: {}, // Фирмы
		arrSections: {}, // Разделы фирм (сделать)
		hour: hour(), // время сейчас
	};

	function hour () {
		var date = new Date();
		var time = date.getHours()*60 + date.getMinutes();
		return time;
	}

	function timeLeft(time) {
		var minutes = (parseInt(String(time).substr(0,2)) * 60) + parseInt(String(time).substr(3,5));
		var left = minutes - Y.hour;
		// console.log(time +" "+ minutes +" "+ left);
		return left;
	}

	function soonOver(time, status) {
		if (!status) return false;
		var left = timeLeft(time);
		// console.log(left);
		return ((left > 0) && (left < 60));
	}


	function expose() {
		var oldY = window.Y;

		Y.noConflict = function () {
			window.Y = oldY;
			return this;
		};

		window.Y = Y;
	}
	if (typeof module === 'object' && typeof module.exports === 'object') {
		module.exports = Y;
	// define Leaflet as an AMD module
	} else if (typeof define === 'function' && define.amd) {
		define(Y);
	}
	// define Leaflet as a global L variable, saving the original L to restore later if needed
	if (typeof window !== 'undefined') {
		expose();
	}
	Yarmap.prototype = Y;
	function Yarmap() {};

// вспомогательные
// работа с DOM, шаблонами //
// выбирает какой тип шаблона строить и строит
Yarmap.prototype.Build = function(type, json) {
	// if (json === null) return;
	this.type = type;
	switch (this.type) {
		case 'list':
			src = 'js/templates/list_tmpl.htm';
			where = '.list';
			getList(src, json, where);
			break;
		case 'list_cat':
			src = 'js/templates/list_categories_tmpl.htm';
			where = '.list';
			get(src, json, where);
			break;
		case 'item-cat_detail':
			src = 'js/templates/list_categories_tmpl.htm';
			where = this._id.next('.item-card__detail');
			json.hour = this.hour;
			get(src, json, where);
			break;
		case 'item-detail':
			src = 'js/templates/item-detail_tmpl.htm';
			where = this._id.next('.item-card__detail'); //'.item-card__detail';
			get(src, json, where);
			break;
		case 'popup':
			src = 'js/templates/card-map_tmpl.htm';
			where = '.leaflet-popup-content';
			this.get = get(src, json, where);
			break;
		case 'popup-map':
			src = 'js/templates/marker-map_tmpl.htm';
			where = '.leaflet-popup-content';
			this.get  = get(src, json, where);
			break;
		default:
			break;
		// console.log(this.type);
	}
	function get(src, json, where) {
		$.get( this.src, function (data) {
			if ( $(where).is(':empty') ){
				$.tmpl(data, json).appendTo(where);
			} else {
				$(where).html(""); // этого не было
				$.tmpl(data, json).appendTo(where);
			}
		});
	};
	function getList(src, json, where) {
		$.get( this.src, function (data) {
			if ( $(where).is(':empty') || (json.empty == 'false') ){
				$.tmpl(data, json).appendTo(where);
			} else {
				$(where).html(""); // этого не было
				$.tmpl(data, json).appendTo(where);
			}
		});
	};

	return this;
};
// возвращает ИД компании для строительства деталки
Yarmap.prototype.ItemList = function(id) {
	if ( typeof id == "object") {
		this._id = $('#' + $(id).closest('.item-card__name').attr('id'));
	} else {
		this._id = $('#' + id);
	}
	return this;
};

// работа с элементами поиска и результата // 
Yarmap.prototype.SearchBuildList = function(ul, item){
	switch (item.label){
		case 'Город':
			item.label = '<span class="city">Город</span>';
			break;
		case 'Район':
			item.label = '<span class="area">Район</span>';
			break;
		case 'Микрорайон':
			item.label = '<span class="area">Микрорайон</span>';
			break;
		case 'Улица':
			item.label = '<span class="street">Улица</span>';
			break;
		default:
			item.label = '';
		break;
	}	
};
// обработчики на события при поиске
Yarmap.prototype.SearchChange = function(){
	var headSearch = $('#headSearch'); // header__searchn
	var searchForm = headSearch.find('form');
	var searchInput = headSearch.find('input');
	var searchButton = headSearch.find('button');
	var searchClean = $('.ui-autocomplete-clean_button');
	var binder = function () {
		searchInput.on('keyup',function(e) {
			if (e.which == 13){
				searchButton.trigger('click');
				searchInput.blur();
			}
		});
	};
	var cleaner = function () {
		$('.input.ui-front').after('<span class="ui-autocomplete-clean_button"></span>');
		searchInput.after('<span class="input_noresult">Не найдено</span>');
		searchInput.on('input', function(){
			if( searchInput.val() ) {
				searchInput.addClass('ui-autocomplete-clean');
			} else {
				searchInput.removeClass('ui-autocomplete-clean');
			}
		});
		$(searchForm).on('submit', function(){
			return false;
		});
		$('body').delegate('.ui-autocomplete-clean_button','click', function(){
			searchInput.val('');
			searchInput.removeClass('ui-autocomplete-clean');
		});
		$('body').delegate('.worktime_more', 'click', function() {
			$(this).toggleClass('active');
			$(this).next().stop().slideToggle();
		});
		$('body').delegate('.control-btn_close', 'click', function(){
			Y.listScreen.hide();
		});
		$('body').delegate('.item-card__name', 'click', function(){
			list_height();
			var _id = $(this).closest('.item-card__name');
			if ( !_id.attr('onclick') ) {
				if (_id.parent().hasClass('open')) {
					_id.parent().removeClass('open');
					_id.next().slideToggle('normal', function(){});
				} else {
					_id.parent().addClass('open');
					_id.next().slideToggle('normal', function(){
						$('.sidebar-view main').mCustomScrollbar("scrollTo", '#company'+_id.attr('id'));
					});	
				}
				return false;
			}
		});
	};
	binder();
	cleaner();
};
Yarmap.prototype.SearchResult = function(){
	$('.input_noresult').fadeIn();
	setTimeout(function(){ 
		$('.input_noresult').fadeOut('slow');
	}, 1000);
};

// проверяем не пустой ли пришел json
Yarmap.prototype.NotEmpty = function(json) {
	// console.log(Object.keys(json).length);
	return (Object.keys(json).length != 0);
};
// сохраняем массив геоданных объектов
Yarmap.prototype.SaveObjectsArray = function(json) { //type !== 'company'
	this.json = json;
	// this.arrGeo = {}; // в конструктор Yarmap
	for (var i in this.json.items) {
		var objType = this.json.items[i].type;
		if (objType !== 'company' && objType !== 'section')	{
			var geoObjId = this.json.items[i].id;
			var latlng = this.json.items[i].coords,
				id =  geoObjId,
				address =  this.json.items[i].title,
				desc = this.json.items[i].title_desc,
				branches =  this.json.items[i].branches,
				type =  objType;
			if ("undefined" === typeof this.arrGeo[objType]) 
				this.arrGeo[objType] = {};
			this.arrGeo[objType][geoObjId] = {
				latlng: latlng,
				id: id,
				// address: address,
				title: address,
				title_desc: desc,
				branches: branches,
				type: type,
			};
			// сохранение всех свойств которые могут понадобиться
		}
	}
	return this;
};
// работа с элементами карты МАркеры и Попапы // 
Yarmap.prototype.SaveOfficesArray = function(json) { // SaveOffiecesArray
	this.json = json;
	this.arr = {}; // в конструктор Yarmap
	for (var i in this.json.items) {
		if (json.items[i].type == 'company') {
			var branch = this.json.items[i]["id"];
			this.arr[branch] = {};
			for(var j in this.json.items[i].coords) {
				var latlng = this.json.items[i].coords[j].i;
				var office_id = this.json.items[i].coords[j].of_id;
				var id = json.items[i].id;
				
				this.arr[branch][j] = {
					latlng: latlng || undefined,
					id: id,
					office_id: office_id
				};
				// сохранение всех свойств которые могут понадобиться
			}
		}
	}
	return this;
};
// удалить все точки и попапы
Yarmap.prototype.CleanAll = function() { // Clean all markers and popup
	if ( this.markers != undefined ) {
		map.removeLayer(this.markers);
		$('.leaflet-pane.leaflet-marker-pane').empty();
	}
	this.CleanPopup();
	// if ( this.popup != undefined ) {
	// 	map.removeLayer(this.popup);
	// }
	return this;
};
Yarmap.prototype.CleanPopup = function() { // Clean all markers and popup
	if ( this.popup != undefined ) {
		map.removeLayer(this.popup);
	}
	return this;
};

// масштабирование и центрирование маркеров на экране
Yarmap.prototype.ScaleMarker = function () {
	var maxlat = 0,
		maxlng = 0,
		minlat = 360,
		minlng = 360;
	var mapSize = map.getSize(); // размеры окна клиента
	for (var branch_id in this.arr) { // перебор филиалов
		for(var office_id in this.arr[branch_id]) { // перебор офисов
			minlat = Math.min(minlat, this.arr[branch_id][office_id].latlng[0]);
			maxlat = Math.max(maxlat, this.arr[branch_id][office_id].latlng[0]);
			minlng = Math.min(minlng, this.arr[branch_id][office_id].latlng[1]);
			maxlng = Math.max(maxlng, this.arr[branch_id][office_id].latlng[1]);
		}
	}
	this.centerlat = (maxlat + minlat)/2;
	this.centerlng = (maxlng + minlng)/2;
	if (this.centerlat == 180 && this.centerlng == 180)
		return; // проверка что есть координаты (чтобы в море не кидало)
	map.panTo({lat: this.centerlat, lng: this.centerlng, animation: false});
	// тут добавил чтобы меню не закрывало
	
	if (this.listScreen.statusShow && mapSize.x > 768 ){
		map.fitBounds(this.markers.getBounds(), {paddingTopLeft: [467, 0]}); // 450(список) + 17(маркер)
	} else {
		map.fitBounds(this.markers.getBounds());
	}
	return this;
};
// построить все Маркеры
Yarmap.prototype.BuildAll = function () {
	this.markers = new L.FeatureGroup(); // группа маркеров
	for (var i in this.arr) { // перебор филиалов
		for(var j in this.arr[i]) { // перебор офисов
			var dot = this.arr[i][j];
			var latlng =  dot.latlng;
			var office_id =  dot.office_id;
			var id = dot.id;
			// строим точки на карте
			map.setZoom(13, {animate: false});
			var marker = L.marker(latlng, {icon: redIcon, id: id, office_id: office_id});
			marker.on("click", onMarkerClick);
			this.markers.addLayer(marker);
		}
	}
	map.addLayer(this.markers);
	this.ScaleMarker();
	return this;
};

// получаем все, а строим по условию
// Yarmap.prototype.BuildFilter = function (filter) {
// 	this.markers = new L.FeatureGroup(); // группа маркеров
// 	for (var i in this.arr) { // перебор филиалов
// 		for(var j in this.arr[i]) { // перебор офисов
// 			if (!filter(this.arr[i][j])) continue;

// 			var dot = this.arr[i][j];
// 			var latlng =  dot.latlng;
// 			var office_id =  dot.office_id;
// 			var id = dot.id;
// 			// строим точки на карте
// 			map.setZoom(13, {animate: false});
// 			var marker = L.marker(latlng, {icon: redIcon, id: id, office_id: office_id});
// 			marker.on("click", onMarkerClick);
// 			this.markers.addLayer(marker);
// 		}
// 	}
// 	map.addLayer(this.markers);
// 	this.ScaleMarker();
// 	return this;
// };

// построим один Маркер
Yarmap.prototype.BuildOne = function(branch, j) {
	this.markers = new L.FeatureGroup(); // группа маркеров
	var dot = this.arr[branch][j];
	var latlng =  dot.latlng;
	var office_id =  dot.office_id;
	var id = dot.id;
		map.panTo(latlng, {animate:false}).setZoom(13, {animate: false});
		var marker =  new L.marker(latlng, {icon: redIcon, id: id, office_id: office_id}).addTo(map);
	this.markers.addLayer(marker);
	map.addLayer(this.markers);
	map.fitBounds(this.markers.getBounds());
};
// подсветить нужные Маркеры
Yarmap.prototype.HighlightBranch = function(branch){ // HighlightBranch
	this.markers = new L.FeatureGroup(); // группа маркеров
	for(var j in this.arr[branch]) { // перебор точек
		var dot = this.arr[branch][j];
		var latlng =  dot.latlng;
		var office_id = dot.office_id;
		var id = dot.id;
		// строим точки на карте
		map.panTo(latlng, {animate:false}).setZoom(13, {animate: false});
		var marker =  new L.marker(latlng, {icon: blueIcon, id: id, office_id: office_id});
		marker.on("click", onMarkerClick);
		this.markers.addLayer(marker);
	}
	map.addLayer(this.markers);
	if (this.listScreen.statusShow){
		map.fitBounds(this.markers.getBounds(), {paddingTopLeft: [467, 0]});
	} else {
		map.fitBounds(this.markers.getBounds());
	}
	// map.fitBounds(this.markers.getBounds());
	return this;
};
Yarmap.prototype.HighlightOne = function(branch, office) { // Highlight One marker
	this.markers = new L.FeatureGroup(); // группа маркеров
	// ?? какие параметры лучше передать
	var dot = this.arr[branch][office];

	var latlng =  dot.latlng;
	var office_id =  dot.office_id;
	var id = dot.id;
		map.panTo(latlng, {animate:false}).setZoom(16, {animate: false});
		var marker =  new L.marker(latlng, {clickable: false, icon: blueIcon, id: id, office_id: office_id});
		marker.on("click", function() {void(0)});
		this.markers.addLayer(marker);
	map.addLayer(this.markers);
	
	map.fitBounds(this.markers.getBounds());
};
// строит Попап
Yarmap.prototype.BuildPopup = function(latlng) {

	// Y.CleanAll();
	this.CleanPopup();

	this.popup = new L.popup().setLatLng(latlng).setContent(this.get);
	map.addLayer(this.popup);
	// map.fitBounds(this.popup.getBounds());
	map.panTo({lat: latlng[0], lng: latlng[1], animation: true}); // Центрирование попапа
	return this;
};

// вспомогательные //
// работа с прелоадерами и списками
Y.listLoader = { // прелоадер если список не загружен или его нужно догрузить
	loaderBig: '<div class="loader"><div>',
	loaderBottom: '<div class="loaderBottom"><a href="#" class="list-more_btn">Показать еще</a></div>',
	parent: '.sidebar-view',
	show: function(param) {
		if ("undefined" === typeof param) {
			param.load = '';
		}
		switch (param.load) {
			case 'bottom':
				// $(this.parent).append(this.loaderBottom);
				$('.list-more_btn').addClass('load');
				// console.log('s1');
			break;
			default:
				$(this.parent).append(this.loaderBig);
				if (! $("div").is(".loaderBottom"))
				$(this.parent).append(this.loaderBottom);
				// console.log('s2');
			break;

		}
	},
	hide: function(param) {
		switch (param.load) {
			case 'bottom':
				$('.list-more_btn').removeClass('load');
				$('.loaderBottom').hide();
				// $('.loaderBottom').remove();
				// console.log('h1');
			break;
			default:
				$('.loader').remove();
				$('.loaderBottom').hide();
				// console.log('h2');
			break;
		}
	},
};
Y.mainScreen = { // показывает и прячет начальный экран
	container: '.sidebar',
	show: function() {
		$(this.container).removeClass('view hidden').addClass('start');
	},
	hide: function() {
		$(this.container).removeClass('  start').addClass('hidden');
	}	
};
Y.listScreen = {
	container: '.sidebar',
	show: function() {
		// Y.mainScreen.hide();
		$(this.container).removeClass('start hidden').addClass('view');
	},
	hide: function() {
		$(this.container).removeClass('view  start').addClass('hidden');
		Y.mainScreen.show();
	},
	cleaning: function() {
		$(this.container).find('.list').empty();
	},
	statusShow: function() { // показывается или нет
		return $(this.container).hasClass("view");
	}
};
Y.itemList = {
	showLoader: function(id) {
		if ( typeof id == "object") {
			var _id = $('#' + $(id).closest('.item-card__name').attr('id'));
		} else {
			var _id = $('#' + id);
		}
			_id.addClass('load');
	},
	hideLoader: function(id) {
		list_height();
		if ( typeof id == "object") {
			var _id = $('#' + $(id).closest('.item-card__name').attr('id'));
		} else {
			var _id = $('#' + id);
		}
			_id.removeClass('load');
			_id.parent().addClass('open');
			_id.next().slideDown('fast', function(){
				$('.sidebar-view main').mCustomScrollbar("scrollTo",'#company' + $(_id).closest('.item-card__name').attr('id'));
			});
			_id.removeAttr('onclick');
	}
};
Y.HighlightOffice = { // подсвечивает нужный офис в списке
	on: function(id) {
		// var _id = $('#' + id).find("#" + $(office_id).attr('id'));
		// console.log(typeof _id);
		var _id = $('#' + id);
		var marker = $(_id).closest('.item-card__offices__office').children('.icon');
		$('.item-card__offices')
			.find('._card_adresred')
			.removeClass('_card_adresred')
			.addClass('_card_adres');
		marker.toggleClass('_card_adres  _card_adresred');
	}
};
Y.ListMore = {
	on: function() {
		if (lastSearch.calledFunction != "" ) 
		$('.loaderBottom').show();
		$('body').delegate('.list-more_btn','click', setNextPageLoad);
	},
	off: function() { // написана, но не используется
		$('.list-more_btn').removeClass('load');
		$('.loaderBottom').hide();
	}
};

// Вспомогательные функции //
// клик по маркеру на карте, открытие данной компании
function onMarkerClick() {
	var id = this.options.id;
	var office_id = this.options.office_id;
	// перекрасили все красный
	Y.CleanAll().BuildAll();
	// подсветили синим
	Y.HighlightOne(id, office_id);
	// console.log(this.options.id + ' , ' + this.options.office_id);
	// открыть категорию
	clickMapShowDetail(id, office_id);
};
// для работы скролера на больших экранах
function list_height() {
	var $old_list = $('.sidebar .list').height();
	var $list = $('.sidebar .list');
	if ($list.height() == $old_list) {
		var $main = $('#main').height();
		var $item = $('.sidebar .list__item').height();
		var $len = $('.sidebar .list__item').length;
		var padding = $main - $item*$len;
		$list.css('padding-bottom', padding );
	}
};

// http://stackoverflow.com/questions/18063278/leaflet-getbounds-returning-longitudes-greater-than-180

Yarmap.prototype.Minimap = function(obj) {
	// обработчики
	var selector = "#"+obj.wrap;
	var scroller = function() {
		var old_target = $(selector).offset().top;
		$(window).scroll(function(){
		    if($(selector).length == 0 ) return;
		        var target = $(selector).offset().top;
		        var bodytop = $(window).scrollTop();
		        if (bodytop > target || bodytop == target && target >= old_target) {
		          	$(selector).addClass('fixed');
		        } else {
		        	$(selector).removeClass('fixed');
		        }
		});
	};
	var binder = function() {
		$(selector + ' #minimap_mix').bind('change', function(){
			if($(this).prop('checked')) {
				scroller();
			} else {
				$(selector).removeClass('fixed');
				$(window).unbind("scroll");
			}
		});
	};
	binder();
	// инициализация карты и свойств
	var minimap = L.map( obj.wrap, {
		// center: currentCityCoords,
		zoom: 12,
		zoomControl:false,
		attributionControl:false,
	});
	var redIcon = L.icon({
		iconUrl: '/online/js/templates/marker-icon_red.png',
		iconSize: [34, 34],
		iconAnchor: [17, 34],
	});
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(minimap);
	L.control.zoom({position:'topright'}).addTo(minimap);
	// Построение точек и попапов
	this.arr = obj.json.items;
	this.markers = new L.FeatureGroup(); // группа маркеров
	for (var branch_id in this.arr) { // перебор филиалов
		var branch = this.arr[branch_id];
		var name = branch.name;
		
		for(var office_id in branch.offices) { // перебор офисов
			var dot = branch.offices[office_id];
			// console.log(dot.coords);
			var latlng =  dot.coords;
			var id = dot.id;
			var title = dot.title;
			// строим точки на карте
			minimap.setZoom(12, {animate: false});
			var marker = L.marker(latlng, {icon: redIcon, id: id, office_id: office_id});
			var mess = '<p>' + name + ' </p><br><a href="' + dot.link +'">' + title + '</a>';
			marker.bindPopup(mess);
			// marker.bindPopup(title + ' ' +  name);
			// marker.on("click", function(){
			// 	this.openPopup();
			// });
			marker.on('mouseover', function () {
				this.openPopup();
				var savedMarker = this;
				this.getPopup()._wrapper.onmouseleave = function() {
					savedMarker.closePopup();
				}
			});
			// marker.getPopup().on('mouseout', function () {
			// 	console.log("asdasdsa");
			// });
			// marker.on('mouseout', function () {
			// 	this.closePopup();
			// });
			this.markers.addLayer(marker);
		}
	}
	minimap.addLayer(this.markers);
	minimap.fitBounds(this.markers.getBounds());

	
	this.map = minimap;
	return this;
};
Yarmap.prototype.resize = function() {
	this.map.invalidateSize();
	this.map.fitBounds(this.markers.getBounds());
};

Yarmap.prototype.BindEvent = function() {
	var binder = function() {
		var controlChild = $('.toolsControl').children();
		var sidebarChild = $('.sidebar_mobile').children();
		var headerChild = $('.header_mobile').children();

		controlChild.on('click', function(){
			$("body").removeClass('z-index-sidebar z-index-header').addClass('z-index-controls');
		});
		sidebarChild.on('click', function(){
			$("body").removeClass('z-index-controls  z-index-header').addClass('z-index-sidebar');
		});
		headerChild.on('click', function(){
			$("body").removeClass('z-index-controls z-index-sidebar').addClass('z-index-header');
		});
		// $('.toolsControl').delegate(controlChild, 'click', function(){
		// 	$("body").removeClass('z-index-sidebar z-index-header').addClass('z-index-controls');
		// });
		// $('.sidebar_mobile').delegate(sidebarChild, 'click', function(){
		// 	$("body").removeClass('z-index-controls  z-index-header').addClass('z-index-sidebar');
		// });
		// $('.header_mobile').delegate(headerChild, 'click', function(){
		// 	$("body").removeClass('z-index-controls z-index-sidebar').addClass('z-index-header');
		// });
	};
	binder();
};  
Y.BindEvent(); 	// вызывается сразу, чтобы слушать события