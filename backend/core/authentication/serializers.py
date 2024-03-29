from rest_framework.serializers import ModelSerializer, ValidationError
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import update_last_login
from django.core.exceptions import ObjectDoesNotExist

from .models import User


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'last_login', 'first_name', 'last_name', 'email', 'photo', 'bio', 'is_active', 'is_staff', 'is_superuser']
        read_only_field = ['is_active', 'is_staff', 'is_superuser']

class LoginSerializer(ModelSerializer):
    password = serializers.CharField(max_length=128, min_length=8, write_only=True, required=True)
    email = serializers.EmailField(required=True, write_only=True, max_length=128)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'password']


class PasswordSerializer(UserSerializer):
    old_password = serializers.CharField(max_length=128, min_length=8, write_only=True, required=True)
    password = serializers.CharField(max_length=128, min_length=8, write_only=True, required=True)
    password_again = serializers.CharField(max_length=128, min_length=8, write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['id', 'old_password', 'password', 'password_again']

    

    # def validate(self, attrs):
    #     data = super().validate(attrs)

    #     # refresh = self.get_token(self.user)

    #     data['user'] = UserSerializer(self.user).data
    #     # data['refresh'] = str(refresh)
    #     # data['access'] = str(refresh.access_token)

    #     if api_settings.UPDATE_LAST_LOGIN:
    #         update_last_login(None, self.user)

    #     return data

    def create(self, validated_data):
        user = User.objects.get(email=validated_data['email'], password=validated_data['password'])
        return user


class RegistrationSerializer(UserSerializer):
    password = serializers.CharField(max_length=128, min_length=8, write_only=True, required=True)
    email = serializers.EmailField(required=True, write_only=True, max_length=128)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'password']

    def validate_first_name(self, value):
        if len(value) < 2:
            raise ValidationError("Слишком короткое имя", code='invalid')

    def validate_last_name(self, value):
        if len(value) < 2:
            raise ValidationError("Слишком короткая фамилия", code='invalid')

    def create(self, validated_data):
        try:
            user = User.objects.get(email=validated_data['email'])
        except ObjectDoesNotExist:
            user = User.objects.create_user(**validated_data)
        return user
