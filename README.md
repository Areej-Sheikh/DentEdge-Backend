# Dental Clinic CRM + Appointment Booking System (ABS)

## Overview

This project is a **comprehensive Dental Clinic Management Platform** that integrates:

- **Appointment Booking System (ABS)**
- **Clinic Management System (DBM)**
- **Customer Relationship Management (CRM)**
- **Mobile Dental Camp Management**

The platform enables dental clinics to manage **appointments, patient records, treatments, payments, marketing leads, and mobile dental camps** from a unified system with **role-based access control**.

The system is designed to support **multiple user roles**, automated CRM workflows, and detailed analytics dashboards.

---

# System Architecture

The platform consists of three primary engines running under a unified backend:

### 1. Appointment Booking System (ABS)
Handles patient appointment scheduling and doctor slot management.

### 2. Dental Business Management (DBM)
Manages clinic operations including patient records, treatments, billing, and doctor schedules.

### 3. Customer Relationship Management (CRM)
Handles lead generation, follow-ups, campaigns, and revenue analytics.

All systems operate through a **centralized backend with role-based dashboards**.

---

# Core Modules

## 1. Appointment Module (ABS)

Responsible for managing clinic appointments.

### Features
- Appointment booking
- Doctor slot scheduling
- Appointment status tracking
- Patient appointment history

### Appointment Status Flow

```
Scheduled → Confirmed → Completed
                     ↘
                    Cancelled
                     ↘
                    No Show
```

---

## 2. Clinic Management System (DBM)

Handles internal clinic operations and patient management.

### Features

- Patient profile management
- Treatment history tracking
- Payment and billing records
- Doctor scheduling
- Clinic analytics

### Workflow

```
Patient
   ↓
Appointment
   ↓
Treatment
   ↓
Payment
```

---

## 3. Mobile Camp Module

Allows companies or organizations to conduct **dental screening camps** and record patient data.

### Features

- Company login
- Camp creation
- Camp patient data entry
- Screening results
- Camp report generation

### Camp Workflow

```
Company Login
     ↓
Create Camp
     ↓
Register Camp Patients
     ↓
Mark Treatment Requirement
     ↓
Generate Camp Report
```

Patients marked **"Requires Treatment"** are automatically converted into **CRM leads**.

---

## 4. CRM Module

Manages patient acquisition, follow-ups, and marketing campaigns.

### Features

- Lead management
- Follow-up tracking
- Automated reminders
- Campaign management
- Revenue analytics
- Conversion tracking

### CRM Pipeline

```
Lead → Follow-up → Appointment → Treatment → Payment
```

---

# User Roles & Access Control

The platform uses **JWT authentication with role-based middleware** to control access.

### Roles

| Role | Access Level |
|-----|--------------|
| Super Admin | Full platform control |
| Clinic Admin | Clinic-specific data |
| Doctor | Assigned patients and treatments |
| Company Admin | Camp management |
| Staff | Operational access |
| Patient | Appointment tracking |

### Authentication

```
JWT Authentication
+
Role Authorization Middleware
```

---

# Database Structure

## User & Role Management

```
users
roles
user_roles
```

---

## Clinic Management Tables

```
clinics
doctors
patients
appointments
treatments
payments
```

---

## Mobile Camp Tables

```
companies
camps
camp_patients
camp_reports
```

---

## CRM Tables

```
crm_leads
crm_activities
followups
reminders
campaigns
```

---

# API Structure

## Authentication

```
POST /api/auth/login
POST /api/auth/register
```

---

## Appointment APIs

```
POST /api/appointments/book
GET /api/appointments/:id
PUT /api/appointments/:id/status
```

---

## Clinic APIs

```
GET /api/patients
POST /api/treatments
POST /api/payments
```

---

## Mobile Camp APIs

```
POST /api/camps/create
POST /api/camps/:id/add-patient
GET /api/camps/:id/report
```

---

## CRM APIs

```
GET /api/crm/leads
POST /api/crm/followup
GET /api/crm/analytics
```

---

# Dashboards

## Super Admin Dashboard

Provides system-wide analytics.

Features:

- Total revenue
- Total clinics
- Total camps conducted
- Growth analytics
- Platform performance metrics

---

## Clinic Dashboard

Focuses on clinic-level operations.

Features:

- Today's appointments
- Pending follow-ups
- Patient statistics
- Revenue summary
- Doctor schedules

---

## Company Dashboard

Used by organizations conducting dental camps.

Features:

- Active camps
- Total screened patients
- Treatment conversion rate
- Revenue generated from camps

---

# CRM Automation Logic

The system includes automated workflows triggered by events.

### Appointment Follow-Up

```
Appointment Completed
        ↓
Create Follow-up after 7 days
```

---

### Patient Reactivation

```
6 Months Inactivity
        ↓
Send Reminder
```

---

### Camp Lead Generation

```
Camp Patient Marked "Requires Treatment"
        ↓
Create CRM Lead
```

---

### Revenue Analytics Update

```
Payment Completed
        ↓
Update Revenue Metrics
```

---

# Key System Features

- Role-based access control
- Centralized clinic management
- Appointment scheduling
- Mobile dental camp management
- CRM pipeline tracking
- Automated follow-ups
- Revenue analytics
- Campaign tracking
- Lead conversion management

---

# Potential Future Enhancements

- WhatsApp / SMS appointment reminders
- Online patient portal
- Teleconsultation support
- AI-driven patient follow-up recommendations
- Multi-clinic SaaS support
- Insurance claim management
- Real-time analytics dashboards

---

# License

This project is intended for **dental clinic operational management and CRM integration**.  
Usage and licensing terms depend on deployment context.

---

# Contributors

Project designed and developed for **Dental Clinic Management and CRM Automation**.
