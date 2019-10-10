$(document).ready(() => {
	// to get events filter,
	// const soething = '/events/id' + $(inputid).val();
	let data1 = [];

	// $('#getallevents').click(() => {
	// 	// const requestOne = 'event/' + $('#SearchBar').val();
	// 	// console.log(requestURL);
	// 	$.ajax({
	// 		url: requestURL,
	// 		type: 'GET',
	// 		dataType: 'json',
	// 		success: (data) => {
	// 			$.each(data, function(k, v) {
	// 				$('#events').append(
	// 					'<span>' +
	// 						'<h3>' +
	// 						v.eventName +
	// 						'</h3>' +
	// 						'<p>' +
	// 						v.eventDescription +
	// 						'</p>' +
	// 						'</span>'
	// 				);
	// 			});
	// 		}
	// 	});
	// });
	$('#getallevents').click((e) => {
		// get user input
		const requestOne = 'event/' + $('#SearchBar').val();
		const requestAll = 'event/getall';
		e.preventDefault();
		$.ajax({
			// url: requestAll
			url: $('#SearchBar').val().length > 0 ? requestOne : requestAll,
			type: 'GET',
			dataType: 'json',
			success: (data) => {
				$.each(data, function(k, v) {
					data1.push(v);
					$('#events').append(
						'<span>' +
							'<h3>' +
							v.eventName +
							'</h3>' +
							'<p>' +
							v.eventDescription +
							'</p>' +
							'</span>'
					);
				});
				location.reload();
			}
		});
	});
});

function initMap() {
	// Map options
	var options = {
		zoom: 9,
		// center: { lat: 49.4928, lng: -117.2948 },

		mapTypeControlOptions: {
			mapTypeIds: [ 'styled_map' ]
		}
	};

	var styledMapType = new google.maps.StyledMapType([
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
	var map = new google.maps.Map(document.getElementById('map'), options);
	// Array of markers
	var markers = [
		{
			coords: { lat: 49.49656, lng: -117.29391 },
			iconImage:
				'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
			content:
				'<div id="content">' +
				'<div id="siteNotice">' +
				'</div>' +
				'<h1 id="firstHeading" class="firstHeading">Thermography </h1>' +
				'<div id="bodyContent">' +
				'<p><b>Event 1 </b>, Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>' +
				'<p>Attribution: Event 1 , <br/> <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
				'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
				'</div>' +
				'</div>'
		},
		{
			coords: { lat: 49.512343, lng: -117.263926 },
			// 49.512343, -117.263926
			iconImage:
				'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
			content:
				'<div id="content">' +
				'<div id="siteNotice">' +
				'</div>' +
				'<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
				'<div id="bodyContent">' +
				'Event Details' +
				'<p><b>Doukhobor Discovery Centre</b>, Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>' +
				'<p>Attribution: Doukhobor Discovery Centre, <br/> <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
				'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
				'</div>' +
				'</div>'
		},
		{
			coords: { lat: 49.29687, lng: -117.63619 },
			content:
				'<div id="content">' +
				'<div id="siteNotice">' +
				'</div>' +
				'<h1 id="firstHeading" class="firstHeading">Ferment and Feast</h1>' +
				'<div id="bodyContent">' +
				'Event Details' +
				'<p><b>Ferment and Feast</b>, Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>' +
				'<p>Attribution: Doukhobor Discovery Centre, <br/> <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
				'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
				'</div>' +
				'</div>'
		}
	];

	// Loop through markers
	for (var i = 0; i < markers.length; i++) {
		// Add marker
		addMarker(markers[i]);
	}

	// Add Marker Function
	function addMarker(props) {
		var marker = new google.maps.Marker({
			position: props.coords,
			map: map //icon:props.iconImage
		});

		// Check for customicon
		if (props.iconImage) {
			// Set icon image
			marker.setIcon(props.iconImage);
		}

		// Check content
		if (props.content) {
			var infoWindow = new google.maps.InfoWindow({
				content: props.content
			});

			marker.addListener('click', function() {
				infoWindow.open(map, marker);
			});
		}
	}
	// get current location
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
