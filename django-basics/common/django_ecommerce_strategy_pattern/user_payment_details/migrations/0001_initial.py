# Generated by Django 5.1.3 on 2024-11-29 15:34

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('user_credential_details', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserPaymentDetails',
            fields=[
                ('card_holder', models.CharField(error_messages={'blank': 'This field is required', 'max_length': 'This field must not exceed 36 characters'}, max_length=36, validators=[django.core.validators.MinLengthValidator(limit_value=5, message='This field must be at least 5 characters long'), django.core.validators.RegexValidator(message='Card Holder Name can only contain letters, spaces, hyphens, apostrophes, and periods, and must start and end with a letter', regex="(^[A-Za-z]{1,}[A-Za-z\\s\\-'\\.]*[A-Za-z]{1,}$)")])),
                ('card_number', models.CharField(error_messages={'blank': 'This field is required', 'max_length': 'This field must not exceed 16 characters'}, max_length=16, validators=[django.core.validators.MinLengthValidator(limit_value=16, message='This field must be at least 16 characters long'), django.core.validators.RegexValidator(message='The Card Number can only contain digits', regex='^[0-9]+$')])),
                ('expiry_date', models.CharField(error_messages={'blank': 'This field is required', 'max_length': 'This field must not exceed 5 characters'}, max_length=5, validators=[django.core.validators.MinLengthValidator(limit_value=5, message='This field must be at least 5 characters long'), django.core.validators.RegexValidator(message="The Expiry Date must be in the format 'MM/YY'", regex='^\\d{2}/\\d{2}$')])),
                ('cvv_code', models.CharField(error_messages={'blank': 'This field is required', 'max_length': 'This field must not exceed 3 characters'}, max_length=3, validators=[django.core.validators.MinLengthValidator(limit_value=3, message='This field must be at least 3 characters long'), django.core.validators.RegexValidator(message='The CVV Code can only contain digits', regex='^[0-9]+$')])),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='payment_details', serialize=False, to='user_credential_details.usercredentialdetails')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
