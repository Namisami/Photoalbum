from rest_framework.routers import DefaultRouter

from .views import LoginViewSet, RegistrationViewSet, UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

router.register(r'auth/login', LoginViewSet, basename='auth-login')
router.register(r'auth/register', RegistrationViewSet, basename='auth-register')

urlpatterns = router.urls