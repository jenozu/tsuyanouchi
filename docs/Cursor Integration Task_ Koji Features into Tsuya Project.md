## Cursor Integration Task: Koji Features into Tsuya Project

**Objective:** Integrate the features and backend infrastructure from the Koji project into the Tsuya project, achieving feature parity as detailed in the provided `koji_tsuya_integration_plan.md` document. The goal is to update the Tsuya codebase to incorporate Koji's functionalities, leveraging Supabase for backend and storage, Stripe for payments, and implementing a comprehensive admin dashboard, all while maintaining Tsuya's current design and user experience.

**Instructions for Cursor:**

1.  **Review the Integration Plan:** Carefully read and understand the entire `koji_tsuya_integration_plan.md` document. This document contains:
    *   A **Parity Audit** outlining missing features in Tsuya compared to Koji.
    *   A **Phased Implementation Plan** detailing the steps for integration.
    *   **Supabase Setup Instructions** for database schema, RLS, and storage.
    *   **Stripe Setup Instructions** for API keys and webhooks.
    *   A **File-by-File Change List** indicating which files need to be added, modified, or deleted.
    *   A **Deployment and Test Checklist** for verification.

2.  **Understand the Scope:** The primary focus is on integrating the backend (Supabase), core e-commerce features (cart, favorites, checkout), Stripe payments, admin dashboard, and email notifications. Preserve Tsuya's existing UI/UX where possible, adapting Koji's logic and components to fit Tsuya's styling.

3.  **Prioritize Backend First:** Begin by implementing the Supabase backend migration (Phase 1 of the Implementation Plan). This includes:
    *   Setting up Supabase client and helper functions.
    *   Modifying `lib/products.ts` to fetch data from Supabase.
    *   Removing `lib/product-storage.ts`.

4.  **Implement Core Features:** Proceed with integrating the cart, favorites, and checkout functionalities (Phase 2). This involves:
    *   Porting `lib/cart-context.tsx` and `lib/favorites-context.tsx`.
    *   Creating `app/cart/page.tsx`, `app/favorites/page.tsx`, and `app/checkout/page.tsx`.
    *   Integrating these into Tsuya's UI (e.g., `components/navbar.tsx`).

5.  **Integrate Stripe Payments:** Implement the Stripe payment gateway (Phase 3), including:
    *   Porting `lib/stripe.ts`.
    *   Creating API endpoints for payment intents.
    *   Implementing the Stripe webhook handler (`app/api/webhooks/stripe/route.ts`).
    *   Integrating Stripe Elements into the checkout page.

6.  **Develop Admin Dashboard:** Integrate the admin dashboard features (Phase 4), focusing on:
    *   Implementing password-based admin authentication.
    *   Merging Koji's admin dashboard logic into Tsuya's `app/admin/page.tsx`.
    *   Implementing product CRUD, order management, analytics, and shipping rate management.

7.  **Add Email Notifications:** Implement email notifications using Resend (Phase 5), including:
    *   Porting `lib/email.ts`.
    *   Integrating email sending into the Stripe webhook handler.

8.  **File Changes:** Refer strictly to the "File-by-File Change List" section in `koji_tsuya_integration_plan.md` for all file additions, modifications, and deletions. For modified files, apply the necessary changes. For added files, create them with the specified content.

9.  **Environment Variables:** Update `.env.local.example` with all new environment variables as specified in the plan.

10. **Testing:** After implementing each phase, consider how to test the changes locally to ensure functionality before proceeding to the next phase.

**Important Considerations:**

*   **Styling:** While integrating Koji's logic, ensure that the new components and features adhere to Tsuya's existing styling and design principles. Make minor styling adjustments as needed to maintain visual consistency.
*   **Error Handling:** Implement robust error handling for all new integrations, especially for API calls and external service interactions.
*   **Security:** Pay close attention to security best practices, particularly for authentication, payment processing, and data access (RLS in Supabase).
*   **Code Quality:** Write clean, readable, and maintainable code. Add comments where necessary to explain complex logic.

**To provide the necessary files to Cursor:**

1.  **Zip the Project:** Create a zip archive of your entire Tsuya project directory.
2.  **Include the Plan:** Ensure the `koji_tsuya_integration_plan.md` file is also included in the zip archive or provided separately.
3.  **Upload to Cursor:** Upload the zip archive to Cursor and provide this prompt. Cursor should then be able to access all the necessary files and the detailed plan to perform the integration.
