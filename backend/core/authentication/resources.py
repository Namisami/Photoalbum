from .models import User
from import_export import resources

class UserResource(resources.ModelResource):
    
    class Meta:
        model = User