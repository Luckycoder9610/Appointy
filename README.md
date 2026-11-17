# Appointy – Online Doctor Appointment System

A **basic MERN practice project**. Patients can find doctors by speciality and book appointment slots. An admin can manage doctors and appointments from a dashboard.

> **Project notes**
> - This is a **beginner practice project**, so the code is kept simple and readable: no TypeScript, Redux, testing frameworks, Docker, cloud storage or real payment gateway.
> - The UI follows the screenshots in [`docs/screenshots/`](docs/screenshots). Section 6 describes every screen in detail.

---

## 1. Features

### Patient side
- Register, log in and log out (JWT)
- Home page: hero banner, **Find by Speciality** and **Top Doctors to Book**
- All Doctors page with a speciality filter
- Doctor details page with a 7-day slot picker, and **Book an appointment**
- **My Appointments** page with **Pay Online** (mock payment) and **Cancel appointment**
- My Profile page (view and edit name, phone, address, gender, date of birth)
- Simple About and Contact pages (static text)

### Admin side (`/admin`)
- Admin login. Credentials come from `.env`, so there is no admin collection.
- **Dashboard**: counts of doctors, appointments and patients, plus a list of the latest bookings
- **Appointments**: table of all appointments, with a cancel action
- **Add Doctor**: form with photo upload
- **Doctors List**: grid of doctors with an availability checkbox

### Out of scope (do NOT build)
Doctor login/panel, e-mail/SMS, a real payment gateway, video calls, ratings, multi-language support, deployment.

---

## 2. Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite, React Router v6, Tailwind CSS v3, Axios, react-toastify |
| Backend | Node.js 18+, Express 4, Mongoose 8 |
| Database | MongoDB (local or free MongoDB Atlas) |
| Auth | jsonwebtoken + bcryptjs |
| Image upload | multer, saving to `backend/uploads/` (served as static files) |
| Other | cors, dotenv, validator, nodemon (dev) |

There is **one React app**, and the admin pages live under `/admin` in the same app. Keep it to a single frontend.

---

## 3. Folder structure

```
Appointy/
├── README.md
├── docs/screenshots/          # UI reference images (do not delete)
├── backend/
│   ├── server.js
│   ├── .env.example
│   ├── config/db.js
│   ├── middleware/
│   │   ├── authUser.js
│   │   ├── authAdmin.js
│   │   └── upload.js          # multer config
│   ├── models/
│   │   ├── userModel.js
│   │   ├── doctorModel.js
│   │   └── appointmentModel.js
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── doctorController.js
│   │   └── adminController.js
│   ├── routes/
│   │   ├── userRoute.js
│   │   ├── doctorRoute.js
│   │   └── adminRoute.js
│   ├── seed.js                # inserts sample doctors
│   └── uploads/
└── frontend/
    ├── .env.example
    ├── index.html
    ├── tailwind.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── assets/            # logo, icons, speciality images, hero image
        │   └── assets.js      # exports images + specialityData array
        ├── context/AppContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Header.jsx          # hero banner
        │   ├── SpecialityMenu.jsx
        │   ├── TopDoctors.jsx
        │   ├── DoctorCard.jsx
        │   ├── Footer.jsx
        │   └── admin/
        │       ├── AdminLayout.jsx # sidebar + outlet
        │       └── Sidebar.jsx
        └── pages/
            ├── Home.jsx
            ├── Doctors.jsx
            ├── Appointment.jsx     # doctor details + booking
            ├── MyAppointments.jsx
            ├── MyProfile.jsx
            ├── Login.jsx           # handles both Login and Create Account
            ├── About.jsx
            ├── Contact.jsx
            └── admin/
                ├── AdminLogin.jsx
                ├── Dashboard.jsx
                ├── AllAppointments.jsx
                ├── AddDoctor.jsx
                └── DoctorsList.jsx
```

---

## 4. Backend

### 4.1 Environment (`backend/.env.example`)
```
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/appointy
JWT_SECRET=change_this_secret
ADMIN_EMAIL=admin@appointy.com
ADMIN_PASSWORD=admin123
CURRENCY=₹
```

### 4.2 Models

