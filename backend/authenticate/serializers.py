from rest_framework import serializers
from .models import User, AdminProfile, DoctorProfile, PatientProfile, StaffProfile

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)

    # Admin fields
    admin_code = serializers.CharField(required=False, allow_blank=True)

    # Doctor fields
    specialization = serializers.CharField(required=False, allow_blank=True)
    license_number = serializers.CharField(required=False, allow_blank=True)
    hospital_name = serializers.CharField(required=False, allow_blank=True)

    # Patient fields
    medical_history = serializers.CharField(required=False, allow_blank=True)
    insurance_number = serializers.CharField(required=False, allow_blank=True)
    birth_date = serializers.DateField(required=False, allow_null=True)

    # Staff fields
    employee_id = serializers.CharField(required=False, allow_blank=True)
    department = serializers.CharField(required=False, allow_blank=True)
    doctor_id = serializers.IntegerField(required=False)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'first_name', 'last_name', 'role',
            'admin_code', 'specialization', 'license_number', 'hospital_name',
            'medical_history', 'insurance_number', 'birth_date',
            'employee_id', 'department', 'doctor_id'
        ]

    def validate(self, data):
        role = data.get('role')

        if role == 'admin' and not data.get('admin_code'):
            raise serializers.ValidationError({"admin_code": "Admin code is required for admin role."})

        if role == 'doctor' and not all([
            data.get('specialization'),
            data.get('license_number'),
            data.get('hospital_name')
        ]):
            raise serializers.ValidationError({
                "doctor_details": "Specialization, license number, and hospital name are required for doctor role."
            })

        if role == 'patient' and not any([
            data.get('medical_history'),
            data.get('insurance_number'),
            data.get('birth_date')
        ]):
            raise serializers.ValidationError({
                "patient_details": "At least one of medical history, insurance number, or birth date is required for patient role."
            })

        if role == 'staff' and not all([
            data.get('employee_id'),
            data.get('department'),
            data.get('doctor_id')
        ]):
            raise serializers.ValidationError({
                "staff_details": "Employee ID, department, and doctor ID are required for staff role."
            })

        if role == 'staff':
            doctor_id = data.get('doctor_id')
            if doctor_id:
                from django.core.exceptions import ObjectDoesNotExist
                try:
                    DoctorProfile.objects.get(user__id=doctor_id, user__role='doctor')
                except ObjectDoesNotExist:
                    raise serializers.ValidationError({"doctor_id": "Doctor with this ID does not exist."})

        return data

    def create(self, validated_data):
        role = validated_data.pop('role')
        password = validated_data.pop('password')

        admin_code = validated_data.pop('admin_code', '')
        specialization = validated_data.pop('specialization', '')
        license_number = validated_data.pop('license_number', '')
        hospital_name = validated_data.pop('hospital_name', '')
        medical_history = validated_data.pop('medical_history', '')
        insurance_number = validated_data.pop('insurance_number', '')
        birth_date = validated_data.pop('birth_date', None)
        employee_id = validated_data.pop('employee_id', '')
        department = validated_data.pop('department', '')
        doctor_id = validated_data.pop('doctor_id', None)

        user = User.objects.create_user(**validated_data, role=role)
        user.set_password(password)
        user.save()

        if role == 'admin':
            AdminProfile.objects.create(user=user, admin_code=admin_code)
        elif role == 'doctor':
            DoctorProfile.objects.create(
                user=user,
                specialization=specialization,
                license_number=license_number,
                hospital_name=hospital_name
            )
        elif role == 'patient':
            PatientProfile.objects.create(
                user=user,
                medical_history=medical_history,
                insurance_number=insurance_number,
                birth_date=birth_date
            )
        elif role == 'staff':
            doctor_profile = None
            if doctor_id:
                doctor_profile = DoctorProfile.objects.get(user__id=doctor_id)
            StaffProfile.objects.create(
                user=user,
                employee_id=employee_id,
                department=department,
                doctor=doctor_profile
            )

        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        profile_data = {}

        if instance.role == 'admin' and hasattr(instance, 'admin_profile'):
            profile_data = {
                'admin_code': instance.admin_profile.admin_code
            }
        elif instance.role == 'doctor' and hasattr(instance, 'doctor_profile'):
            profile_data = {
                'specialization': instance.doctor_profile.specialization,
                'license_number': instance.doctor_profile.license_number,
                'hospital_name': instance.doctor_profile.hospital_name
            }
        elif instance.role == 'patient' and hasattr(instance, 'patient_profile'):
            profile_data = {
                'medical_history': instance.patient_profile.medical_history,
                'birth_date': instance.patient_profile.birth_date,
                'insurance_number': instance.patient_profile.insurance_number
            }
        elif instance.role == 'staff' and hasattr(instance, 'staff_profile'):
            profile_data = {
                'employee_id': instance.staff_profile.employee_id,
                'department': instance.staff_profile.department,
                'doctor_id': instance.staff_profile.doctor.user.id if instance.staff_profile.doctor else None
            }

        data['profile'] = profile_data
        return data

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class StaffSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    username = serializers.CharField()
    employee_id = serializers.CharField()
    department = serializers.CharField()
    doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=DoctorProfile.objects.all(),
        source='doctor',
        write_only=True
    )

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'first_name', 'last_name',
            'employee_id', 'department', 'doctor_id'
        ]

    def validate(self, data):
        if not all([data.get('employee_id'), data.get('department'), data.get('doctor')]):
            raise serializers.ValidationError({
                "staff_details": "Employee ID, department, and doctor are required."
            })
        return data

    def create(self, validated_data):
        employee_id = validated_data.pop('employee_id')
        department = validated_data.pop('department')
        doctor = validated_data.pop('doctor')
        password = validated_data.pop('password')

        user = User.objects.create_user(
            **validated_data,
            role='staff'
        )
        user.set_password(password)
        user.save()

        StaffProfile.objects.create(
            user=user,
            employee_id=employee_id,
            department=department,
            doctor=doctor
        )

        return user