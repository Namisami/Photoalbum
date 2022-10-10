from django.db import models


class Author(models.Model):
    nickname = models.CharField(verbose_name="Никнейм", max_length=255)
    bio = models.TextField(verbose_name="О авторе", blank=True)

    def __str__(self):
        return self.nickname
        
    class Meta:
        verbose_name = "Автор"
        verbose_name_plural = "Авторы"


class Category(models.Model):
    title = models.CharField(verbose_name="Название", max_length=255)
    description = models.TextField(verbose_name="Описание", blank=True)
    # owner = models.ForeignKey(to=User, verbose_name="Владелец", on_delete=models.CASCADE)

    def __str__(self):
        return self.title
        
    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"


class Subcategory(models.Model):
    title = models.CharField(verbose_name="Название", max_length=255, unique=True)
    description = models.TextField(verbose_name="Описание", blank=True)
    category = models.ForeignKey(verbose_name="Категория", to=Category, on_delete=models.CASCADE, null=True)
    # owner = models.ForeignKey(verbose_name="Владелец", to=User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
        
    class Meta:
        verbose_name = "Подкатегория"
        verbose_name_plural = "Подкатегории"


class Picture(models.Model):
    photo_file = models.ImageField(verbose_name="Изображение", upload_to="pictures")
    author = models.ForeignKey(verbose_name="Автор", to=Author, on_delete=models.PROTECT, null=True, blank=True)
    upload_date = models.DateField(verbose_name="Дата загрузки", auto_now_add=True, blank=True)
    category = models.ForeignKey(verbose_name="Категория", to=Category, on_delete=models.PROTECT, null=True, blank=True)
    subcategory = models.ManyToManyField(verbose_name="Подкатегории", to=Subcategory, blank=True)
    description = models.TextField(verbose_name="Описание", blank=True)
    # owner = models.ForeignKey(verbose_name="Владелец", to=User, on_delete=models.CASCADE)


    def __str__(self):
        return str(self.id)
        
    class Meta:
        verbose_name = "Изображение"
        verbose_name_plural = "Изображения"


class Album(models.Model):
    title = models.CharField(verbose_name="Название", max_length=255, default="Новый альбом")
    description = models.TextField(verbose_name="Описание", blank=True)
    created_at = models.DateField(verbose_name="Дата создания", auto_now_add=True)
    cover = models.ImageField(verbose_name="Обложка", upload_to="albums/covers", default="../static/images/placeholder.webp")
    picture = models.ManyToManyField(verbose_name="Изображения", to=Picture, blank=True)
    # owner = models.ForeignKey(to=User, verbose_name="Владелец", on_delete=models.CASCADE)

    def get_pictures(self):
        return self.picture.objects.all()

    def __str__(self):
        return self.title
        
    class Meta:
        verbose_name = "Альбом"
        verbose_name_plural = "Альбомы"
