from django.contrib.gis.db import models

# Create your models here.
class Loc(models.Model):
    id=models.AutoField(primary_key=True)
    address1 = models.CharField(max_length=80,default='', help_text='Press "Tab" to refresh the map')
    address2 = models.CharField(max_length=80,blank=True,null=True)
    city = models.CharField(max_length=80,default='')
    province = models.CharField(max_length=80, default='AB')
    postalcode = models.CharField(max_length=80,blank=True,null=True)
    longitude = models.FloatField(default=-112, help_text='WGS84 Decimal Degree. Press "Tab" to refresh the map') 
    latitude = models.FloatField(default=52, help_text='WGS84 Decimal Degree. Press "Tab" to refresh the map')
    # GeoDjango-specific: a geometry field (PointField), and
    mpoint = models.PointField()

    def natural_key(self):
        return (self.mpoint.geojson)

    def __str__(self):              # __unicode__ on Python 2
        return ' '.join([self.address1,self.address2,self.city,self.province,self.postalcode])
    


