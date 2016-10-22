{% extends "gis/admin/osm.js" %}

{% block controls %}
{{ block.super }}

{{ module }}.change_loc = function(event) { 
		srco = document.getElementById('{{ id }}').value;
		var a = srco.split(" ");
		var b = a[0].split("(");
		var c = a[1].split(")");
		lngm = parseFloat(c[0]);
		latm = parseFloat(b[1]);
		var c = new OpenLayers.Geometry.Point(latm,lngm).transform(new OpenLayers.Projection("EPSG:3857"), new OpenLayers.Projection("EPSG:4326"));
		input_lng_lat(c.x,c.y);
		revgeocod(c.x, c.y);
	};
	
{{ module }}.layers.vector.events.on({"featuremodified" :  {{ module }}.change_loc});

django.jQuery(document).ready(function() {
	
	var mappa = {{ module }}.map;
	var lng, lat
	var $address = django.jQuery('#id_address1')
	
	$address.change(function() {
	  fulladr = $address.val().concat(' ',django.jQuery('#id_address2').val(),' ',django.jQuery('#id_city').val(),' ',django.jQuery('#id_province').val());
		geocod(fulladr, mappa);
	});
	
	django.jQuery('#id_longitude, #id_latitude').change(function() {
		lng = django.jQuery("#id_longitude").val();
		lat = django.jQuery("#id_latitude").val();
		modcoo(lng, lat, mappa);
		revgeocod(lng, lat); 
	});
	
	django.jQuery('[id*="OpenLayers_Layer_Vector_201_"]').click(function() { 
		srco = document.getElementById('{{ id }}').value;
		var a = srco.split(" ");
		var b = a[0].split("(");
		var c = a[1].split(")");
		lngm = parseFloat(c[0]);
		latm = parseFloat(b[1]);
		var c = new OpenLayers.Geometry.Point(latm,lngm).transform(mappa.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
		input_lng_lat(c.x,c.y);
		revgeocod(c.x, c.y);
	});
  
});

function modcoo(lng, lat, mappa) {
    mappa.setCenter(new OpenLayers.LonLat(lng,lat).transform(new OpenLayers.Projection("EPSG:4326"),  mappa.getProjectionObject()), 13);
	var c = new OpenLayers.Geometry.Point(lng,lat).transform(new OpenLayers.Projection("EPSG:4326"), mappa.getProjectionObject());
	{{ module }}.layers.vector.addFeatures([new OpenLayers.Feature.Vector(c)]);
}

function input_lng_lat(lng, lat) {
	django.jQuery("#id_longitude").val(lng.toFixed(6));
	django.jQuery("#id_latitude").val(lat.toFixed(6));
}

function geocod(ind, mappa) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address': ind} ,
        function(results,status) { 
			if (status == google.maps.GeocoderStatus.OK) {
				if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
					lat = results[0].geometry.location.lat();  
					lng = results[0].geometry.location.lng(); 
//					mappa.setCenter(new OpenLayers.LonLat(lng,lat).transform(new OpenLayers.Projection("EPSG:4326"), mappa.getProjectionObject()), 13);
//					var c = new OpenLayers.Geometry.Point(lng,lat).transform(new OpenLayers.Projection("EPSG:4326"), mappa.getProjectionObject());
//					{{ module }}.layers.vector.addFeatures([new OpenLayers.Feature.Vector(c)]);
          modcoo(lng,lat,mappa);
					input_lng_lat(lng, lat);
				}	
			}
			else {
				alert("Address not found!");
			}
        }
	)  
};

function revgeocod(lng, lat) {
	var geocoder = new google.maps.Geocoder();
	var infowindow = new google.maps.InfoWindow();
	var latlng = new google.maps.LatLng(lat,lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			django.jQuery("#id_address1").val(results[0].formatted_address);
		} else {
			alert("Geocoder failed due to: " + status);
		}
	});
};	
	
{% endblock %}