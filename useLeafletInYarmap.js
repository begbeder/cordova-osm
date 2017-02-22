Yarmap.prototype.ScaleMarker
	map.getSize();
	map.panTo({lat: this.centerlat, lng: this.centerlng, animation: false});  // mapbox panTo  (lnglat, [options], [eventData])
	map.fitBounds(this.markers.getBounds(), {paddingTopLeft: [467, 0]}); // mapbox fitBounds  (bounds, [options], [eventData])

Yarmap.prototype.BuildAll
	this.markers = new L.FeatureGroup();
	map.setZoom(13, {animate: false}); // mapbox setZoom  (zoom, [eventData])
	var marker = L.marker(latlng, {icon: redIcon, id: id, office_id: office_id});
	this.markers.addLayer(marker); // mapbox addLayer  (layer, [before])
	// using mapbox
	/* clustering markers 
		https://www.mapbox.com/help/markers/
	*/



Yarmap.prototype.BuildOne
	this.markers = new L.FeatureGroup();
	map.panTo(latlng, {animate:false}).setZoom(13, {animate: false});
	map.fitBounds(this.markers.getBounds()); // getBounds  ()

Yarmap.prototype.BuildPopup
	this.popup = new L.popup().setLatLng(latlng).setContent(this.get); 
	// в приложении не будет всплывашки, будет слой внизу страницы со всеми данными
	// в точке карты будет отображаться маркер
	// https://www.mapbox.com/mapbox-gl-js/api/#Popup
	// https://www.mapbox.com/mapbox-gl-js/api/#Marker

Yarmap.prototype.resize
	this.map.invalidateSize();
	// mapbox default resize true


// minimap api
var redIcon = L.icon({
		iconUrl: '/online/js/templates/marker-icon_red.png',
		iconSize: [34, 34],
		iconAnchor: [17, 34],
	});
L.control.zoom({position:'topright'}).addTo(minimap);

marker.bindPopup(mess);

savedMarker.closePopup();
// Init map
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


	



