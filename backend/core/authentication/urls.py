from rest_framework.routers import DefaultRouter

from .views import LoginViewSet, RegistrationViewSet, RefreshViewSet, UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

router.register(r'auth/login', LoginViewSet, basename='auth-login')
router.register(r'auth/register', RegistrationViewSet, basename='auth-register')
router.register(r'auth/refresh', RefreshViewSet, basename='auth-refresh')

urlpatterns = router.urls