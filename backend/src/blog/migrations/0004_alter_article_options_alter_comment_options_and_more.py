# Generated by Django 5.1.2 on 2025-07-08 20:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0003_alter_article_tags'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='article',
            options={'ordering': ['-created_at']},
        ),
        migrations.AlterModelOptions(
            name='comment',
            options={'ordering': ['created_at']},
        ),
        migrations.AlterModelOptions(
            name='tag',
            options={'ordering': ['name']},
        ),
        migrations.AddField(
            model_name='article',
            name='is_published',
            field=models.BooleanField(default=True, help_text='Whether the article is published'),
        ),
        migrations.AddField(
            model_name='comment',
            name='author_name',
            field=models.CharField(default='Anonymous', help_text='Name of the comment author', max_length=100),
        ),
        migrations.AddField(
            model_name='comment',
            name='is_approved',
            field=models.BooleanField(default=True, help_text='Whether the comment is approved for display'),
        ),
        migrations.AddField(
            model_name='tag',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='article',
            name='content',
            field=models.TextField(help_text='Article content'),
        ),
        migrations.AlterField(
            model_name='article',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='article',
            name='tags',
            field=models.ManyToManyField(blank=True, help_text='Tags associated with this article', related_name='articles', to='blog.tag'),
        ),
        migrations.AlterField(
            model_name='article',
            name='title',
            field=models.CharField(help_text='Article title', max_length=200),
        ),
        migrations.AlterField(
            model_name='comment',
            name='article',
            field=models.ForeignKey(help_text='Article this comment belongs to', on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='blog.article'),
        ),
        migrations.AlterField(
            model_name='comment',
            name='content',
            field=models.TextField(help_text='Comment content'),
        ),
        migrations.AlterField(
            model_name='tag',
            name='name',
            field=models.CharField(help_text='Unique tag name', max_length=50, unique=True),
        ),
        migrations.AddIndex(
            model_name='article',
            index=models.Index(fields=['created_at'], name='blog_articl_created_311958_idx'),
        ),
        migrations.AddIndex(
            model_name='article',
            index=models.Index(fields=['is_published'], name='blog_articl_is_publ_0f077c_idx'),
        ),
        migrations.AddIndex(
            model_name='article',
            index=models.Index(fields=['title'], name='blog_articl_title_525ebf_idx'),
        ),
        migrations.AddIndex(
            model_name='comment',
            index=models.Index(fields=['article', 'created_at'], name='blog_commen_article_6af9d2_idx'),
        ),
        migrations.AddIndex(
            model_name='comment',
            index=models.Index(fields=['is_approved'], name='blog_commen_is_appr_be38d5_idx'),
        ),
        migrations.AddIndex(
            model_name='tag',
            index=models.Index(fields=['name'], name='blog_tag_name_43b6ed_idx'),
        ),
    ]
