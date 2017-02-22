var sections = {
	items : [
		{
			id: 123,
			name: 'Строительство',
			hasSubsections: true // содержит другие разде
		},
		{
			id: 8076,
			name: 'Кафе',
			hasSubsections: false // содержит уже фирмы
		},
	]
};
var requestDataList = { // на энтер в поиске
	items:[
		{
			id:123,
			type: 'company',
			name:'Компания 1',
			coords:[
				{i: [56.0607, 92.8710], of_id: 0},
				{i: [56.0707, 92.8735], of_id: 1},
				{i: [56.0307, 92.8702], of_id: 2},
			],
		},
		{
			title: 'Газеты Красноярский Рабочий проспект',
			type: 'street',
			coords: [56.0307, 92.8702],
		},
		{
			id: 12345, // ид дома, не DOMа
			//56.010569, 92.852545
			coords: [56.0307, 92.8702],
			title: 'Газеты Красноярский Рабочий проспект, 160 ст4',
			title_desc: 'Южный Берег, Свердловский район, г. Красноярск, 660064',
			building_type: 'Административное здание, 3 этажа',
			type: 'house',
			branches: '15'
		},
		{
			title: 'Газеты Красноярский Рабочий проспект',
			type: 'Улица',
			coords: [56.0307, 92.8702],
		},
		{
			id:124,
			name:'Компания 2',
			coords:[
				{i: [56.0607, 92.8730], of_id: 0},
				{i: [56.0107, 92.8735], of_id: 1},
				{i: [56.0307, 92.8762], of_id: 2},
			],
		},
		{
			id:125,
			name:'Компания 3',
			coords:[
				{i: [56.0607, 92.8730], of_id: 0},
				{i: [56.0107, 92.8795], of_id: 1},
				{i: [56.0707, 92.8762], of_id: 2},
			],
		},
		{
			id:126,
			name:'Компания 4',
			coords:[
				{i: [56.0607, 92.8710], of_id: 0},
				{i: [56.0107, 92.8795], of_id: 1},
				{i: [56.0707, 92.8762], of_id: 2},
			],
		},
		{
			id:127,
			name:'Компания 5',
			coords:[
				{i: [56.0607, 92.8710], of_id: 0},
				{i: [56.0107, 92.8795], of_id: 1},
				{i: [56.0707, 92.8762], of_id: 2},
			],
		},
		{
			id:128,
			name:'Компания 6',
			coords:[
				{i: [56.0607, 92.8710], of_id: 0},
				{i: [56.0807, 92.8795], of_id: 1},
				{i: [56.0707, 92.8712], of_id: 2},
			],
		},
	]
};
var requestDataDetail = {	// на нажатие на фирму	
	id:123,
	name: 'Компания 1',
	tel: '+7 (391) 266&ndash;87&ndash;13',
	www:[
		{ i:'url1', href: 'http://krasnoyarsk.kkm.ru'},
		{ i:'url2', href: 'http://krasnoyars.kkm.ru'}
	],
	email:[
		{i: 'mail1', href: 'mailto:krsk@1cbit.ru'},
		{i: 'mail2', href: 'mailto:krsk@1cbit.ru'}	
	],
	rubrics:[
		{name:'Рубрика 1', url:'#1'},
		{name:'Рубрика 2', url:'#2'},
		{name:'Рубрика 3', url:'#3'}
	],
	offices:[
		{
			// branch:123,
			id:0,
			adres:'Карла Либнехта 123',
			desc: 'ТК Эверест, 6-й этаж',
			tel: '+7 (391) 266&ndash;87&ndash;13',
			email:[
				{i: 'mail1', href: 'mailto:krsk@1cbit.ru'},	
				{i: 'mail1', href: 'mailto:krsk@1cbit.ru'}
			],
			worktime: [
				{ day: 'Понедельник', t_from: '10:00', t_to: '20:00', status_on: "icon _card_worktime-open", status: 'Открыто', status_to: '10:00', dinner: ''}
			],
			week: [
				{day: 'пн', t_from: '10:00', t_to: '20:10', active: true},
				{day: 'вт', t_from: '10:00', t_to: '20:10', active: ''},
				{day: 'ср', t_from: '10:00', t_to: '20:10', active: ''},
				{day: 'чт', t_from: '10:00', t_to: '20:15', active: ''},
				{day: 'пт', t_from: '10:00', t_to: '23:10', active: ''},
				{day: 'сб', t_from: '10:00', t_to: '22:10', active: ''},
				{day: 'вс', t_from: '10:00', t_to: '21:10', active: ''},
			]
		},
		{
			// branch:123,
			id:1,
			adres:'Карла Маркса 123',
			desc: 'ТК Эверест, 6-й этаж',
			tel: '+7 (391) 266&ndash;87&ndash;13',
			email:[
				{i: 'mail1', href: 'mailto:krsk@1cbit.ru'}
			],
			worktime: [
				{ day: 'Вторник', t_from: '10:00', t_to: '20:00', status_on: "icon _card_worktime-close", status: 'Закрыто', status_to: '10:00', dinner: '' }
			],
			week: [
				{day: 'пн', t_from: '10:00', t_to: '20:10', active: ''},
				{day: 'вт', t_from: '10:00', t_to: '20:10', active: true},
				{day: 'ср', t_from: '10:00', t_to: '20:10', active: ''},
				{day: 'чт', t_from: '10:00', t_to: '20:15', active: ''},
				{day: 'пт', t_from: '10:00', t_to: '23:10', active: ''},
				{day: 'сб', t_from: '10:00', t_to: '22:10', active: ''},
				{day: 'вс', t_from: '10:00', t_to: '21:10', active: ''},
			]
		},
		{
			id:2,
			// branch:123,
			adres:'Карла Логерфельда 123',
			desc: 'ТК Эверест, 6-й этаж',
			tel: '+7 (391) 266&ndash;87&ndash;13',
			email:[
				{i: 'mail1', href: 'mailto:krsk@1cbit.ru'}
			],
			worktime: [
				{ day: 'Среда', t_from: '10:00', t_to: '20:00', status_on: "icon _card_worktime-open", status: 'Открыто', status_to: '10:00', dinner: '' }
			],
			week: [
			//MKMatriX смотри сюды
				// {day: 'пн', t_from: '10:00', t_to: '20:10', active: true},
				// {day: 'вт', t_from: '10:00', t_to: '20:10', active: false},
				{day: 'пн', t_from: '10:00', t_to: '20:10', active: ''},
				{day: 'вт', t_from: '10:00', t_to: '20:10', active: ''},
				{day: 'ср', t_from: '10:00', t_to: '20:10', active: ''},
				{day: 'чт', t_from: '10:00', t_to: '20:15', active: ''},
				{day: 'пт', t_from: '10:00', t_to: '23:10', active: true},
				{day: 'сб', t_from: '10:00', t_to: '22:10', active: ''},
				{day: 'вс', t_from: '10:00', t_to: '21:10', active: ''},
			]
		}

	]	
};
var requestPointMap = {
	item: [
		{
			// id: 12345, // ид дома, не DOMа
			//56.010569, 92.852545
			title: 'Газеты Красноярский Рабочий проспект, 160 ст4',
			title_desc: 'Южный Берег, Свердловский район, г. Красноярск, 660064',
			building_type: 'Административное здание, 3 этажа',
			branches: '15'
		}
	]
};

var requestStreetMap = {
	item: [
		{
			// id: 12345,
			// coords:[56.3074196, 92.870169],
			title: 'Газеты Красноярский Рабочий проспект',
			type: 'Улица'
		}
	]
};
// var siteJSON = {
// 	items : [
// 		{
// 			// 12345:
// 			id:12345,
// 			name: "субито",
// 			offices: {
// 				{
// 					id: 54322345,
// 					coords: [56,96],
// 					title: "железнодорожников 18в",
// 				},
// 				{
// 					id: 5123,
// 					coords: [56.13,96.654],
// 					title: "другой адрес",
// 				},
// 			},
// 		},
// 		{
// 			// 15:
// 			id:15,
// 			name: "KFC",
// 			offices: {
// 				{
// 					id: 55,
// 					coords: [56,96],
// 					title: "железнодорожников 1864864",
// 				},
// 				{
// 					id: 5123,
// 					coords: [56.13,96.654],
// 					title: "другой адрес",
// 				},
// 			},
// 		},
// 	]
// };