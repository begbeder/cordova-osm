<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");?>
<!DOCTYPE HTML>
<html>
	<head>
		<title>ЯрМап Онлайн</title>		
		<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">		
		
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

		<?/*Это Leaflet !!!*/?>
		<link rel="stylesheet" href="js/leaflet/leaflet.css" />
		<script src="js/leaflet/leaflet.js"></script>
		<?/**/?>
		<!-- <link rel="stylesheet" href="js/font-awesome.min.css">		 -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
		<link rel="stylesheet" href="template_styles.css" />
		<link rel="stylesheet" href="js/custom_styles.css">	

		<!-- <script src="https://code.jquery.com/jquery-1.11.2.min.js"></script> -->
		<script src="js/jquery-1.11.2.min.js"></script>
		<script type="text/javascript" src="js/jquery.tmpl.js"></script>
		<!-- <script type="text/javascript" src="http://ajax.aspnetcdn.com/ajax/jquery.templates/beta1/jquery.tmpl.js"></script> -->
		<!-- template -->
		<script type="text/javascript" src="js/templates/storage.js"></script>
		<!-- autocomplete -->
		<link rel="stylesheet" href="../bitrix/templates/main/js/jquery-ui-1.11.4.custom/jquery-ui.min.css">	
		<script src="../bitrix/templates/main/js/jquery-ui-1.11.4.custom/jquery-ui.min.js"></script>
		
		<!-- // <script src="js/typehead.js"></script> -->
		<script src="js/bootstrap.drop.js"></script>
		<script src="js/yarmap.new.js"></script>
		<script src="js/main.js"></script>
		
		<script src="js/mCustomScrollbar/jquery.mCustomScrollbar.concat.min.js"></script>
		<link rel="stylesheet" href="js/mCustomScrollbar/jquery.mCustomScrollbar.css" />
		
		<?/* Это openlayers ЧЕТА ГЛЮЧИТ!!!! определение центра работает ХЗ по каким кординатам*?>
		<link rel="stylesheet" href="http://openlayers.org/en/v3.9.0/css/ol.css" type="text/css">
		<script src="http://openlayers.org/en/v3.9.0/build/ol.js"></script>	
		<?/**/?>
	</head>	
	<body class="">
		<header class="header header_mobile">
			<a href="/online/" class="header__logo"></a>
			<div id="headSearch" class="header__search">
				<form>
					<div class="input ui-widget  ui-front">
						<input type="text" name="what" id="what" value="" placeholder="Адрес или организация"/>
						<script type="text/javascript">
							Y.SearchChange();
							$('#what').autocomplete({
								source: function (request, response) {
									$.ajax({
										url: "/catalog/search/",
										data: {"AJAX_CALL": "Y", "request_type": "what_where", "request": request.term},
										dataType: 'json',
										success: function(data){
											// .slice(0, 10) ограничение макс 10 результатов
											if( Object.keys(data).length != 0) { 
												response(data.slice(0, 10)); 
											} else { 
												Y.SearchResult();
												response(data); 
											}
										}
									});
								},
								delay: 500,
								max:10,
								minLength: 3,
								select: function( event, ui ) {
									var item = ui.item;
									// Y.SearchSelect(item);
									showType(item);
								},
								open: function(event, ui) {  // отпработка клика на мобилках
									$('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
								},
							}).data("ui-autocomplete")._renderItem = function (ul, item) {
								Y.SearchBuildList(ul, item);
								// совпадение запроса и результата
								var item_val = String(item.value).replace( new RegExp(this.term, "gi"), "<strong>$&</strong>");
								return $('<li></li>')
										.data("item.autocomplete", item)
										.append('<a>' + item_val + item.label + '</a>')
										.appendTo(ul);
							};
						
							// для стилей 
							$('.ui-autocomplete').addClass('search_catalog-list');
						</script>
					</div>
					<button>Найти</button>
				</form>
			</div>
		</header>
		<!-- <div id="test"></div> -->
		<aside class="sidebar sidebar_mobile start">
			<div class="home-panel">
				<?
					$APPLICATION->IncludeComponent(
						"alfateam:city.list",
						"online",
						array(
							
							"CACHE_TIME" => 36000000,
							"CACHE_TYPE" => "A"
						),
						false
					);
				
					$APPLICATION->IncludeComponent(
						"alfateam:weather",
						".default",
						array(
							"CACHE_TIME" => 3600, // час
							"CACHE_TYPE" => "A"
						),
						false
					);
				?>
				<div class="home-panel__rubric">
					<a href="#" class="home-panel__rubricItem" onclick="showCat({id: 8246});">
						<i class="_rubric_carwash"></i>
						<span>Автомойки</span>
					</a>
					<a href="#" class="home-panel__rubricItem" onclick="showCat({id: 8044});">
						<i class="_rubric_market"></i>
						<span>Супер&shy;маркеты</span>
					</a>
					<a href="#" class="home-panel__rubricItem" onclick="showCat({id: 8076});">
						<i class="_rubric_coffee"></i>
						<span>Кофейни</span>
					</a>
					<a href="#" class="home-panel__rubricItem" onclick="showCat({id: 8321});">
						<i class="_rubric_net"></i>
						<span>Компьютер&shy;ные сети</span>
					</a>
					<a href="#" class="home-panel__rubricItem" onclick="showAllCat();">
						<i class="_rubric_all"></i>
						<span>Все рубрики</span>
					</a>
				</div>
				<div class="home-panel__adv">
					<?=CAdvBanner::GetHTML(CAdvBanner::GetRandom("online_main_screen"));?>
					<!-- <a href="#">
						<img src="images/adv1.gif" width="450" height="100"/>
					</a> -->
					<a href="/business/adv/" class="home-panel__advAdd">
						Разместить рекламу
					</a>
				</div>
				<!--<div class="minimap" id="minimap">
					<div class="minimap-control">
						<div class="control-left">
							<label for="minimap_mix"><input type="checkbox" id="minimap_mix"> Зафиксировать карту</label>
						</div>
						<div class="control-right">
							<a href="#">Показать на большой карте</a>
						</div>
					</div>
				</div> -->
				<script>
					// var obj = {
					// 	wrap: 'minimap', // указываем id контекнера для карты
					// 	// center: currentCityCoords,
					// 	json: siteJSON // данные координат и попапов
					// }
					// Y.Minimap(obj);
				</script>	
			</div>
			<?/**/?>
			<div class="sidebar-view">
				<div class="sidebar-view__control">
					<div class="control-btn_close" onclick=""><i class="fa fa-times"></i></div>
				</div>
				<header>Организации</header>
				<main id="main">
					<div class="list"></div>
				</main>
			</div>
		</aside>
		<!-- слой контролов над картой -->
		<div class="toolsControl toolsControl_mobile">
			<label class="toolsControl__route control-btn control-btn__mobile"><i class="control-btn__icon"></i> Маршруты</label>
			<label class="toolsControl__traffic control-btn control-btn__mobile"><i class="control-btn__icon"></i> Пробки</label>
			<?$APPLICATION->IncludeComponent(
				"alfateam:city.list",
				"online.mobile",
				array(
					"CACHE_TIME" => 36000000,
					"CACHE_TYPE" => "A"
				),
				false
			);?>
		</div>
		<div id="map" class="map map_mobile"></div>

		<script type="text/javascript">
			// предварительно
				var template = '<div class="map-card"></div>';
				var redIcon = L.icon({
					// iconUrl: 'js/leaflet/images/marker-icon.png',
					iconUrl: 'js/templates/marker-icon_red.png',
					iconSize: [34, 34],
					iconAnchor: [17, 34],
				});
				var blueIcon = L.icon({
					// iconUrl: 'js/templates/marker-icon_blue.png',
					iconUrl: 'js/templates/marker-icon_bl.png',
					iconSize: [34, 34],
					iconAnchor: [17, 34],
				});	
				var myRedIcon = L.divIcon({className: 'myRedIcon'});
				var myBlueIcon = L.divIcon({className: 'myBlueIcon'});
							
				var map = L.map('map',{
					center: currentCityCoords,
					zoom: 12,
					zoomControl:false,
					attributionControl:false
				});
				// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
				L.tileLayer('http://yarmap.alfateam.ru/osm_tiles/{z}/{x}/{y}.png').addTo(map);
				L.control.zoom({position:'topright'}).addTo(map);
				var ViewControl = L.Control.extend({
					options: {
						position: 'topright'
					},
					onAdd: function (map) {
						var viewControl = L.DomUtil.create('div', 'view-control');
						var ruler = L.DomUtil.create('a', 'view-control__ruler control-btn', viewControl);
						var geo = L.DomUtil.create('a', 'view-control__geo-location control-btn', viewControl);
						ruler.addEventListener('click', function(){
							console.log('ruler');
						});
						geo.addEventListener('click', function(){
							console.log('geo-location');
						});					
						return viewControl;
					}
				});			
				map.addControl(new ViewControl());
				// перенес в метод Y.listScreen.show()
			// скроллбар
				$('.sidebar-view main').mCustomScrollbar({
					theme:'dark-thick',
					callbacks:{
						onTotalScroll:function(){
							Y.ListMore.on(); // проверяет, запускать ли setNextPageLoad();
						},
						alwaysTriggerOffsets:false
					}
				});
				var lastSearch = {}; // последний поиск для пагинации
				var setNextPageLoad = function (){ // обертка для следующей страницы последнего поиска
					console.log(lastSearch);
					var calledFunction = lastSearch.calledFunction;
					var params = lastSearch.params;
					scrollEnd(params, calledFunction);
				};
				function setNextPageReguest (params, calledFunction) { // перезапись последнего поиска
					lastSearch.params = {};
					lastSearch.params = params;
					lastSearch.calledFunction = calledFunction;
				}
				function scrollEnd(params, calledFunction) {
					// console.log(params);
					// console.log(calledFunction);
					if ("undefined" === typeof params) {
						params = {};
					}
					if ("undefined" !== typeof params.page) {
						params.page++;
					} else {
						params.page = 2;
					}
					switch (calledFunction) {
						case 'showCat': // раздел
							showCat(params);
							break;
						case 'showSearch': // поиск
							showSearch(params);
							break;
						case 'showObjectDetail': // деталка дома\улицы
							showObjectDetail(params);
							break;
						default:
							break;
					}
				};

			$('.header__search button').on('click', function(){showSearch({}); });

			map.on('click', onMapClick);
			function onMapClick(e) {
				$.ajax({
					type: 'GET',
					crossDomain:true,
					dataType : 'json', 
					url: 'http://nominatim.openstreetmap.org/reverse',
					// data: {latlng:e.latlng, zoom:18, format:'json'},
					data: {lat:e.latlng.lat,lon:e.latlng.lng, zoom:18, format:'json'},
					success: function(osmObj){
						// showPopup(osmObj);
						// if (osmObj.address.hasOwnProperty("house_number")) {
							showPoint(osmObj);
						// } else if (osmObj.address.hasOwnProperty("road")) {
						// 	showStreet(osmObj);
						// }
					}
				});
			};

			function showObjectDetail(ob) { // клик по ссылке "5 организаций в попапе", создает левый список
				//закрываем main Y
				Y.mainScreen.hide();
				Y.listScreen.show();
				//открываю окно списка Y
				Y.listLoader.show(ob);
				//показываю в нем лоадер в списка Y.listLoader.show();
				if ("undefined" === typeof ob.page) {
					ob.page = 1;
				}

				$.ajax({
					url: "/catalog/search/",
					data: {"AJAX_CALL": "Y", "request_type": "object_detail", "request": ob},
					dataType: 'json',
					success: function(json){
						if (Y.NotEmpty(json)) {
							if (ob.page > 1) {
								json.items = $.merge(Y.json.items, json.items);
							}

							$.extend(json,ob);
							Y.Build('list', json);
							Y.listLoader.hide(ob);
							Y.SaveOfficesArray(json);
							// Y.SaveObjectsArray(json);

							// Y.CleanAll().BuildAll(); // тут надо подумать
							ob.load = 'bottom';
							setNextPageReguest(ob, "showObjectDetail");
						} else {
							ob.load = '';
							Y.listLoader.hide(ob);
							setNextPageReguest({}, "");
						}
					}
				});
			};
			function showDetail(obj, obj_id) { // при клике на фирму в списке
				Y.itemList.showLoader(obj);
				var request = {
					id_branch: obj.id
				};
				$.extend(request,obj_id);
				$.ajax({
					url: "/catalog/search/",
					data: {"AJAX_CALL": "Y", "request_type": "branch_detail", request: request},
					dataType: 'json',
					success: function(json){
						console.log(json);
						Y.itemList.hideLoader(obj);
						Y.ItemList(obj).Build('item-detail', json);
						var id_branch = $(obj).attr('id');
						if (("undefined" !== typeof obj_id)
							&& ("undefined" !== typeof obj_id.id_office)
							&& (obj_id.id_office > 0)) {
							Y.CleanAll().BuildAll();
							showMarker(id_branch, obj_id.id_office);
						} else {
							Y.CleanAll().BuildAll().HighlightBranch(id_branch);
						}
					}
				});
			};

			<?if (intval($_GET["id_house"])) :  // обработка ссылки из каталога?>
				$(document).ready(function() {
					showObjectDetail({id_house:<?=$_GET["id_house"]?>});
				});
			<?endif;?>
			<?if (intval($_GET["office_id"])) :  // обработка ссылки из каталога?>
				$(document).ready(function() {
					findOffice({id_office:<?=$_GET["office_id"]?>});
				});
			<?endif;?>
			<?if (intval($_GET["id_section"])) :  // обработка ссылки из каталога?>
				$(document).ready(function() {
					showCat({id:<?=$_GET["id_section"]?>});
				});
			<?endif;?>
			<?if (intval($_GET["id_branch"])) :  // обработка ссылки из каталога?>
				$(document).ready(function() {
					findBranch({id_branch:<?=$_GET["id_branch"]?>});
				});
			<?endif;?>
			<?if (strlen($_GET["what"]) + strlen($_GET["where"])) :  // обработка ссылки из каталога?>
				$(document).ready(function() {
					$('#what').val("<?=implode(" ", array($_GET["what"],$_GET["where"]))?>");
					showSearch({});
				});
			<?endif;?>

			function findBranch(ob) { // при переходе по ссылке с деталки с сайта
				if ("undefined" === typeof ob) {
					return false;
				}
				var request = ob;
				Y.listScreen.show();
				Y.listLoader.show(ob);

				$.ajax({
					url: "/catalog/search/",
					data: {"AJAX_CALL": "Y", "request_type": "find_branches", "request": request},
					dataType: 'json',
					success: function(json){
						if (Y.NotEmpty(json)) {
							if (ob.page > 1) {
								json.items = $.merge(Y.json.items, json.items);
							}

							Y.Build('list', json);
							Y.listLoader.hide(ob);
							Y.SaveOfficesArray(json);
							Y.SaveObjectsArray(json);
							Y.CleanAll().BuildAll();
							ob.load = 'bottom';
							setNextPageReguest(ob, "findBranch");

							if (json.items.length == 1 && json.items[0].type === "company") {
								var _id = json.items[0].id;
								setTimeout(function() {
									showDetail($("#company"+_id+" a")[0]);
								}, 500);
							}
						} else {
							ob.load = '';
							Y.listLoader.hide(ob);
							setNextPageReguest({}, "");
						}
					}
				});
			}

			function findOffice(ob) { // при переходе по ссылке (булавочной) с сайта
				if ("undefined" === typeof ob) {
					return false;
				}
				var request = ob;
				Y.listScreen.show();
				Y.listLoader.show(ob);

				$.ajax({
					url: "/catalog/search/",
					data: {"AJAX_CALL": "Y", "request_type": "find_offices", "request": request},
					dataType: 'json',
					success: function(json){
						if (Y.NotEmpty(json)) {
							if (ob.page > 1) {
								json.items = $.merge(Y.json.items, json.items);
							}

							Y.Build('list', json);
							Y.listLoader.hide(ob);
							Y.SaveOfficesArray(json);
							Y.SaveObjectsArray(json); // тоже лишнее
							Y.CleanAll().BuildAll();
							ob.load = 'bottom';
							setNextPageReguest(ob, "findOffice"); // конечно не надо, но не удалять же

							if (json.items.length == 1 && json.items[0].type === "company") { // это всегда true
								var _id = json.items[0].id;
								setTimeout(function() {
									showDetail($("#company"+_id+" a")[0], {id_office: ob.id_office});
									// showMarker($("#company"+_id+" a")[0].id, ob.id_office);
								}, 500);
							}
						} else {
							ob.load = '';
							Y.listLoader.hide(ob);
							setNextPageReguest({}, "");
						}
					}
				});
			}

			function showSearch(ob) {
				//закрываем main Y
				Y.mainScreen.hide();
				Y.listScreen.show();
				//открываю окно списка Y
				Y.listLoader.show(ob);
				//показываю в нем лоадер в списка Y.listLoader.show();

				var searching = $('#what').val();
				var request = {search: searching };
				if ("undefined" !== typeof ob) {
					$.extend(request,ob);
				} else {
					ob = {page:1};
				}
				$.ajax({
					url: "/catalog/search/",
					// data: {"AJAX_CALL": "Y", "request_type": "what_where_points", "request": request},
					data: {"AJAX_CALL": "Y", "request_type": "search", "request": request},
					dataType: 'json',
					success: function(json){
						if (Y.NotEmpty(json)) {
							if (ob.page > 1) {
								json.items = $.merge(Y.json.items, json.items);
							}

							Y.Build('list', json);
							Y.listLoader.hide(ob);
							Y.SaveOfficesArray(json);
							Y.SaveObjectsArray(json);
							Y.CleanAll().BuildAll();
							ob.load = 'bottom';
							setNextPageReguest(ob, "showSearch");

							if (json.items.length == 1 && json.items[0].type === "company") {
								var _id = json.items[0].id;
								setTimeout(function() {
									if (Object.keys(json.items[0].coords).length == 1) {
										var params = {id_office: Object.keys(json.items[0].coords)[0]};
										showDetail($("#company"+_id+" a")[0], params);
									} else {
										showDetail($("#company"+_id+" a")[0]);
									}
								}, 500); // задержка чтобы tmpl успел отработать, по хорошему надо как-то синхронно делать
							}
						} else {
							Y.CleanAll();
							ob.load = '';
							Y.listLoader.hide(ob);
							setNextPageReguest({}, "");
						}
					}
				});
			};
			// разделы
				function showCat(ob) {
					//закрываем main Y
					Y.mainScreen.hide();
					//открываю окно списка Y
					Y.listScreen.show();
					//показываю в нем лоадер в списка Y.listLoader.show();
					Y.listLoader.show(ob);
					//делаю запрос аяксом до сервера c передачей ID категории, в овтете приходит json со данными списка

					if ("undefined" === typeof ob.page) {
						ob.page = 1;
					}

					var request = {
						id: ob.id,
						page: ob.page
					};
					$.ajax({
						url: "/catalog/search/",
						data: {"AJAX_CALL": "Y", "request_type": "category_points", "request": request},
						dataType: 'json',
						success: function(json){
							if (Y.NotEmpty(json)) {
								var jsonForList = json;
								if (ob.page > 1) {
									json.items = $.merge(Y.json.items, json.items);
									json.empty = 'false';
								}

								Y.Build('list', jsonForList);
								Y.listLoader.hide(ob);
								Y.SaveOfficesArray(json);
								Y.CleanAll().BuildAll();
								ob.load = 'bottom';
								setNextPageReguest(ob, "showCat");
							} else {
								ob.load = '';
								Y.listLoader.hide(ob);
								setNextPageReguest({}, "");
							}
						}
					});
				};
				function showAllCat() {
					Y.mainScreen.hide();
					Y.listScreen.show();
					Y.listLoader.show({});

					var to_data = {
						action: "getSubsections",
						parametrs: {
							SECTION_ID: 0
						}
					};
					
					$.ajax({
						url: '/ajax/sections.list.php',
						type: 'POST',
						dataType: 'json',
						data: to_data,
						success: function(data){
							if (data["Errors"].length == 0) {
								var json = data["Result"];

								var type = 'list_cat';
								Y.Build('list_cat', json);

								Y.SaveOfficesArray(json);
								Y.CleanAll();
								Y.listLoader.hide({load: ''});
								setNextPageReguest({}, "");
							}
						}
					});
				};
				function showCatDetail(obj,arData) {
					Y.itemList.showLoader(obj);
					var to_data = {
						action: "getSubsections",
						parametrs: {
							SECTION_ID: arData.section
						}
					};
					
					$.ajax({
						url: '/ajax/sections.list.php',
						type: 'POST',
						dataType: 'json',
						data: to_data,
						success: function(data){
							if (data["Errors"].length == 0) {
								var json = data["Result"];
								var type = 'item-cat_detail';
								Y.ItemList(obj).Build(type, json);
								Y.itemList.hideLoader(obj);
							}
						}
					});
				};
				function clickMapShowDetail(id, office_id) { // когда деталку открывает клик по маркеру
					Y.listScreen.show();
					Y.itemList.showLoader(id);
					var request = {
						id_branch: id
					};

					$.ajax({
						url: "/catalog/search/",
						data: {"AJAX_CALL": "Y", "request_type": "branch_detail", request: request},
						dataType: 'json',
						success: function(json){
							Y.itemList.hideLoader(id);
							Y.ItemList(id).Build('item-detail', json);
							setTimeout(function(){
								Y.HighlightOffice.on(office_id);
							}, 1000);
							
						}
					});
				};
			function showMarker(branch, id) {
				Y.CleanAll().BuildAll().HighlightOne(branch, id);
				Y.HighlightOffice.on(id);
			};
			// клик по автокомплиту
				function showType(item){
					// вызвать в autocomplete.select
					// выбирает что показывать из строки поиска
						switch (item.type){
							case 'section':
								showCat({id: item.id});
								break;
							case 'firm':
								// значение выставляется позже, так что переписываем строку поиска для функции
								showSearch({search: item.value, item: item});
								break;
							default:
								getGeoDetailAndShowPopup(item);
								break;
						}
					// console.log(item);
				};
			// попап
				// получаем данные для попапа
				function getGeoDetailAndShowPopup(ob) {
					var request = {
						type: ob.type,
						id: ob.id
					};
					$.ajax({
						url: "/catalog/search/",
						data: {"AJAX_CALL": "Y", "request_type": "object_popup", "request": request},
						type: 'POST',
						dataType: 'json',
						success: function(data){
							Y.CleanAll();
							Y.listScreen.hide();
							Y.SaveObjectsArray(data);
							var json = Y.arrGeo[ob.type][ob.id];
							var latlng = json.latlng;
							Y.Build('popup', json).BuildPopup(latlng);
						}
					});
				};
				// строим попап названия улицы, дома
					function showPopup(ob) {
						var json = Y.arrGeo[ob.type][ob.id];
						var latlng = json.latlng;
						Y.Build('popup', json).BuildPopup(latlng);
					};

				// строим попап дома ПО КЛИКУ НА КАРТУ
					function showPoint(ob) {
						//закрываем main Y
						// Y.mainScreen.hide();
						// Y.listScreen.hide();

						//делаю запрос аяксом до сервера c передачей ID дома, в овтете приходит json со данными списка
						$.ajax({
							url: "/catalog/search/",
							data: { "AJAX_CALL": "Y",
								"request_type": "point_map",
								"request": ob.address
							},
							type: 'POST',
							dataType: 'json',
							success: function(data){
								if (!Object.keys(data).length ) return;
								Y.CleanAll();
								var latlng = [ob.lat ,ob.lon];
								data.items[0].coords = latlng;
								var objType = data.items[0].type;
								var objId = data.items[0].id;

								Y.SaveObjectsArray(data);
								var json = Y.arrGeo[objType][objId];
								Y.Build('popup', json).BuildPopup(latlng);
							}
						});
					};
			Y.BindEvent(); // нужно вызывать в конце, слушает события
		</script>
	</body>
</html>
