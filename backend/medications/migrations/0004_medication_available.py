# Generated by Django 5.1.3 on 2024-11-09 14:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('medications', '0003_alter_refillrequest_options_refillrequest_notes'),
    ]

    operations = [
        migrations.AddField(
            model_name='medication',
            name='available',
            field=models.BooleanField(default=True),
        ),
    ]
