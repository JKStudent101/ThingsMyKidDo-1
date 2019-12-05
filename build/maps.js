let markers = [];
let eventMarkers = [];

// initializers
let coords;
let marker;
let map;
let infowindow;

let gmarkers = [];
let filteroption = '';
let tags = [];
let tagsisclicked = [];
let child_name = {};
const getCustomMarkers = (tags) => {
	// imgURLs.push('/src/customIcons/' + tags.toLowerCase() + '_pin.png')
	return '/src/customIcons/' + tags.toLowerCase() + '_pin.png';
	// return tags.toLowerCase();
};
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
});
$.ajax({
	url: '/event/getnames',
	type: 'GET',
	async: false,
	dataType: 'json',
	success: (data) => {
		for (var i = 0; i < data.length; i++) {
			child_name[data[i].child_nickname] = data[i].child_nickname;
		}
	}
});


function openpopupwindow(id) {
	if (Object.keys(child_name).length < 1) {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'You need create child profile first to use wishlist function',
			footer: 'Why do I have this issue?'
		})
	} else {
		Swal.fire({
			title: 'This event is for',
			input: 'select',
			inputOptions: child_name,
			icon: 'info',
			inputPlaceholder: 'Select a child',
			showCancelButton: true,
			inputValidator: (value) => {
				console.log(value)
				return new Promise((resolve) => {

					if (value === '') {
						resolve('You need to select a child :)')
					} else {
						resolve()
					}
				})
			}
		}).then((result) => {
			if (result.value) {
				document.getElementById(id).value = result.value;
				document.getElementById(id.substring(5)).submit()
			}
		})
	}
}

