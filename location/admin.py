# Administrator configurations for Location Models
from django.contrib.gis.db import models
from django.contrib.gis import admin, forms

# Geocoding things
from django.conf import settings 
from django.contrib.gis.geos import GEOSGeometry

#
# Register your models here.
from .models import Loc

class GoogleAdmin(admin.OSMGeoAdmin): 
  g = GEOSGeometry('POINT (-112 52)', srid=4326) # Set map center 
  g.transform(3857) 
  default_lon, default_lat = g.coords
  default_zoom = 7
  extra_js = ["https://maps.google.com/maps/api/js?key=AIzaSyCicwCrD6J7Rpvxu-L1u3afjezd44MaKOE"] 
  map_template = 'gmgdav5.html'
  openlayers_url = 'OpenLayers.js'
  fieldsets = (
      (None, {
        'fields': ( 'address1', 'address2', 'city', 'province','postalcode','mpoint')
      }),
      ('Location', {
        'classes': ('collapse',),
        'fields': ('latitude', 'longitude'),
      }),
  )
  list_display = ('__str__',)
  search_fields = [ 'address1','city']



# subclass the openlayerswidget so we can use it on an ssl enabled site
class OpenLayersWidgetHttps(forms.OpenLayersWidget):
    class Media:
        extend = False
        js = (
            'https://cdnjs.cloudflare.com/ajax/libs/openlayers/2.13.1/OpenLayers.js',
            'gis/js/OLMapWidget.js',
        )

# register all the administration capabilities 
admin.site.register(Loc, GoogleAdmin) 
