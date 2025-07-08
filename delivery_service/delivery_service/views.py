from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
from rest_framework import authentication, permissions
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login

from .models import *
from .serializers import *
# Create your views here.

class LoginApiView(APIView):
    def post(self, request):
        username = request.data["username"]
        password = request.data["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            data = UserSerializer(user).data
            return Response({"result" : data})
        else:
            return Response({"error":"Логин или пароль не подходят"},status=401)
        
class OrderInfo(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        orders = Order.objects.all()
        data = OrderSerializer(orders, many=True).data
        return Response({"orders":data})