function initMap() {
	// Map options
	let options = {
		zoom: 9,
		// center: { lat: 49.4928, lng: -117.2948 },

		mapTypeControlOptions: {
			mapTypeIds: ['styled_map']
		}
	};

	let styledMapType = new google.maps.StyledMapType([
		{ elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
		{ elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
		{ elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
		{
			featureType: 'administrative',
			elementType: 'geometry.stroke',
			stylers: [{ color: '#c9b2a6' }]
		},
		{
			featureType: 'administrative.land_parcel',
			elementType: 'geometry.stroke',
			stylers: [{ color: '#dcd2be' }]
		},
		{
			featureType: 'administrative.land_parcel',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#ae9e90' }]
		},
		{
			featureType: 'landscape.natural',
			elementType: 'geometry',
			stylers: [{ color: '#dfd2ae' }]
		},
		{
			featureType: 'poi',
			elementType: 'geometry',
			stylers: [{ color: '#dfd2ae' }]
		},
		{
			featureType: 'poi',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#93817c' }]
		},
		{
			featureType: 'poi.park',
			elementType: 'geometry.fill',
			stylers: [{ color: '#a5b076' }]
		},
		{
			featureType: 'poi.park',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#447530' }]
		},
		{
			featureType: 'road',
			elementType: 'geometry',
			stylers: [{ color: '#f5f1e6' }]
		},
		{
			featureType: 'road.arterial',
			elementType: 'geometry',
			stylers: [{ color: '#fdfcf8' }]
		},
		{
			featureType: 'road.highway',
			elementType: 'geometry',
			stylers: [{ color: '#f8c967' }]
		},
		{
			featureType: 'road.highway',
			elementType: 'geometry.stroke',
			stylers: [{ color: '#e9bc62' }]
		},
		{
			featureType: 'road.highway.controlled_access',
			elementType: 'geometry',
			stylers: [{ color: '#e98d58' }]
		},
		{
			featureType: 'road.highway.controlled_access',
			elementType: 'geometry.stroke',
			stylers: [{ color: '#db8555' }]
		},
		{
			featureType: 'road.local',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#806b63' }]
		},
		{
			featureType: 'transit.line',
			elementType: 'geometry',
			stylers: [{ color: '#dfd2ae' }]
		},
		{
			featureType: 'transit.line',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#8f7d77' }]
		},
		{
			featureType: 'transit.line',
			elementType: 'labels.text.stroke',
			stylers: [{ color: '#ebe3cd' }]
		},
		{
			featureType: 'transit.station',
			elementType: 'geometry',
			stylers: [{ color: '#dfd2ae' }]
		},
		{
			featureType: 'water',
			elementType: 'geometry.fill',
			stylers: [{ color: '#b9d3c2' }]
		},
		{
			featureType: 'water',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#92998d' }]
		}
	]);

	// New map
	let map = new google.maps.Map(document.getElementById('map'), options);
	let scaledSize = new google.maps.Size(30, 40); // scaled size

	// info initialize
	infoWindow = new google.maps.InfoWindow({});

	// load events on search button click event
	$('#getData').click((e) => {
		e.preventDefault();
		let tagsisclicked = [];
		// get user input event or all event
		let tagOption = $('#searchOption').val(); // hockey
		let userInput = $('#SearchBar').val().toLowerCase(); // eventname
		for (var i = 0; i < tags.length; i++) {
			if (document.getElementById(tags[i]).checked) {
				tagsisclicked.push(tags[i]);
			}
		}

		const requestAll = '/event/getall';
		switch (userInput) {
			case '':
				if ($('#allevents').prop('checked')) {
					filteroption = 'getallE';
				} else {
					filteroption = 'getOneTag';
				}
				break;

			default:
				if ($('#allevents').prop('checked')) {
					filteroption = 'getWithKeyW';
				} else {
					filteroption = 'getWithKey&Tag';
				}
		}
		let iContent;
		let infoTitleLink;


		const getCustomMarkers = (tags) => {
			if (tags.includes(" ")) {
				tags = tags.replace(" ", "_")
			}
			return '/src/customIcons/' + tags.toLowerCase() + '_pin.png';
		};

		function addDetails(infodetail) {

			/* 
					  adds information on window and info window
					  arguments:
						  infodetails : event object from data
						  markers: adds properties to the markers for display
				  */
			var infoLink = infodetail.link;
			if (!infoLink.includes("https://")) {
				infoLink = infoLink.replace("http://" + infoLink);
			}
			infoTitleLink = '<a href="' + infoLink + ' " target="_blank"></a>';
			iContent = `<p>${infodetail.name}</p>` + '<a href="' + infoLink + ' " target="_blank">' + infodetail.link + '</a>' + '<p>' + infodetail.description + '</p>';
			$('#events').append(
				'<div id="details" >' +
				`<h3 style="display: inline-block">` +
				infodetail.name +
				'</h3>' + '<br/>' + '<a href="' + infoLink + ' " target="_blank">' + infoLink + '</a>' +
				`<input style="display: inline-block; float:right; margin-top:1em; margin-right:1em" type="button" class="btn btn-info " onclick="{
					openpopupwindow('input${infodetail.event_id}')
				}" value="Add to Wishlist"></input>` +
				infoTitleLink +
				'<p>' +
				infodetail.description +
				'</p>' +
				`<form action='/savewishlist' method='post' id = ${infodetail.event_id}><span>` +
				`<input class="invis" name="eventid" value=${infodetail.event_id}>` +
				'</input>' +
				'<p>' +
				'Start date: \n' +
				infodetail.start_date +
				'</p>' +
				'<p>' +
				'End date:  \n' +
				infodetail.end_date +
				'</p>' +
				'</span>' +
				`<input class= "invis" value="submit" name="childname" id="input${infodetail.event_id}"></input>` +
				'</form>' +
				'</div>' +
				'<hr>'
			);

		}



		$.ajax({
			url: requestAll, //event/getall route
			type: 'GET',
			async: false,
			dataType: 'json',
			success: (data) => {
				$('#events').empty();
				if (filteroption == 'getallE') {
					if (gmarkers.length > 0) {
						removeMarkers();
					}
					$.map(data, function (value, i) {
						// push event vlaues into the markers
						addDetails(value);
						markers.push({
							content: iContent,
							coords: {
								lat: parseFloat(value.lat),
								lng: parseFloat(value.lng)
							},
							// iconImage: geticons(tag)
							iconImage: getCustomMarkers(value.category)
						});
					});
				} else if (filteroption == 'getOneTag') {
					if (gmarkers.length > 0) {
						removeMarkers();
					}
					$.map(data, function (value, i) {
						for (var i = 0; i < tagsisclicked.length; i++) {
							if (tagsisclicked[i] == value.category) {
								addDetails(value);
								markers.push({
									content: iContent,
									coords: {
										lat: parseFloat(value.lat),
										lng: parseFloat(value.lng)
									},
									iconImage: getCustomMarkers(value.category)
								});
							}
						}
					});
				} else if (filteroption == 'getWithKeyW') {
					if (gmarkers.length > 0) {
						removeMarkers();
					}
					$.map(data, function (value, i) {
						if (value.name.toLowerCase().includes(userInput)) {
							addDetails(value);
							markers.push({
								content: iContent,
								coords: {
									lat: parseFloat(value.lat),
									lng: parseFloat(value.lng)
								},
								iconImage: getCustomMarkers(value.category)
							});
						}
					});
				} else {
					if (gmarkers.length > 0) {
						removeMarkers();
					}
					$.map(data, function (value, i) {
						for (var i = 0; i < tagsisclicked.length; i++) {
							if (
								tagsisclicked[i] == value.category &&
								value.name.toLowerCase().includes(userInput)
							) {
								addDetails(value);
								markers.push({
									content: iContent,
									coords: {
										lat: parseFloat(value.lat),
										lng: parseFloat(value.lng)
									},
									iconImage: getPinMarkers(value.category.toLowerCase())
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

		function geticons(tag) {
			let url = '/src/customIcons/' + tag.toLowerCase() + '_pin.png';
			return url; // url
		}
		function addMarker(props) {
			// console.log(props);

			var icon = {
				url: props.iconImage,
				// size: new google.maps.Size(50, 50),
				scaledSize: new google.maps.Size(50, 50)
				// url: '/src/customIcons/arena_pin.png', // url

			};

			let marker = new google.maps.Marker({
				position: props.coords,
				map: map, //icon:props.iconImage
				content: props.content,
				icon: icon
			});

			// push marker to global gmarker array
			gmarkers.push(marker);

			var i = new Image();
			i.src = icon.url;
			i.onload = function () {
				marker.setIcon(icon); //If icon found go ahead and show it
			}
			i.onerror = function () {
				marker.setIcon(null); //This displays brick colored standard marker icon in case image is not found.
			}

			// Check content
			if (props.content) {
				marker.addListener('click', function () {
					infoWindow.setContent(marker.content);
					infoWindow.open(map, marker);
				});
			}
		}
	});

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
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
