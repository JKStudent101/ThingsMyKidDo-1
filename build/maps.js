let markers = [];
let eventMarkers = [];
let coords;

function initMap() {
	// Map options
	var options = {
		zoom: 6,
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

	// load events on search click event
	$('#getData').click((e) => {
		// get user input event or all event

		let tagOption = $('#searchOption').val(); // hockey
		let userInput = $('#SearchBar').val(); // event

		const requestOne = '/event/' + $('#SearchBar').val();
		const requestAll = '/event/getall';

		const requestAllTags = '/event/search/' + tagOption;

		e.preventDefault();
		function a1() {
			$.ajax({
				// url: $('#SearchBar').val().length > 0 ? requestOne : requestAll,
				url: '/event/getall',
				type: 'GET',
				async: false,
				dataType: 'json',
				success: (data) => {
					$('#events').empty();
					if (tagOption == 'getAllEvents' && userInput.length == 0) {
						$.map(data, function(value, i) {
							// console.log(value);
							$('#events').append(
								'<span>' +
									'<h3>' +
									// v.name
									value.name +
									'</h3>' +
									'<p>' +
									value.description +
									'</p>' +
									'</span>'
							);

							// push values/events into the markers
							markers.push({
								content: value.description,
								coords: {
									lat: parseFloat(value.lat),
									lng: parseFloat(value.lng)
								}
							});
						});

						// add markers
						for (var i = 0; i < markers.length; i++) {
							// Add markers
							addMarker(markers[i]);
						}
					}
					// $('#getData').attr('disabled', false);

					a2();
				}
			});
		}

		function a2() {
			$.ajax({
				url: requestAllTags,
				type: 'GET',
				dataType: 'json',
				success: (tagEvent) => {
					$.map(tagEvent, function(value, i) {
						if (tagOption == value.category) {
							$('#events').append(
								'<span>' +
									'<h3>' +
									// v.name
									value.name +
									'</h3>' +
									'<p>' +
									value.description +
									'</p>' +
									'</span>'
							);
							if (marker.length > 0) {
							}
							eventMarkers.push({
								content: value.description,
								coords: {
									lat: parseFloat(value.lat),
									lng: parseFloat(value.lng)
								}
							});
						}
					});

					for (var i = 0; i < eventMarkers.length; i++) {
						// Add markers
						addMarker(eventMarkers[i]);
					}
				}
			});
		}
		a1();
		$.when(a1, a2).done(function(r1, r2) {});

		// Add Marker Function
		function addMarker(props) {
			// console.log(props);
			var marker = new google.maps.Marker({
				position: props.coords,
				map: map //icon:props.iconImage
			});

			// Check for customicon
			if (props.iconImage) {
				// Set icon image
				marker.setIcon(props.iconImage);
			}
			marker.setMap(map);

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
