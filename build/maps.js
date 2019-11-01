let markers = [];
let eventMarkers = [];
let coords;
let marker;
let map;
let gmarkers = [];
let infowindow;
let filteroption="";
let tags = [];
let tagsisclicked = [];
let user_id = null;
$.ajax({
	url: '/event/gettags', 
	type: 'GET',
	async: false,
	dataType: 'json',
	success: (data) => {	
		for (var i = 0; i < data.length; i++) {
			tags.push(data[i].name);
		}
	}
})

function initMap() {
	// Map options
	let options = {
		zoom: 7,
		// center: { lat: 49.4928, lng: -117.2948 },

		mapTypeControlOptions: {
			mapTypeIds: [ 'styled_map' ]
		}
	};

	let styledMapType = new google.maps.StyledMapType([
		{ elementType: 'geometry', stylers: [ { color: '#ebe3cd' } ] },
		{ elementType: 'labels.text.fill', stylers: [ { color: '#523735' } ] },
		{ elementType: 'labels.text.stroke', stylers: [ { color: '#f5f1e6' } ] },
		{
			featureType: 'administrative',
			elementType: 'geometry.stroke',
			stylers: [ { color: '#c9b2a6' } ]
		},
		{
			featureType: 'administrative.land_parcel',
			elementType: 'geometry.stroke',
			stylers: [ { color: '#dcd2be' } ]
		},
		{
			featureType: 'administrative.land_parcel',
			elementType: 'labels.text.fill',
			stylers: [ { color: '#ae9e90' } ]
		},
		{
			featureType: 'landscape.natural',
			elementType: 'geometry',
			stylers: [ { color: '#dfd2ae' } ]
		},
		{
			featureType: 'poi',
			elementType: 'geometry',
			stylers: [ { color: '#dfd2ae' } ]
		},
		{
			featureType: 'poi',
			elementType: 'labels.text.fill',
			stylers: [ { color: '#93817c' } ]
		},
		{
			featureType: 'poi.park',
			elementType: 'geometry.fill',
			stylers: [ { color: '#a5b076' } ]
		},
		{
			featureType: 'poi.park',
			elementType: 'labels.text.fill',
			stylers: [ { color: '#447530' } ]
		},
		{
			featureType: 'road',
			elementType: 'geometry',
			stylers: [ { color: '#f5f1e6' } ]
		},
		{
			featureType: 'road.arterial',
			elementType: 'geometry',
			stylers: [ { color: '#fdfcf8' } ]
		},
		{
			featureType: 'road.highway',
			elementType: 'geometry',
			stylers: [ { color: '#f8c967' } ]
		},
		{
			featureType: 'road.highway',
			elementType: 'geometry.stroke',
			stylers: [ { color: '#e9bc62' } ]
		},
		{
			featureType: 'road.highway.controlled_access',
			elementType: 'geometry',
			stylers: [ { color: '#e98d58' } ]
		},
		{
			featureType: 'road.highway.controlled_access',
			elementType: 'geometry.stroke',
			stylers: [ { color: '#db8555' } ]
		},
		{
			featureType: 'road.local',
			elementType: 'labels.text.fill',
			stylers: [ { color: '#806b63' } ]
		},
		{
			featureType: 'transit.line',
			elementType: 'geometry',
			stylers: [ { color: '#dfd2ae' } ]
		},
		{
			featureType: 'transit.line',
			elementType: 'labels.text.fill',
			stylers: [ { color: '#8f7d77' } ]
		},
		{
			featureType: 'transit.line',
			elementType: 'labels.text.stroke',
			stylers: [ { color: '#ebe3cd' } ]
		},
		{
			featureType: 'transit.station',
			elementType: 'geometry',
			stylers: [ { color: '#dfd2ae' } ]
		},
		{
			featureType: 'water',
			elementType: 'geometry.fill',
			stylers: [ { color: '#b9d3c2' } ]
		},
		{
			featureType: 'water',
			elementType: 'labels.text.fill',
			stylers: [ { color: '#92998d' } ]
		}
	]);

	// New map
	let map = new google.maps.Map(document.getElementById('map'), options);

	// info initialize
	infoWindow = new google.maps.InfoWindow({});
	
	// load events on search button click event
	$('#getData').click((e) => {
		e.preventDefault();
		let tagsisclicked=[]
		// get user input event or all event
		let tagOption = $('#searchOption').val(); // hockey
		let userInput = $('#SearchBar').val().toLowerCase(); // eventname
		
		for (var i = 0; i < tags.length; i++) {
			if($("#"+tags[i]+"").prop('checked')){
				tagsisclicked.push(tags[i]);
			}
		}
		
		const requestAll = '/event/getall';
		switch(userInput){
			case "":
				if($('#allevents').prop('checked')){
					filteroption = "getallE";
				} 
				else{
					filteroption = "getOneTag";
				}
				break;

			default:
				if($('#allevents').prop('checked')){
					filteroption = "getWithKeyW";
				} else {
					filteroption = "getWithKey&Tag";
				}
				
				
		}

		$.ajax({
			url: requestAll, //event/getall route
			type: 'GET',
			async: false,
			dataType: 'json',
			success: (data) => {
				
				$('#events').empty();
				if (filteroption == "getallE") {
					if (gmarkers.length > 0) {
						removeMarkers();
					}
					$.map(data, function(value, i) {
						$('#events').append(
							"<form action='/savewishlist' method='post'><span>" +
								'<h3>' +
								// v.name
								value.name +
								'</h3>' +
								"<input class='invis' name='eventid' type='text' value=" + value.event_id + ">" +
								'<p>' +
								value.description +
								'</p>' +
								'</span>' +
								"<button type='submit'>add to wishlist </button></form>"
						);						// push event vlaues into the markers
						markers.push({
							content: value.description,
							coords: {
								lat: parseFloat(value.lat),
								lng: parseFloat(value.lng)
							}
						});
						
					});
				}
				else if(filteroption== "getOneTag") {
					if (gmarkers.length > 0) {
						removeMarkers();
					}
					$.map(data, function(value, i) {
						for (var i = 0; i < tagsisclicked.length; i++) {
							if (tagsisclicked[i] == value.category) {
								$('#events').append(
									"<form action='/savewishlist' method='post'><span>" +
									'<h3>' +
									// v.name
									value.name +
									'</h3>' +
									"<input class='invis' name='eventid' type='text' value=" + value.event_id + ">" +
									'<p>' +
									value.description +
									'</p>' +
									'</span>' +
									"<button type='submit'>add to wishlist </button></form>"
								);
								markers.push({
									content: value.description,
									coords: {
										lat: parseFloat(value.lat),
										lng: parseFloat(value.lng)
									}
								});
								
							}
						}
					});

				}
				else if (filteroption== "getWithKeyW") {
					if (gmarkers.length > 0) {
						removeMarkers();
					}
					$.map(data, function(value, i) {
						if (value.name.toLowerCase().includes(userInput)) {
							$('#events').append(
								"<form action='/savewishlist' method='post'><span>" +
								'<h3>' +
								// v.name
								value.name +
								'</h3>' +
								"<input class='invis' name='eventid' type='text' value=" + value.event_id + ">" +
								'<p>' +
								value.description +
								'</p>' +
								'</span>' +
								"<button type='submit'>add to wishlist </button></form>"
							);
							markers.push({
								content: value.description,
								coords: {
									lat: parseFloat(value.lat),
									lng: parseFloat(value.lng)
								}
							});
							
						}
					});
				} else {
					if (gmarkers.length > 0) {
						removeMarkers();
					}
					$.map(data, function(value, i) {
						for (var i = 0; i < tagsisclicked.length; i++) {
							if (tagsisclicked[i] == value.category && value.name.toLowerCase().includes(userInput)) {
								$('#events').append(
									"<form action='/savewishlist' method='post'><span>" +
									'<h3>' +
									// v.name
									value.name +
									'</h3>' +
									"<input class='invis' name='eventid' type='text' value=" + value.event_id + ">" +
									'<p>' +
									value.description +
									'</p>' +
									'</span>' +
									"<button type='submit'>add to wishlist </button></form>"
								);
								
								markers.push({
									content: value.description,
									coords: {
										lat: parseFloat(value.lat),
										lng: parseFloat(value.lng)
									}
								});
								// add all events to the marker
							}

						}
					});
				}
				for (let i = 0; i < markers.length; i++) {
					// Add markers
						addMarker(markers[i]);
				}
			}
		});
		
		markers = [];

		function addEventstoMarkers(eventarray) {
			for (let i = 0; i < eventar.length; i++) {
				// Add markers
				addMarker(markers[i]);
			}
		}
		// remove global gmarker array
		function removeMarkers() {
			for (i = 0; i < gmarkers.length; i++) {
				gmarkers[i].setMap(null);
			}
			gmarkers = [];
		}
		function showgMarkers() {
			for (i = 0; i < gmarkers.length; i++) {
				gmarkers[i].setMap(map);
			}
		}

		// Add Marker Function
		function addMarker(props) {
			// console.log(props);
			let marker = new google.maps.Marker({
				position: props.coords,
				map: map, //icon:props.iconImage
				content: props.content
			});

			// push marker to global gmarker array
			gmarkers.push(marker);

			// Check for customicon
			if (props.iconImage) {
				// Set icon image
				marker.setIcon(props.iconImage);
			}

			// Check content
			if (props.content) {
				// infoWindow = new google.maps.InfoWindow({
				// 	content: props.content
				// });
				// console.log(infoWindow);
				marker.addListener('click', function() {
					infoWindow.setContent(marker.content);
					infoWindow.open(map, marker);
				});
			}
		}
		
	});

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			initialLocation = new google.maps.LatLng(
				position.coords.latitude,
				position.coords.longitude
			);
			map.setCenter(initialLocation);
		});
	}

	map.mapTypes.set('styled_map', styledMapType);
	map.setMapTypeId('styled_map');
}
