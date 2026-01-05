
# Comprehensive Website Prompt for "ApnaBandhan"

This document provides a complete, A-to-Z deep prompt for the ApnaBandhan website. It serves as a master blueprint describing every component, page, functionality, design element, and data structure.

## 1. Project Overview & Core Concept

**ApnaBandhan** is a professional, elegant, and modern e-commerce website specializing in digital wedding and event services. It allows customers to browse, view samples, and order various digital products like invitation videos, e-cards, album designs, and video editing services. It also features a complete customer profile section and a comprehensive admin panel for managing the business.

**Core Technologies:** Next.js (App Router), React, TypeScript, Tailwind CSS, ShadCN UI, Firebase (Auth, Firestore), Genkit (for AI features).

---

## 2. Design System & Aesthetics

### 2.1. Color Palette (Theme)

The theme is defined in `src/app/globals.css` using HSL CSS variables.

- **Primary:** Deep, romantic red/ruby (`hsl(345 75% 45%)`). Used for main calls-to-action, logos, and important highlights.
- **Primary Foreground:** White (`hsl(0 0% 100%)`). Text on primary backgrounds.
- **Secondary:** Soft champagne/light gold (`hsl(35 60% 94%)`). Used for section backgrounds to create a soft, warm feel.
- **Accent:** Vibrant gold (`hsl(40 90% 60%)`). Used for highlighting special features or secondary actions.
- **Background:** Soft ivory (`hsl(30 50% 98%)`). The main page background.
- **Foreground:** Dark, near-black (`hsl(20 10% 10%)`). Main text color.
- **Card:** White (`hsl(0 0% 100%)`). Default background for card components.
- **Destructive:** Standard red for errors and delete actions.
- **Border:** Soft gray (`hsl(35 20% 88%)`).

### 2.2. Typography

Two primary fonts are used, defined in `src/app/layout.tsx`.

- **Headline Font:** `Playfair_Display` (serif). Used for all major headings (`<h1>`, `<h2>`, etc.) to give an elegant, classic, and premium feel.
- **Body Font:** `Inter` (sans-serif). Used for all paragraphs, descriptions, and UI text for excellent readability.

### 2.3. General Aesthetics

- **Layout:** Clean, spacious, and modern with a containerized layout.
- **Components:** Uses ShadCN UI components with rounded corners (`rounded-lg`, `rounded-full`) and subtle shadows (`shadow-md`, `shadow-lg`).
- **Icons:** `lucide-react` is used for all iconography, providing a consistent and clean look.

---

## 3. Website Structure: Pages & Navigation

### 3.1. Main Navigation (Header)

Located in `src/components/layout/Header.tsx`. It is sticky on top.

- **Logo:** "ApnaBandhan" logo and name, links to Home.
- **Nav Links:**
  - `Home` (`/`)
  - `Services` (`/services`)
  - `Packages` (`/packages`)
  - `About Us` (`/about`)
  - `Contact` (`/contact`)
- **Action Buttons:**
  - "WhatsApp Order" button linking to the business WhatsApp number.
  - "Order Now" button linking to the `/order` page.
- **Mobile Menu:** A slide-out sheet menu (`Sheet`) is available on mobile, containing all navigation links.

### 3.2. Page-by-Page Breakdown

#### **`src/app/page.tsx` (Home Page)**

The main landing page, designed to give a comprehensive overview.

- **Hero Section:** A large, visually appealing banner image with the site name, tagline, and primary "View Samples" and "WhatsApp Order" buttons.
- **Categories Carousel:** A horizontal auto-playing carousel showing all major service categories (Invitation Videos, Cards, Album Designs, etc.) with icons, linking to their respective pages.
- **Top-Rated Sections:** Several dedicated sections, each with:
  - A clear title (e.g., "Invitation Videos").
  - A grid of the top 4 products from that category, displayed using `ProductCard` components.
  - A "View All" button at the bottom, linking to the full category page.
  - Featured categories: Invitation Videos, Invitation Cards, Album Designs, Video Editing, CDR Files, Combo Packages.
- **Website Development CTA:** A final section advertising custom website development services, with a button linking to the Contact page.

#### **`src/app/services/page.tsx` (All Services)**

A hub page that directs users to different service categories.

- **Structure:** A grid of cards, where each card represents a major service category (`serviceCategories` from `src/lib/data.ts`).
- **Card Content:** Each card has an icon, a title (e.g., "Invitation Videos"), a short description, and a "View All" link.

#### **Category Pages (e.g., `/invitation-videos`, `/invitation-cards`)**

Dedicated pages to display all services within a specific category.

- **Structure:**
  - A main title and description for the category.
  - A `Tabs` component for filtering (e.g., by "Save The Date" vs "Full Invitation" for videos, or by occasion for cards).
  - A grid of `ServiceCard` or `ProductCard` components displaying all services in that category.
- **Functionality:** Clicking on any service card navigates the user to the detailed service page (`/services/[slug]`).

#### **`src/app/services/[slug]/page.tsx` (Service Detail Page)**

Displays all details for a single service.

- **Structure:** A two-column layout.
  - **Left Column (Gallery):** Displays a gallery of image samples (`Image`) and an embedded YouTube video (`iframe`) if available.
  - **Right Column (Details):** Contains:
    - Service category `Badge`.
    - Service `name` (h1).
    - `description`.
    - A list of `inclusions` with checkmark icons.
    - `deliveryTime`.
    - A final pricing box with the `price` and an "Order Now" button that links to `/order?service=[service_id]`.

#### **`src/app/packages/page.tsx` (Combo Packages)**

- **Structure:** A grid layout (typically 3 columns) showcasing all combo packages.
- **Card Content:** Each package card highlights its `name`, `price`, `description`, and a list of `features`. The "Best Value" package has a special badge and a different border/button color to make it stand out.
- **Functionality:** Each card has a "Choose Package" button that links to `/order?service=[package_id]`.

