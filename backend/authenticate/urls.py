from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, DoctorViewSet

auth_register = AuthViewSet.as_view({'post': 'register'})
auth_login = AuthViewSet.as_view({'post': 'login'})

router = DefaultRouter()
router.register(r'doctor', DoctorViewSet, basename='doctor')

urlpatterns = [
    path('auth/register/', auth_register, name='auth-register'),
    path('auth/login/', auth_login, name='auth-login'),
    path('', include(router.urls)),
]