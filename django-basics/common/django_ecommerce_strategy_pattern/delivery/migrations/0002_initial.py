# Generated by Django 5.1.3 on 2024-11-29 15:34

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('delivery', '0001_initial'),
        ('user_shipping_details', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='delivery',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='delivery', to='user_shipping_details.usershippingdetails'),
        ),
    ]