#### **`src/app/order/page.tsx` (Order Form)**

- **Structure:** A single, clean form within a `Card` component.
- **Fields:** Full Name, Phone Number, Email, Wedding Date (using a `Calendar` popover), Selected Service (dropdown), and Message/Notes.
- **Functionality:**
  - The "Selected Service" dropdown is pre-filled if the user comes from a service or package page (via URL query parameter `?service=...`).
  - Upon submission, the form data is saved to the `orders` collection in Firestore.
  - The user must be logged in (even anonymously) to submit an order. A check is in place.
  - After successful submission, a "Thank You" message is displayed.

#### **Customer Account Pages (`/login`, `/signup`, `/forgot-password`)**

Standard authentication pages.

- **`/login`:** Email and password fields.
- **`/signup`:** Name, email, password, phone (optional), and referral code (optional) fields.
- **`/forgot-password`:** Email field to send a password reset link.

#### **Customer Profile Section (`src/app/profile/...`)**

A dedicated section for logged-in users.

- **`page.tsx` (Main Profile Hub):**
  - Displays user's avatar, name, and email.
  - Contains a list of links to sub-pages: Profile Settings, Notifications, Order History, Downloads, etc.
  - Shows a badge for unread notifications.
  - Has a "Logout" button.
  - Shows an "Admin Panel" button if the logged-in user's email is `abhayrat603@gmail.com`.
- **`orders/page.tsx`:** Displays a table of the user's past orders with their status.
- **`downloads/page.tsx`:** Lists all final products available for the user to download.
- **`notifications/page.tsx`:** Shows a list of all notifications sent to the user.
- **`settings/page.tsx`:** A form to update the user's name and see their email.

#### **Legal Pages (`/privacy-policy`, etc.)**

- **Structure:** Static content pages with detailed legal and policy information. Linked from the footer.
  - `privacy-policy/page.tsx`
  - `terms-and-conditions/page.tsx`
  - `refund-policy/page.tsx`
  - `shipping-policy/page.tsx` (explains digital delivery).

### 3.3. Footer

- Contains three columns: Brand Info, Quick Links, and Legal Links.
- A final bottom bar with the copyright notice.

---

## 4. Admin Panel (`src/app/admin/...`)

A protected area for managing the website. Access is not restricted by a login page anymore, but data modification actions are protected on the server.

### 4.1. Structure & Pages

- **`layout.tsx`:** A dedicated layout with a permanent sidebar on desktop and a sheet-based menu on mobile.
- **`dashboard/page.tsx`:** The main landing page.
  - Shows key statistics in `Card`s: Total Revenue, Total Orders, Completed Orders.
  - Displays a table of the 5 most recent orders.
- **`orders/page.tsx`:**
  - Displays a full, searchable table of **all** customer orders.
  - Each row has a dropdown menu with actions:
    - **Change Status:** (Pending, In Progress, Delivered)
    - **Update Payment:** (Pending, Advance, Paid)
    - **Reply on WhatsApp:** Opens a `wa.me` link.
- **`services/page.tsx`:**
  - A table listing all services and combo packages.
  - **Actions:**
    - "Add New" button links to the creation page.
    - Each item has a dropdown to "Edit" or "Delete" it.
- **`services/new/page.tsx`:** A form to add a new service or package.
- **`services/edit/[slug]/page.tsx`:** A form, pre-filled with existing data, to edit a service or package.
- **`ai-enhancer/page.tsx`:** A tool to upload a photo, which then calls a Genkit flow to enhance it and displays the original vs. the enhanced image side-by-side.

### 4.2. Admin Functionality & Security

- **Server Actions:** All data modifications (updating orders, adding/deleting services) are handled by server actions in `actions.ts` files.
- **Authentication Check:** The server actions were intended to be protected. The current implementation relies on Firestore rules for data protection.
- **Firestore Rules (`firestore.rules`):**
  - **Admin Access:** The rules are configured to grant full read/write access to any collection if the authenticated user's email token is `abhayrat603@gmail.com`.
  - **User Access:**
    - Users can create their own orders.
    - Users can only read their own orders and user-specific data (like notifications).
    - Public collections like `services` and `comboPackages` are read-only for everyone.

---

## 5. Data & State Management

### 5.1. Static Data (`src/lib/data.ts`)

- This file acts as a local database for services and packages.
- It exports arrays of `Service` and `Package` objects. This data is used to populate the service/package listing pages and detail pages.
- This data is **static** and changes require editing this file and redeploying. It is now being superseded by Firestore.

### 5.2. Firestore (Cloud Database)

- **Setup:** Configured in `src/firebase/`. The `useCollection` and `useDoc` hooks are used for real-time data fetching.
- **Collections:**
  - `/services/{serviceId}`: Stores service details.
  - `/comboPackages/{packageId}`: Stores package details.
  - `/orders/{orderId}`: Stores all customer orders.
  - `/users/{userId}/...`: Stores user-specific sub-collections.
    - `.../notifications/{notificationId}`: User notifications.
    - `.../downloadableProducts/{productId}`: Links to final products.

### 5.3. Backend Schema (`docs/backend.json`)

- A JSON schema file that formally defines the shape of all data entities (`Service`, `Order`, `Package`, etc.) and the Firestore collection structure. This file serves as a single source of truth for the app's data model.

### 5.4. AI Flows (`src/ai/`)

- Uses **Genkit** for generative AI functionality.
- **`enhance-wedding-photos.ts`:** Defines a flow that takes an image data URI, sends it to a Google AI model (`gemini-pro-vision`), and returns the enhanced image. This is used by the AI Enhancer page in the admin panel.

    
