from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.db import models
from django.contrib.auth.models import User
import uuid

# Create your models here.

class UserInfo(models.Model):
    class Meta:
        verbose_name = "Информация о пользователе"
        verbose_name_plural = "Информация о пользователях"

    first_name = models.CharField('Имя', max_length=255)
    last_name = models.CharField('Фамилия', max_length=255)
    middle_name = models.CharField('Отчество', max_length=255)
    created_at = models.DateTimeField(auto_now=True)
    update_at = models.DateTimeField(auto_now_add=True)
    user = models.OneToOneField(User, models.PROTECT, verbose_name="Пользователь", related_name="user_info")

    def __str__(self) -> str:
        return f"{self.last_name} {self.first_name} {self.middle_name}"

    def get_fio(self):
        f = (self.first_name[0] + '.') if self.first_name else ''
        m = (self.middle_name[0] + '.') if self.middle_name else ''
        return f"{self.last_name} {f + m}"
    
class Transport(models.Model):
    class Meta:
        verbose_name = "Транспорт"
        verbose_name_plural = "Машины"
    car_number = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now=True)
    update_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.car_number}"
    
    def save(self, *args, **kwargs):
        self.car_number = self.car_number.upper()       
        super().save(*args, **kwargs)

# Статус заказа - В ожидании, доставлен и тд
class Status(models.Model):
    class Meta:
        verbose_name = "Статус"
        verbose_name_plural = "Статусы"
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return f"{self.name}"

# Услуга заказа - До клиента, до двери и тд
class Service(models.Model):
    class Meta:
        verbose_name = "Услуга"
        verbose_name_plural = "Услуги"
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return f"{self.name}"
    
class PackagingType(models.Model):
    class Meta:
        verbose_name = "Тип упаковки"
        verbose_name_plural = "Типы упаковки"
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return f"{self.name}"

class Order(models.Model):
    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"
        ordering = ["order_date"]

    created_at = models.DateTimeField(auto_now=True)
    update_at = models.DateTimeField(auto_now_add=True)
    order_date = models.DateTimeField()
    service = models.ForeignKey('Service',on_delete=models.PROTECT, related_name="orders")
    packaging_type = models.ForeignKey('PackagingType', on_delete=models.PROTECT, related_name="orders")
    transport = models.ForeignKey('Transport', on_delete=models.PROTECT, related_name="orders")
    status = models.ForeignKey('Status', on_delete=models.PROTECT, related_name="orders")
    distance = models.IntegerField()

    def __str__(self) -> str:
        return f"Заказ номер '{self.id}' везет '{self.transport} в дату - {self.order_date}"