from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from authentication.models import User


class CustomUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm):
        model = User
        fields = ('email', 'first_name', 'last_name')


class CustomUserChangeForm(UserChangeForm):
    password = None
    class Meta:
        model = User
        fields = ('photo', 'first_name', 'last_name', 'bio')