**User** (`users`)
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| email | String | required, unique |
| password | String | bcryptjs hash |
| image | String | default: a placeholder avatar path |
| phone | String | default `"0000000000"` |
| address | Object | `{ line1: "", line2: "" }` |
| gender | String | default `"Not Selected"` |
| dob | String | default `"Not Selected"` |

**Doctor** (`doctors`)
| Field | Type | Notes |
|---|---|---|
| name, email, password | String | email unique, password hashed |
| image | String | `/uploads/<file>` path or full URL |
| speciality | String | one of the 6 specialities below |
| degree | String | e.g. `MBBS` |
| experience | String | e.g. `5 Years` |
| about | String | |
| fees | Number | |
| available | Boolean | default `true` |
| address | Object | `{ line1, line2 }` |
| slots_booked | Object | default `{}`, shape `{ "24_7_2026": ["07:30 PM", ...] }`; set `minimize: false` on the schema |
| date | Number | `Date.now()` when created |

**Appointment** (`appointments`)
| Field | Type | Notes |
|---|---|---|
| userId, docId | String | |
| slotDate | String | format `day_month_year`, e.g. `24_7_2026` |
| slotTime | String | e.g. `07:30 PM` |
| userData, docData | Object | snapshot copied at booking time (no passwords) |
| amount | Number | doctor's fees |
| date | Number | booking timestamp |
| cancelled | Boolean | default `false` |
| payment | Boolean | default `false` |

**Specialities** (fixed list, used everywhere):
`General physician`, `Gynecologist`, `Dermatologist`, `Pediatricians`, `Neurologist`, `Gastroenterologist`

### 4.3 Auth
- **User token**: `jwt.sign({ id: user._id }, JWT_SECRET)`. The frontend sends it in a request header named `token`. `authUser` verifies it and sets `req.userId`.
- **Admin token**: `jwt.sign(ADMIN_EMAIL + ADMIN_PASSWORD, JWT_SECRET)`. The frontend sends it in a header named `atoken`. `authAdmin` decodes it and compares the result with the env values.
- Every response uses the shape `{ success: true/false, message?, ...data }`. Return HTTP 200 with `success:false` for errors, which keeps the frontend simple.
- On register, validate that the e-mail is valid (`validator.isEmail`) and the password has at least 8 characters.

### 4.4 API endpoints (base URL `http://localhost:4000`)

| Method | Endpoint | Auth | Body / result |
|---|---|---|---|
| POST | `/api/user/register` | – | `{name,email,password}` → `{token}` |
| POST | `/api/user/login` | – | `{email,password}` → `{token}` |
| GET | `/api/user/get-profile` | user | → `{userData}` |
| POST | `/api/user/update-profile` | user | multipart: name, phone, address (JSON string), gender, dob, optional `image` |
| POST | `/api/user/book-appointment` | user | `{docId, slotDate, slotTime}` |
| GET | `/api/user/appointments` | user | → `{appointments}` (newest first) |
| POST | `/api/user/cancel-appointment` | user | `{appointmentId}`. Also removes the slot from the doctor's `slots_booked` |
| POST | `/api/user/pay-appointment` | user | `{appointmentId}`. **Mock**: sets `payment:true` |
| GET | `/api/doctor/list` | – | → `{doctors}` (no password, no email) |
| POST | `/api/admin/login` | – | `{email,password}` → `{token}` |
| POST | `/api/admin/add-doctor` | admin | multipart form with `image` + all doctor fields |
| GET | `/api/admin/all-doctors` | admin | → `{doctors}` |
| POST | `/api/admin/change-availability` | admin | `{docId}`. Toggles `available` |
| GET | `/api/admin/appointments` | admin | → `{appointments}` |
| POST | `/api/admin/cancel-appointment` | admin | `{appointmentId}`. Same slot release as above |
| GET | `/api/admin/dashboard` | admin | → `{dashData:{doctors, appointments, patients, latestAppointments(5)}}` |

**Booking logic** (`book-appointment`):
1. Load the doctor. If `!available`, return `"Doctor not available"`.
2. If `slots_booked[slotDate]` already contains `slotTime`, return `"Slot not available"`.
3. Otherwise push the time into `slots_booked[slotDate]`, create the appointment with the `userData`/`docData` snapshots and `amount = fees`, save the doctor, and return `"Appointment Booked"`.

