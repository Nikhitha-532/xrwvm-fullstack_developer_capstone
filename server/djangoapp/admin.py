from django.contrib import admin
from .models import CarMake, CarModel


# Register your models here.


# CarModelInline class
#class CarModelInline(admin.StackedInline):
#    model = CarModel
#    extra = 2


# CarModelAdmin class
#class CarModelAdmin(admin.ModelAdmin):
#    list_display = ['name','year']
#    list_filter = ['year']

# CarMakeAdmin class with CarModelInline
#class CarMakeAdmin(admin.ModelAdmin):
#    inlines = [CarModelInline]
#    list_display = ['name','type']
#    list_filter = ['type']
#    search_fields = ['name', 'description']

# Register models here
admin.site.register(CarMake)
admin.site.register(CarModel)
