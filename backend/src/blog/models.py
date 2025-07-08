from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from typing import Optional


class Tag(models.Model):
    """
    Model representing article tags
    """
    name = models.CharField(
        max_length=50, 
        unique=True,
        help_text="Unique tag name"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['name']),
        ]

    def clean(self) -> None:
        """Validate tag data"""
        super().clean()
        if self.name:
            self.name = self.name.strip().lower()
            if not self.name:
                raise ValidationError({'name': 'Tag name cannot be empty or only whitespace.'})
            if len(self.name) < 2:
                raise ValidationError({'name': 'Tag name must be at least 2 characters long.'})

    def save(self, *args, **kwargs) -> None:
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class Article(models.Model):
    """
    Model representing blog articles
    """
    title = models.CharField(
        max_length=200,
        help_text="Article title"
    )
    content = models.TextField(help_text="Article content")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tags = models.ManyToManyField(
        Tag, 
        related_name='articles', 
        blank=True,
        help_text="Tags associated with this article"
    )
    is_published = models.BooleanField(
        default=True,
        help_text="Whether the article is published"
    )

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['created_at']),
            models.Index(fields=['is_published']),
            models.Index(fields=['title']),
        ]

    def clean(self) -> None:
        """Validate article data"""
        super().clean()
        if self.title:
            self.title = self.title.strip()
            if not self.title:
                raise ValidationError({'title': 'Title cannot be empty or only whitespace.'})
            if len(self.title) < 3:
                raise ValidationError({'title': 'Title must be at least 3 characters long.'})
        
        if self.content:
            self.content = self.content.strip()
            if not self.content:
                raise ValidationError({'content': 'Content cannot be empty or only whitespace.'})
            if len(self.content) < 10:
                raise ValidationError({'content': 'Content must be at least 10 characters long.'})

    def save(self, *args, **kwargs) -> None:
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.title

    @property
    def is_recent(self) -> bool:
        """Check if article was created within the last 7 days"""
        return (timezone.now() - self.created_at).days < 7


class Comment(models.Model):
    """
    Model representing article comments
    """
    article = models.ForeignKey(
        Article, 
        related_name='comments', 
        on_delete=models.CASCADE,
        help_text="Article this comment belongs to"
    )
    content = models.TextField(help_text="Comment content")
    author_name = models.CharField(
        max_length=100,
        default="Anonymous",
        help_text="Name of the comment author"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(
        default=True,
        help_text="Whether the comment is approved for display"
    )

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['article', 'created_at']),
            models.Index(fields=['is_approved']),
        ]

    def clean(self) -> None:
        """Validate comment data"""
        super().clean()
        if self.content:
            self.content = self.content.strip()
            if not self.content:
                raise ValidationError({'content': 'Comment content cannot be empty or only whitespace.'})
            if len(self.content) < 5:
                raise ValidationError({'content': 'Comment must be at least 5 characters long.'})
        
        if self.author_name:
            self.author_name = self.author_name.strip()
            if not self.author_name:
                self.author_name = "Anonymous"

    def save(self, *args, **kwargs) -> None:
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f'Comment by {self.author_name} on {self.article.title}'