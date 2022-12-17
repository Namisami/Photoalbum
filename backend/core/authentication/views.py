from .serializers import UserSerializer, LoginSerializer, RegistrationSerializer
from .models import User

from django.core import serializers
from django.forms.models import model_to_dict
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import filters, status
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
import json



class LoginViewSet(ViewSet):
    # serializer_class = LoginSerializer
    # authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request):
    #     print(serializer.validated_data)
        email = request.data.get("email")
        password = request.data.get("password")
        
        # serializer = LoginSerializer(data=request.data)
        # serializer.is_valid(raise_exception=True)
        # user = serializer.save()
        user = authenticate(email=email, password=password)
        token, _ = Token.objects.get_or_create(user=user)
        # user = User.objects.get(email=user)
        # print(user)
        # user = model_to_dict(user)
        # print(user)
        # user['photo'] = str(user['photo'])
        # data = json.dumps(user)
        # print(data)
        # print(user)
        # if not user:
        #     return Response({'error': 'Invalid Credentials'},
        #                 status=status.HTTP_404_NOT_FOUND)

        # serializer = UserSerializer(data=user)
        # print(serializer.is_valid())
        
        print(token.key)
        return Response({
            # "user": data,
            "token": token.key,
            }, status=status.HTTP_200_OK)


class RegistrationViewSet(ModelViewSet):
    serializer_class = RegistrationSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "user": serializer.validated_data,
            "token": token.key,
        }, status=status.HTTP_201_CREATED)


class RefreshViewSet(ViewSet):
    permission_classes = (AllowAny,)
    authentication_classes = (TokenAuthentication,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        # try:
        serializer.is_valid(raise_exception=True)
        # except TokenError as e:
        #     raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class UserViewSet(ModelViewSet):
    # http_method_names = ['get']
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    filter_backends = [filters.OrderingFilter]
    # ordering_fields = ['updated']
    # ordering = ['-updated']

    def list(self, request):
        queryset = User.objects.get(id=request.user.id)
        serializer = UserSerializer(queryset, context={'request': request})
        return Response(serializer.data)

    # def patch(self, request, *args, **kwargs):
    #     # queryset = User.objects.get(id=request.user.id)
    #     serializer = UserSerializer(data=request.DATA, context={'request': request})
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(status=status.HTTP_205_RESET_CONTENT)
    #     else:
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        instance = User.objects.get(id=request.user.id)
        serializer = self.get_serializer(
            instance,
            data=request.data, 
            context={'request': request}, 
            partial=True
        )
        print(serializer)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    #     return self.partial_update(request, *args, **kwargs)       

    def get_queryset(self):
        if self.request.user.is_superuser:
            return User.objects.all()

    def get_object(self):
        lookup_field_value = self.kwargs[self.lookup_field]

        obj = User.objects.get(lookup_field_value)
        self.check_object_permissions(self.request, obj)

        return obj