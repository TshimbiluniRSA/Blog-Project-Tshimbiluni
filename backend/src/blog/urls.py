from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet, TagViewSet, CommentViewSet, api_root

# Create router and register viewsets
router = DefaultRouter()
router.register(r'articles', ArticleViewSet, basename='article')
router.register(r'tags', TagViewSet, basename='tag')

# URL patterns
urlpatterns = [
    path('', api_root, name='api-root'),
    path('', include(router.urls)),
    
    # Nested comment URLs for articles
    path('articles/<int:article_pk>/comments/', 
         CommentViewSet.as_view({'get': 'list', 'post': 'create'}), 
         name='article-comments'),
    path('articles/<int:article_pk>/comments/<int:pk>/', 
         CommentViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), 
         name='article-comment-detail'),
]