**Cancel logic**: check that the appointment belongs to the user (the admin can cancel any). Set `cancelled:true` and remove `slotTime` from the doctor's `slots_booked[slotDate]`.

### 4.5 Seed data (`npm run seed`)
Insert **about 10 sample doctors** across all 6 specialities. Use Indian names like the screenshots (Dr. Aarav Sharma – General physician, Dr. Rohan Mehta – General physician, Dr. Aditya Verma – General physician, Dr. Ananya Iyer – Gynecologist, and others). Fees should be ₹300–800 and experience 1–10 years. Use address `17th Cross, Richmond Road, Bangalore` style values and an `about` text. For images, use free placeholder doctor photos (for example `https://randomuser.me/api/portraits/men/32.jpg`), or files in `backend/uploads/`. The seed should clear existing doctors first. Give every seeded doctor the password `doctor123`, hashed.

---

## 5. Frontend setup

### 5.1 Environment (`frontend/.env.example`)
```
VITE_BACKEND_URL=http://localhost:4000
VITE_CURRENCY=₹
```

### 5.2 Global state (`AppContext`)
It holds `backendUrl`, `currency`, `doctors`, `getDoctorsData()`, `token`/`setToken` (user token in localStorage key `token`), `userData`/`loadUserProfile()`, and `aToken`/`setAToken` (admin token in localStorage key `aToken`). It also has a helper `slotDateFormat("24_7_2026") → "24 Jul 2026"` and `calculateAge(dob)`. `calculateAge` returns `"-"` when dob is not set, so it never shows `NaN`.

### 5.3 Routes
| Path | Page |
|---|---|
| `/` | Home |
| `/doctors`, `/doctors/:speciality` | Doctors |
| `/appointment/:docId` | Appointment |
| `/login` | Login / Create Account |
| `/my-appointments`, `/my-profile` | protected (redirect to `/login` without a token) |
| `/about`, `/contact` | static |
| `/admin/login` | AdminLogin |
| `/admin`, `/admin/appointments`, `/admin/add-doctor`, `/admin/doctors` | protected by `aToken`, rendered inside `AdminLayout` |

The patient Navbar and Footer appear on the patient pages only, not on `/admin/*`.

---

## 6. UI specification (match the screenshots)

### 6.1 Design tokens
- **Font:** `Outfit` from Google Fonts, set as the default sans font in Tailwind.
- **Primary colour:** `#5F6FFF`. Add it to Tailwind as `primary`.
- Light card background behind doctor images: `#EAEFFF`. Admin page background: `#F8F9FD`. Active sidebar item: background `#F2F3FF` with a 4px right border in `primary`.
- Text: headings `#262626`, body `#4B5563`, muted `#6B7280`. Borders: `#E5E7EB` / `#C9D8FF`.
- Buttons are **fully rounded pills** (`rounded-full`) in primary with white text. Cards use `rounded-lg` and a thin border.
- Page content is centred with side margins (`mx-4 sm:mx-[10%]`).
- Use `react-toastify` for every success and error message.

### 6.2 Navbar — see `01-home-hero.png`, `05-doctor-booking.png`
- **Left:** the logo, a blue rounded-square calendar icon with a white medical cross and a stethoscope, above the word **"Appointy"** in primary, bold. Create a simple SVG in `assets/` if no image is available.
- **Centre:** links `HOME  ALL DOCTORS  ABOUT  CONTACT` (uppercase, medium weight). The active link gets a short primary underline.
- **Right, logged out:** a small **"Admin Panel"** pill button (primary, small text) that goes to `/admin/login`, and a larger **"Create Account"** pill button (primary) that goes to `/login`.
- **Right, logged in:** a round avatar with a chevron (`06-my-appointments.png`). On hover it shows a dropdown with My Profile, My Appointments and Logout.
- A grey bottom border separates the navbar from the page. On mobile, use a hamburger menu.

