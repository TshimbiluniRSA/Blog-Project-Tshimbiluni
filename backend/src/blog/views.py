from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.pagination import PageNumberPagination
from typing import Any, Dict
import logging

from .models import Article, Comment, Tag
from .serializers import (
    ArticleListSerializer, 
    ArticleDetailSerializer, 
    ArticleCreateUpdateSerializer,
    CommentSerializer, 
    CommentCreateSerializer,
    TagSerializer
)

# Configure logging
logger = logging.getLogger(__name__)


class StandardResultsSetPagination(PageNumberPagination):
    """Standard pagination configuration"""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


def api_root(request: Request) -> JsonResponse:
    """API root endpoint"""
    return JsonResponse({
        "message": "Welcome to the Blog API",
        "version": "1.0",
        "endpoints": {
            "articles": "/api/articles/",
            "tags": "/api/tags/",
            "comments": "/api/articles/{article_id}/comments/"
        }
    })


class ArticleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing articles with full CRUD operations
    """
    queryset = Article.objects.filter(is_published=True).prefetch_related('tags', 'comments')
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'updated_at', 'title']
    ordering = ['-created_at']

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'list':
            return ArticleListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ArticleCreateUpdateSerializer
        else:
            return ArticleDetailSerializer

    def perform_create(self, serializer: ArticleCreateUpdateSerializer) -> None:
        """Create article with logging"""
        try:
            article = serializer.save()
            logger.info(f"Article created: {article.id} - {article.title}")
        except Exception as e:
            logger.error(f"Error creating article: {str(e)}")
            raise

    def perform_update(self, serializer: ArticleCreateUpdateSerializer) -> None:
        """Update article with logging"""
        try:
            article = serializer.save()
            logger.info(f"Article updated: {article.id} - {article.title}")
        except Exception as e:
            logger.error(f"Error updating article {self.get_object().id}: {str(e)}")
            raise

    def perform_destroy(self, instance: Article) -> None:
        """Delete article with logging"""
        try:
            article_id = instance.id
            article_title = instance.title
            instance.delete()
            logger.info(f"Article deleted: {article_id} - {article_title}")
        except Exception as e:
            logger.error(f"Error deleting article {instance.id}: {str(e)}")
            raise

    @action(detail=True, methods=['get'])
    def comments(self, request: Request, pk: str = None) -> Response:
        """Get comments for a specific article"""
        try:
            article = self.get_object()
            comments = article.comments.filter(is_approved=True).order_by('created_at')
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching comments for article {pk}: {str(e)}")
            return Response(
                {'error': 'Failed to fetch comments'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def add_comment(self, request: Request, pk: str = None) -> Response:
        """Add a comment to an article"""
        try:
            article = self.get_object()
            serializer = CommentCreateSerializer(data=request.data)
            
            if serializer.is_valid():
                comment = serializer.save(article=article)
                response_serializer = CommentSerializer(comment)
                logger.info(f"Comment added to article {article.id} by {comment.author_name}")
                return Response(response_serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error adding comment to article {pk}: {str(e)}")
            return Response(
                {'error': 'Failed to add comment'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TagViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing tags
    """
    queryset = Tag.objects.all().order_by('name')
    serializer_class = TagSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def perform_create(self, serializer: TagSerializer) -> None:
        """Create tag with logging"""
        try:
            tag = serializer.save()
            logger.info(f"Tag created: {tag.id} - {tag.name}")
        except Exception as e:
            logger.error(f"Error creating tag: {str(e)}")
            raise

    @action(detail=True, methods=['get'])
    def articles(self, request: Request, pk: str = None) -> Response:
        """Get articles for a specific tag"""
        try:
            tag = self.get_object()
            articles = tag.articles.filter(is_published=True).order_by('-created_at')
            serializer = ArticleListSerializer(articles, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching articles for tag {pk}: {str(e)}")
            return Response(
                {'error': 'Failed to fetch articles'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CommentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing comments
    """
    serializer_class = CommentSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']
    ordering = ['created_at']

    def get_queryset(self):
        """Filter comments by article"""
        article_pk = self.kwargs.get('article_pk')
        if article_pk:
            return Comment.objects.filter(
                article_id=article_pk, 
                is_approved=True
            ).select_related('article')
        return Comment.objects.filter(is_approved=True).select_related('article')

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'create':
            return CommentCreateSerializer
        return CommentSerializer

    def perform_create(self, serializer) -> None:
        """Create comment with article association"""
        try:
            article_pk = self.kwargs.get('article_pk')
            if article_pk:
                article = get_object_or_404(Article, pk=article_pk)
                comment = serializer.save(article=article)
                logger.info(f"Comment created: {comment.id} on article {article.id}")
            else:
                raise ValueError("Article ID is required")
        except Exception as e:
            logger.error(f"Error creating comment: {str(e)}")
            raise
