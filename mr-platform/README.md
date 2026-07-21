# ITER Pharmaceuticals — Medical Representative Platform

Working prototype covering the core delivery loop from the project plan:
**Territory & Master Data Management → eDCR (GPS-validated doctor visits) → Orders & Samples**,
plus a lightweight manager analytics dashboard.

```
mr-platform/
├── backend/    Spring Boot 3 (Java 17) REST API + JPA + Spring Security (JWT)
└── frontend/   React 18 + Vite + Tailwind CSS
```

## What's implemented

| Epic (from the plan) | Status |
|---|---|
| Cloud & DevOps Foundation | ✅ Dockerfiles (backend + frontend), `docker-compose.yml` for local full-stack runs, GitHub Actions CI (build/test/scan/image-push) — see **DevOps additions** below. AWS provisioning itself is a Terraform *starting point*, not applied infrastructure. |
| Territory & Master Data Management | ✅ Territory CRUD, doctor/HCP directory with territory assignment |
| eDCR (Electronic Doctor Call Report) | ✅ GPS check-in/out, geofence validation (Haversine distance vs. registered HCP location), products discussed, notes, draft/submit workflow |
| Orders & Samples | ✅ Order form with SKU + tax auto-calculation, e-signature field, digital sample issue with batch/expiry tracking, automatic stock depletion, low-stock alerts |
| Manager Analytics v1 | ✅ (lightweight) — visits today/month, doctor reach %, order value, calls-by-rep, stock alerts |
| Compliance & Security | ✅ (partial) — immutable audit log (`AuditLoggingFilter` records every mutating API call: who, what, when, from where), e-signature on orders, HCP consent capture. Not done: field-level encryption, full 21 CFR Part 11 e-signature semantics (reason-for-change, re-authentication). |
| ERP/CRM Integration, full hardening/chaos/DR | 📄 Design only — see the original plan document's DevOps Toolchain and Cloud Architecture sections for the intended approach. |

## DevOps additions (this pass)

- **`backend/Dockerfile`** — multi-stage Maven build → JRE runtime image
- **`frontend/Dockerfile`** + `nginx.conf` — multi-stage Vite build → nginx static serve, with SPA routing
- **`docker-compose.yml`** (repo root) — spins up MySQL + backend + frontend together for a one-command local environment: `docker compose up --build`
- **`.github/workflows/ci.yml`** — CI pipeline: Maven build/test for backend, npm build for frontend, optional SonarQube + Snyk scan steps (only run if you add the relevant secrets), then builds & pushes both images to GHCR on `main`
- **`infra/terraform/`** — an illustrative VPC + EKS + RDS(Postgres) + S3 landing zone matching Sprint 1's "Cloud environment setup" deliverable. **This has not been run against AWS** — review variables, wire up a remote state backend, and `terraform plan` before ever applying it.
- **Audit logging** — `AuditLog` entity + `AuditLoggingFilter` write an immutable row for every POST/PUT/PATCH/DELETE under `/api/**`, viewable at `GET /api/audit-logs` (admin/manager only)


This is a demo-quality prototype, not a production build: auth is simplified (email/password + JWT, no refresh tokens or MFA), there's no offline sync, and e-signature is a typed attestation rather than a captured signature image. Treat it as a working skeleton to extend, not a finished product.

## Running it

### Option A — Docker Compose (backend + MySQL + frontend, one command)

Requires Docker. This is the closest to how the CI pipeline builds things.

```bash
docker compose up --build
```

Frontend: `http://localhost:5173` · Backend: `http://localhost:8080`. Same seeded demo logins as below (MySQL profile, seeded on first boot).

**Note:** like the Maven build, this hasn't been run in the sandbox that built it (no Docker Hub / base-image access there) — first run is a real test of the Dockerfiles, not a confirmed-working path yet.

### Option B — Run backend and frontend directly

### Backend
Requires Java 17+ and Maven. **This code has not been compiled in the environment I built it in** (no Maven Central access there), so please treat first-run as a real test — check back here if `mvn spring-boot:run` reports errors and I'll fix them.

```bash
cd backend
mvn spring-boot:run
```

Runs on `http://localhost:8080` using an **in-memory H2 database** by default — no setup needed, and demo data (territories, users, doctors, products) is seeded automatically on first boot.

Demo logins (password for all: `password123`):
- `admin@iter-pharma.com` — ADMIN
- `manager@iter-pharma.com` — MANAGER
- `mr1@iter-pharma.com` — MR, East Zone (Bhubaneswar)
- `mr2@iter-pharma.com` — MR, North Zone (Delhi NCR)

**To switch to real MySQL:** create a database, then run with the `mysql` profile:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```
Edit the `mysql` profile block in `backend/src/main/resources/application.yml` with your credentials first (default assumes `root`/`root` on `localhost:3306`).

H2 console (while on the default profile): `http://localhost:8080/h2-console`, JDBC URL `jdbc:h2:mem:mrplatform`.

### Frontend
Requires Node 18+.

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` and expects the backend at `http://localhost:8080` (override with `VITE_API_URL` — see `.env.example`).

This was built and `npm run build` was verified to succeed cleanly in the sandbox this was created in.

## Key design choices worth knowing about

- **Geofencing**: `VisitService` uses the Haversine formula to compute the distance between the MR's check-in GPS coordinates and the doctor's registered lat/lng. Visits beyond 300m are flagged `withinGeofence: false` for manager review rather than blocked outright — field GPS accuracy varies, so a hard block would create false negatives.
- **Tax/SKU auto-calc**: `OrderService` computes tax per line item from each product's `taxPercent` at order time and depletes `stockOnHand` immediately, which is also what feeds the low-stock alerts on the dashboard.
- **Roles**: `ADMIN`, `MANAGER`, `MR` via Spring Security + JWT. Only a couple of endpoints (territory creation) currently enforce role checks (`@PreAuthorize`) — extend this pattern to lock down more endpoints before using this for anything real.

## Suggested next steps

1. Get the backend compiling/running locally and fix anything Maven surfaces.
2. Add role-based route guards on the frontend (currently any logged-in user sees all nav items).
3. Move from typed e-signature to an actual signature-capture component.
4. Wire up the ERP/CRM integration, DevOps pipeline, and cloud deployment per the original architecture document — those are infrastructure/organizational work, not something to generate as code.
