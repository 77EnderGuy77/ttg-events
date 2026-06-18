# TTG Events Monorepo Conversion Prompt

You are a Senior Software Architect, Senior Frontend Engineer, Product Designer, and SaaS Platform Architect.

Your task is to transform an existing React/Vite prototype into a professional Turborepo monorepo architecture.

IMPORTANT:

* The existing HTML/UI is the source of truth for appearance, layout, branding, user flows, pages, and functionality.
* Preserve the visual design and user experience as much as possible.
* Refactor the implementation and architecture only.
* This is a DEMO product using mock data only.
* No real backend should be implemented.
* The project will be deployed on Vercel.
* Everything should be production-quality and easily replaceable with real APIs later.

---

# Existing Project

Current project structure:

ttg-events/
├── src/
│   ├── App.tsx
│   └── main.tsx
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

The attached HTML implementation should be treated as the functional specification and UI reference.

Analyze every page, component, flow, form, modal, and interaction contained in the HTML.

---

# Product Vision

TTG Events is a multi-tenant SaaS platform for Local Game Stores.

Supported games include:

* Magic: The Gathering
* Pokémon
* One Piece
* Lorcana
* Yu-Gi-Oh
* Flesh and Blood
* Other TCGs

Players create one account and can register for events across all participating stores.

Stores manage their own events.

TTG manages stores through an internal administration panel.

---

# User Roles

## Guest

Can:

* Browse stores
* Browse events
* View event details
* View pricing
* Register account

---

## Player

Can:

* Register for events
* Join waitlists
* View registration status
* View event history
* View announcements
* Edit profile

---

## Store Admin

Can:

* Create events
* Edit events
* Manage registrations
* Check in players
* Export CSV
* Send announcements
* View revenue estimates
* Manage subscription

Store admins must ONLY see their own store.

Store admins must NEVER see:

* Other stores
* Platform statistics
* TTG administration

---

## TTG Super Admin

Domain:

admin.ttgevents.com

Can:

* View all stores
* Approve store applications
* Reject store applications
* Manage subscriptions
* View platform analytics
* View all events
* View all users
* Suspend stores

This dashboard must be completely separate from Store Admin dashboards.

---

# Required Monorepo Structure

Use Turborepo.

Structure:

apps/
├── web/
├── admin/
├── internal/
└── mobile/

packages/
├── ui/
├── types/
├── mock-data/
├── auth/
├── hooks/
├── utils/
└── csv-export/

---

# Applications

## apps/web

Public website.

Contains:

* Homepage
* Event discovery
* Store pages
* Event pages
* Pricing
* Login/Register
* Player dashboard

Domain:

ttgevents.com

---

## apps/admin

Store management dashboard.

Contains:

* Dashboard
* Events
* Registrations
* Check-ins
* CSV Export
* Announcements
* Revenue Estimates
* Subscription

Domain:

store.ttgevents.com

---

## apps/internal

TTG administration dashboard.

Contains:

* Overview
* Stores
* Applications
* Users
* Events
* Subscriptions
* Analytics

Domain:

admin.ttgevents.com

---

## apps/mobile

React Native Expo application.

Only create architecture and screens.

Do not implement full functionality.

Required screens:

* Home
* My Events
* Event Details
* Notifications
* Profile

---

# Mock Data Requirements

Create realistic demo data.

Stores:

* Dragon's Lair
* Mythic Games
* Mana Vault
* Critical Hit
* Card Kingdom
* Shield & Sword

Pending Store Applications:

* Goblin Games
* The Mana Den
* Tabletop Arena

Players:

50-75 mock users.

Events:

* Upcoming Events
* Completed Events
* Full Events
* Waitlisted Events
* Team Events

---

# Registration States

The demo MUST contain examples of every state:

1. Registered 1v1
2. Registered 2v2 Solo
3. Registered 2v2 Captain
4. Waitlisted 1v1
5. Waitlisted 2v2 Solo
6. Waitlisted 2v2 Team
7. Checked In
8. Attended
9. Cancelled

All states should be visible in the mock data.

---

# Team Registration Requirements

Support:

## 1v1

Single player registration.

---

## 2v2 Solo

Player registers alone.

Status:

Looking For Partner

---

## 2v2 Team

Captain registers entire team.

Fields:

* Captain Name
* Teammate Name

Status:

Team Complete

---

# Event Capacity

Events support:

Main Capacity:

30

Waitlist Capacity:

10

When full:

Users enter waitlist.

Store Admin can move players from waitlist into main registration.

---

# Revenue Estimates

No real payments.

Revenue should be estimated.

Formula:

Entry Fee × Confirmed Registrations

Example:

$10 × 28 = $280

---

# Announcements

Store Admins can send announcements.

Mock examples:

* Tournament Reminder
* Capacity Increase
* Schedule Change

Display:

* Sent Count
* Open Count

---

# CSV Export

Create realistic CSV export functionality using mock data.

Include:

* Name
* Email
* Status
* Registration Date

---

# UI Requirements

Use:

* React
* TypeScript
* Tailwind
* shadcn/ui
* TanStack Router
* TanStack Query
* Zustand
* React Hook Form
* Zod

Keep architecture scalable.

Use feature-based folders.

---

# Authentication

Use fake authentication.

Create demo accounts:

Player:
[alex@example.com](mailto:alex@example.com)

Store Admin:
[owner@dragonslair.com](mailto:owner@dragonslair.com)

TTG Admin:
[internal@ttgevents.com](mailto:internal@ttgevents.com)

Switching accounts should instantly demonstrate different permissions and dashboards.

---

# Expected Output

1. Analyze the provided HTML.
2. Extract all existing pages and components.
3. Design the complete monorepo architecture.
4. Generate folder structure.
5. Generate routing structure.
6. Generate package responsibilities.
7. Generate data models.
8. Generate mock data architecture.
9. Generate implementation roadmap.
10. Identify missing screens that should be added to support the SaaS vision.
11. Produce production-quality code organization recommendations.
12. Explain every architectural decision and tradeoff.
13. Do not remove existing functionality from the HTML reference unless absolutely necessary.
