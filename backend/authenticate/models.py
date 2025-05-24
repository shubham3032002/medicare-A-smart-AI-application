from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

# -------------------------------
# Custom User Model with Roles
# -------------------------------
class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('doctor', 'Doctor'),
        ('patient', 'Patient'),
        ('staff', 'Staff'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')

    def __str__(self):
        return f"{self.username} ({self.role})"

# -------------------------------
# Admin Profile
# -------------------------------
class AdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_profile')
    admin_code = models.CharField(max_length=200)

    def __str__(self):
        return f"Admin: {self.user.username}"

# -------------------------------
# Doctor Profile
# -------------------------------
class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    specialization = models.CharField(max_length=100)
    license_number = models.CharField(max_length=100, unique=True)
    hospital_name = models.CharField(max_length=100)
    degree_image = models.ImageField(upload_to='degree_certificates/', blank=True, null=True)

    def __str__(self):
        return f"Dr. {self.user.get_full_name()} - {self.specialization}"

# -------------------------------
# Patient Profile
# -------------------------------
class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    medical_history = models.TextField(blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    insurance_number = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Patient: {self.user.get_full_name()}"

# -------------------------------
# Staff Profile
# -------------------------------
class StaffProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='staff_profile')
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=100, unique=True)
    department = models.CharField(max_length=100)

    def __str__(self):
        return f"Staff: {self.user.username} ({self.department})"

# -------------------------------
# UUID-based Appointment Number
# -------------------------------
def generate_number(*args, **kwargs):
    return str(uuid.uuid4()).split('-')[0].upper()

# -------------------------------
# Appointment Model
# -------------------------------
class Appointment(models.Model):
    appoint_number = models.CharField(max_length=100, unique=True, default=generate_number)
    scheduled = models.DateTimeField()
    remarks = models.CharField(max_length=100)
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE)
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE)

    def __str__(self):
        return f"Appointment #{self.appoint_number} - Dr.{self.doctor.user.username} with {self.patient.user.username}"