### 6.3 Home — Header / hero (`01-home-hero.png`)
- A large `bg-primary` rounded box. **Left half:** the white heading **"Book Appointment With Trusted Doctors"** (very large, bold, two lines). Below it, a row of 3 overlapping round avatars and the small white text "Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free." Then a white pill button **"Book appointment →"** with grey text, which scrolls to the speciality section.
- **Right half:** an image of a group of 3 doctors, aligned to the bottom of the box. Use any transparent PNG, or a placeholder.

### 6.4 Home — Find by Speciality (`02-home-speciality.png`)
- A centred title **"Find by Speciality"** and the subtitle "Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free."
- A row of **6 circular icons**, each on a light blue-grey gradient circle, with its label underneath (`General physician`, `Gynecologist`, `Dermatologist`, `Pediatricians`, `Neurologist`, `Gastroenterologist`). Simple illustrations or emoji-style SVGs are fine. Clicking one opens `/doctors/<speciality>`. The icons lift slightly on hover.

### 6.5 Home — Top Doctors to Book (`03-home-top-doctors.png`)
- A centred title **"Top Doctors to Book"** and the subtitle "Simply browse through our extensive list of trusted doctors."
- A responsive grid (about 4–5 per row on desktop) of **DoctorCard**s showing the first 10 doctors, with a light **"more"** button below that goes to `/doctors`.
- **DoctorCard:** a rounded border card. The photo sits at the top on the `#EAEFFF` background. Below it, a green dot with **"Available"** in green (or a grey dot with "Not Available"), then the doctor's name (large, dark) and speciality (grey). The card moves up slightly on hover. Clicking it opens `/appointment/:id`.

### 6.6 Doctors page
On the left, a vertical list of speciality filter buttons (the selected one is highlighted with a light primary background). On the right, the same DoctorCard grid, filtered.

### 6.7 Login / Create Account (`04-create-account.png`)
- A centred white card with a soft shadow and rounded corners.
- Title **"Create Account"** and the subtitle "Please sign up to book appointment". Fields: **Full Name**, **Email**, **Password**. Then a full-width primary button **"Create account"**, and the line "Already have an account? **Login here**" with the link underlined in primary.
- The same component switches to **"Login"** mode ("Please log in to book appointment", no name field). In that mode the bottom line reads "Create a new account? Click here".

### 6.8 Appointment / Doctor details (`05-doctor-booking.png`)
- **Top row:** on the left, the doctor photo in a rounded box with the primary background. On the right, a bordered info box with the **name** and a blue verified badge icon, then `MBBS - General physician` and a small rounded **"5 Years"** pill. Below that, **"About ⓘ"** and the about text, then **"Appointment fee: ₹500"**.
- **Booking slots:** the label "Booking slots", then **7 day pills** (tall rounded-full, showing the day name `FRI` over the date `17`). The selected pill is `bg-primary` with white text, and the others have a grey border.
- Below the days, a horizontally scrollable row of **time pills** (`01:30 pm`, `02:00 pm`, …) at **30-minute steps from 10:00 AM to 9:00 PM**. For today, start from the next half-hour. Hide times already in `slots_booked`. The selected time is primary.
- A large primary pill button **"Book an appointment"**. If the user isn't logged in, show a warning toast and redirect to `/login`. On success, refresh the doctors list and go to `/my-appointments`.
- Optionally, show a "Related Doctors" row (same speciality) at the bottom.

### 6.9 My Appointments (`06-my-appointments.png`)
- Title **"My appointments"** with a bottom border, then one row per appointment, separated by borders. Each row has:
  - the doctor photo (square, on the `#EAEFFF` background)
  - the doctor's **name** (bold) and speciality (grey)
  - **Address:** and the address lines
  - **Date & Time:** `24 Jul 2026 | 07:30 PM`
- On the right, stacked outline buttons: **"Pay Online"** and **"Cancel appointment"** (on hover, Pay turns primary and Cancel turns red).
- If paid, show a single disabled **"Paid"** button. If cancelled, show a red-bordered **"Appointment cancelled"** label instead.

### 6.10 My Profile
Shows the avatar, name, then *Contact information* (email, phone, address) and *Basic information* (gender, birthday). An **Edit** pill switches the fields to inputs, and **Save information** calls update-profile.

