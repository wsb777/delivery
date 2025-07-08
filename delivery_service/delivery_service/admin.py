from django.contrib import admin

from .models import *

# Register your models here.
admin.site.register(Service)
admin.site.register(PackagingType)
admin.site.register(Transport)
admin.site.register(Status)
admin.site.register(Order)