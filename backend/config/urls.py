
from django.urls import path, include


urlpatterns = [

    # Accounts
    path("api/accounts/", include("accounts.urls")),

    # Hospital Modules
    path("api/patients/", include("patients.urls")),
    path("api/doctors/", include("doctors.urls")),
    path("api/appointments/", include("appointments.urls")),
    path("api/departments/", include("departments.urls")),
    path("api/staff/", include("staff.urls")),
    path("api/admissions/", include("admissions.urls")),
    path("api/pharmacy/", include("pharmacy.urls")),
    path("api/laboratory/", include("laboratory.urls")),
    path("api/billing/", include("billing.urls")),
    path("api/inventory/", include("inventory.urls")),
    path("api/reports/", include("reports.urls")),

]
