// <script id="asd2" type="text/x-jquery-tmpl">
	<div class="item-card__tel">
		<i class="icon _card_bigtel"></i>
		${tel}
	</div>
	<div class="item-card__links">
		{{each www}}
			<div><i class="icon _card_website"></i> <a href="${href}"> ${i} </a></div>
		{{/each}}
		{{each email}}																		
		<div><i class="icon _card_email"></i> <a href="${href}"> ${i} </a></div>
		{{/each}}
	</div>
	<div class="item-card__rubric">
		<b>Рубрики:</b><br/>
		{{each rubrics}}
			<a href="${url}">${name}</a> / 
		{{/each}}
	</div>
	<!-- категории -->
	<div class="item-card__offices">
		{{each offices}}
		<div class="item-card__offices__office">
			<i class="icon _card_adres"></i>
			<div class="office__adres">
				<a href="#" id="${id}" onclick="gotoAdres([${coords}])" >${adres}</a><br/>
				${desc}<br/>
			</div>
			<div class="office__tels">
				<div><i class="icon _card_tel"></i>${tel}</div>
			</div>
			<div class="office__emails">
			{{each email}}	
				<div><i class="icon _card_email"></i> <a href="${href}"> ${i} </a></div>
			{{/each}}
			</div>
			<div class="office__worktime">
				{{each worktime}}
				<i class="${status_on}"></i> ${status} до ${status_to}. ${day}: ${t_from} - ${t_to} <span class="worktime_more">(подробнее)</span><br/>
				{{/each}}
				<div id="worktime-table_more" class="worktime-table_more"></div>
			</div>
		</div>
		{{/each}}
	</div>
// </script>