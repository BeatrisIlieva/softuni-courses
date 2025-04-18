from django.db import (
    models,
)
from django.core.exceptions import (
    ValidationError,
)
from django.contrib.auth.base_user import (
    AbstractBaseUser,
)
from django.contrib.auth.models import (
    PermissionsMixin,
)

from .managers import (
    UserCredentialDetailsManager,
)

# from drf_app.user_shipping_details.models import (
#     UserShippingDetails,
# )
from drf_app.user_payment_details.models import (
    UserPaymentDetails,
)


class UserCredentialDetails(AbstractBaseUser, PermissionsMixin):
    USERNAME_FIELD = "email"

    objects = UserCredentialDetailsManager()

    email = models.EmailField(
        unique=True, error_messages={"invalid": "Please enter a valid email address"}
    )

    is_staff = models.BooleanField(
        default=False,
    )

    groups = models.ManyToManyField(
        to="auth.Group",
        related_name="user_credential_details",
        blank=True,
        help_text="The groups this user belongs to. A user will get all permissions granted to each group.",
        verbose_name="groups",
    )

    user_permissions = models.ManyToManyField(
        to="auth.Permission",
        related_name="user_credential_details",
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

    def save(self, *args, **kwargs):
        self.clean()

        is_new = self.pk is None
        super().save(*args, **kwargs)

        if is_new:
            # UserShippingDetails.objects.create(user=self)
            UserPaymentDetails.objects.create(user=self)