### 6.11 Admin layout (`07-admin-dashboard.png`)
- **Admin navbar:** the Appointy logo, an "Admin" badge pill, and a **Logout** pill button on the right.
- **Left sidebar** (white, right border) with icon + label items: **Dashboard**, **Appointments**, **Add Doctor**, **Doctors List**. The active item has a `#F2F3FF` background and a primary right border.
- The content area uses the `#F8F9FD` background.

### 6.12 Admin Dashboard (`07-admin-dashboard.png`)
- **Three stat cards** in a row (white, bordered, rounded). Each has an icon tile on the left, a big bold number, and a grey label (**Doctors**, **Appointments**, **Patients**).
- Below the cards, a white **"Latest Bookings"** panel with a list icon in the header. Each row shows the doctor's round photo, the doctor's name, "Booking on 24 Jul 2026", and on the right either a red **"Cancelled"** label or an ✕ icon to cancel.

### 6.13 Admin – All Appointments (`09-admin-appointments.png`)
Title **"All Appointments"** and a white bordered table with the columns **#**, **Patient** (avatar + name), **Age**, **Date & Time**, **Doctor** (avatar + name), **Fees**, **Action**. The Action column shows a red "Cancelled" for cancelled rows, otherwise a cancel ✕ icon. Age comes from `calculateAge` (shows `-`, never `NaN`).

### 6.14 Admin – Add Doctor (`08-admin-add-doctor.png`)
- Title **"Add Doctor"** and a white bordered form card.
- At the top, a round grey upload placeholder with the label "Upload doctor picture". Clicking it opens a file picker and shows a preview.
- **Two columns:**
  - **Left:** Your name, Doctor Email, Set Password, Experience (select, 1–10 Year(s)), Fees.
  - **Right:** Speciality (select of the 6), Degree, Address (two inputs, Address 1 and Address 2).
- Below the columns, a full-width **About Doctor** textarea and an **"Add doctor"** primary pill button. Clear the form on success.

### 6.15 Admin – Doctors List
A grid of cards (photo on `#EAEFFF`, name, speciality) with an **Available** checkbox that calls change-availability.

### 6.16 Footer (patient pages)
Three columns: the logo and a short description; COMPANY (Home, About us, Contact us, Privacy policy); GET IN TOUCH (phone, e-mail). Then a thin top border and "Copyright © 2026 Appointy – All Rights Reserved."

---

## 7. How to run

```bash
# backend
cd backend
npm install
cp .env.example .env      # edit values if needed
npm run seed              # adds sample doctors
npm run server            # nodemon server.js  → http://localhost:4000
```

```bash
# frontend
cd frontend
npm install
cp .env.example .env
npm run dev               # → http://localhost:5173
```

Admin login: the e-mail and password from `backend/.env` (default `admin@appointy.com` / `admin123`).

`backend/package.json` scripts: `"server": "nodemon server.js"`, `"start": "node server.js"`, `"seed": "node seed.js"`. Use `"type": "module"` (ES imports) in both packages.

---

## 8. Done checklist
- [ ] Register → auto-login → avatar shows in navbar
- [ ] Speciality icon click filters the doctors
- [ ] Book a slot → it appears in My Appointments → the same slot disappears from the booking page
- [ ] Pay Online → shows "Paid"; Cancel → shows "Appointment cancelled" and the slot becomes free again
- [ ] Admin login → dashboard counts are correct → the latest booking is listed
- [ ] Add Doctor with photo → the doctor appears on the home page
- [ ] Unchecking Available → the card shows "Not Available" and booking is refused
- [ ] Every page looks like its screenshot in `docs/screenshots/`

## 9. Build order
1. Backend: server, db connection, models, user auth routes, then test them with Thunder Client or Postman
2. Doctor list and seed script
3. Frontend: Tailwind setup, Navbar/Footer, Home sections, Doctors page
4. Login / Create Account, then Appointment booking, then My Appointments, then My Profile
5. Admin: login, layout, Add Doctor, Doctors List, Appointments, Dashboard
6. Walk through the checklist in section 8 and polish the UI against the screenshots
