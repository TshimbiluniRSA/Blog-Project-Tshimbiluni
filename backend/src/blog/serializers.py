from rest_framework import serializers
from typing import Dict, Any, List, OrderedDict
from .models import Article, Tag, Comment


class TagSerializer(serializers.ModelSerializer):
    """Serializer for Tag model"""
    
    class Meta:
        model = Tag
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_name(self, value: str) -> str:
        """Validate tag name"""
        if not value or not value.strip():
            raise serializers.ValidationError("Tag name cannot be empty.")
        
        value = value.strip().lower()
        if len(value) < 2:
            raise serializers.ValidationError("Tag name must be at least 2 characters long.")
        
        return value


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for Comment model"""
    author_name = serializers.CharField(max_length=100, required=False, default="Anonymous")
    
    class Meta:
        model = Comment
        fields = ['id', 'article', 'content', 'author_name', 'created_at', 'is_approved']
        read_only_fields = ['id', 'created_at']

    def validate_content(self, value: str) -> str:
        """Validate comment content"""
        if not value or not value.strip():
            raise serializers.ValidationError("Comment content cannot be empty.")
        
        value = value.strip()
        if len(value) < 5:
            raise serializers.ValidationError("Comment must be at least 5 characters long.")
        
        return value


class CommentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating comments (excludes article field)"""
    author_name = serializers.CharField(max_length=100, required=False, default="Anonymous")
    
    class Meta:
        model = Comment
        fields = ['content', 'author_name']

    def validate_content(self, value: str) -> str:
        """Validate comment content"""
        if not value or not value.strip():
            raise serializers.ValidationError("Comment content cannot be empty.")
        
        value = value.strip()
        if len(value) < 5:
            raise serializers.ValidationError("Comment must be at least 5 characters long.")
        
        return value


class ArticleListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for article lists"""
    tags = TagSerializer(many=True, read_only=True)
    comments_count = serializers.SerializerMethodField()
    is_recent = serializers.ReadOnlyField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'content', 'tags', 'created_at', 
            'updated_at', 'is_published', 'comments_count', 'is_recent'
        ]

    def get_comments_count(self, obj: Article) -> int:
        """Get the count of approved comments"""
        return obj.comments.filter(is_approved=True).count()


class ArticleDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for individual articles"""
    tags = TagSerializer(many=True, read_only=True)
    comments = serializers.SerializerMethodField()
    is_recent = serializers.ReadOnlyField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'content', 'tags', 'comments', 
            'created_at', 'updated_at', 'is_published', 'is_recent'
        ]

    def get_comments(self, obj: Article) -> List[Dict[str, Any]]:
        """Get approved comments for the article"""
        approved_comments = obj.comments.filter(is_approved=True)
        return CommentSerializer(approved_comments, many=True).data


class ArticleCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating articles"""
    tags = TagSerializer(many=True, required=False)
    
    class Meta:
        model = Article
        fields = ['title', 'content', 'tags', 'is_published']

    def validate_title(self, value: str) -> str:
        """Validate article title"""
        if not value or not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        
        return value

    def validate_content(self, value: str) -> str:
        """Validate article content"""
        if not value or not value.strip():
            raise serializers.ValidationError("Content cannot be empty.")
        
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError("Content must be at least 10 characters long.")
        
        return value

    def validate_tags(self, value: List[OrderedDict]) -> List[OrderedDict]:
        """Validate tags data"""
        if not value:
            return value
            
        tag_names = [tag['name'].strip().lower() for tag in value if 'name' in tag]
        if len(tag_names) != len(set(tag_names)):
            raise serializers.ValidationError("Duplicate tag names are not allowed.")
        
        return value

    def create(self, validated_data: Dict[str, Any]) -> Article:
        """Create article with tags"""
        tags_data = validated_data.pop('tags', [])
        
        # Create the article
        article = Article.objects.create(**validated_data)
        
        # Process tags
        self._process_tags(article, tags_data)
        
        return article

    def update(self, instance: Article, validated_data: Dict[str, Any]) -> Article:
        """Update article with tags"""
        tags_data = validated_data.pop('tags', None)
        
        # Update article fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Process tags if provided
        if tags_data is not None:
            instance.tags.clear()
            self._process_tags(instance, tags_data)
        
        return instance

    def _process_tags(self, article: Article, tags_data: List[Dict[str, Any]]) -> None:
        """Process and associate tags with the article"""
        for tag_data in tags_data:
            tag_name = tag_data.get('name', '').strip().lower()
            if tag_name:
                tag, created = Tag.objects.get_or_create(name=tag_name)
                article.tags.add(tag)

    def to_representation(self, instance: Article) -> Dict[str, Any]:
        """Return detailed representation after create/update"""
        return ArticleDetailSerializer(instance, context=self.context).data
