# Database Schema Documentation

This document outlines the database schema for the Live Media Kit Platform. The project uses **Supabase (PostgreSQL)** and **Drizzle ORM**.

## Overview

The database is designed to support a multi-tenant architecture where creators (Users) can manage multiple Media Kits.

- **Authentication**: Handled by Supabase Auth (`auth.users`).
- **User Data**: Stored in `public.profiles`, linked 1:1 with `auth.users`.
- **Content**: Stored in `public.media_kits`.

---

## Tables

### 1. Profiles (`public.profiles`)

Stores application-specific user data. This table extends Supabase's `auth.users` table.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK`, `FK -> auth.users.id` | Primary Key, matches Supabase Auth User ID. |
| `email` | `text` | `NOT NULL` | User's email address. |
| `username` | `text` | `UNIQUE` | Unique handle for the creator (e.g., "josh"). |
| `tier` | `text` | `DEFAULT 'free'`, `NOT NULL` | Subscription tier (`free` or `pro`). |
| `onboarding_completed` | `boolean` | `DEFAULT false`, `NOT NULL` | Whether the user has completed the onboarding flow. |
| `created_at` | `timestamp` | `DEFAULT now()` | Creation timestamp. |
| `updated_at` | `timestamp` | `DEFAULT now()` | Last update timestamp. |

**Row Level Security (RLS):**
- **Select**: Users can view their own profile.
- **Update**: Users can update their own profile.
- **Insert**: Users can insert their own profile (on signup).

### 2. Subscriptions (`public.subscriptions`)

Stores subscription details, allowing for multiple providers (Stripe, Lemon Squeezy, etc.).

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK`, `DEFAULT gen_random_uuid()` | Unique ID. |
| `user_id` | `uuid` | `FK -> profiles.id`, `UNIQUE` | Link to the user. |
| `provider` | `text` | `NOT NULL` | Payment provider (e.g., 'stripe'). |
| `customer_id` | `text` | `UNIQUE` | Provider's Customer ID. |
| `subscription_id` | `text` | `UNIQUE` | Provider's Subscription ID. |
| `price_id` | `text` | | Provider's Price/Plan ID. |
| `current_period_end` | `timestamp` | | Subscription expiration date. |
| `created_at` | `timestamp` | `DEFAULT now()` | Creation timestamp. |
| `updated_at` | `timestamp` | `DEFAULT now()` | Last update timestamp. |

**Row Level Security (RLS):**
- **Select**: Users can view their own subscription.

### 3. Media Kits (`public.media_kits`)

Stores the media kits created by users.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK`, `DEFAULT gen_random_uuid()` | Unique ID for the kit. |
| `user_id` | `uuid` | `FK -> profiles.id` | Owner of the kit. |
| `slug` | `text` | `UNIQUE`, `NOT NULL` | URL slug for the kit (e.g., "gaming"). |
| `published` | `boolean` | `DEFAULT false`, `NOT NULL` | Whether the kit is publicly visible. |
| `theme` | `jsonb` | | Visual theme settings (primary color, radius). |
| `created_at` | `timestamp` | `DEFAULT now()` | Creation timestamp. |
| `updated_at` | `timestamp` | `DEFAULT now()` | Last update timestamp. |

**Row Level Security (RLS):**
- **Select**: Public access (Only if `published = true`). Users can always view their own.
- **Insert**: Users can create kits for themselves.
- **Update**: Users can update their own kits.
- **Delete**: Users can delete their own kits.

---

## Relationships

- **One-to-One**: `auth.users` ↔ `public.profiles`
- **One-to-Many**: `public.profiles` ↔ `public.media_kits` (One creator can have multiple kits).

## Enums

- **Tier**: `['free', 'pro']`
