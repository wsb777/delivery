from .models import *
from rest_framework import serializers

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ('first_name', 'last_name', 'middle_name')

class UserSerializer(serializers.ModelSerializer):
    user_info = UserInfoSerializer()

    class Meta:
        model = User
        fields = ("id", "user_info")

class OrderSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    packaging_type = serializers.SerializerMethodField()
    order_date = serializers.SerializerMethodField()
    service = serializers.SerializerMethodField()
    transport = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ("id", "status","packaging_type","order_date", "distance", "service","transport")

    def get_status(self, order):
        return order.status.name
    
    def get_packaging_type(self, order):
        return order.packaging_type.name
    
    def get_order_date(self, order):
        return order.order_date.strftime("%Y-%m-%d")
    
    def get_service(self, order):
        return order.service.name
    
    def get_transport(self, order):
        return order.transport.car_number