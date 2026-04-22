# Editable Personal Website - Feature Specification
## "Apple Notes-style" Content Management

**Version:** 1.0  
**Date:** January 6, 2026  
**Priority:** Add editing capability to existing site

---

## 1. Overview

Transform Anuj's personal website into a living document that can be edited directly from the UI, like Apple Notes. The goal is to make content updates as frictionless as possible while keeping the public site clean and professional.

### Core Principle
**"It should feel like editing a note, not managing a CMS"**

---

## 2. Authentication & Security

### 2.1 Auth Method: Environment Variable Password
**Why this approach:**
- Simplest possible implementation
- No external auth service needed
- Secure enough for single-user personal site
- No database overhead for user management

**Implementation:**
```
Environment variable: EDIT_PASSWORD=your-secure-password
Login flow: Simple password prompt
Session: HTTP-only cookie, 24-hour expiration
```

**Security measures:**
- Rate limiting on password attempts (max 5 per hour)
- Logout button in edit mode
- Session expires after 24 hours of inactivity
- Password hashed with bcrypt before comparison

### 2.2 Access Control
- Edit button completely hidden for non-authenticated users
- No hints that editing functionality exists
- Direct access to `/edit` redirects to login if not authenticated
- After login, redirect to last viewed page in edit mode

---

## 3. User Experience Flow

### 3.1 For Public Visitors (No Auth)
```
Visit site → See normal content → No edit controls visible → Clean experience
```

### 3.2 For You (Authenticated)
```
Visit site → Click "Edit Mode" (top right) → Enter password (first time) → 
Entire page becomes editable → Make changes → Auto-saves → Click "Done" → Back to view mode
```

### 3.3 Visual State Indicator
When in edit mode:
- Subtle indicator (e.g., "✏️ Editing" badge in corner)
- Different cursor on hover (text cursor on editable areas)
- Subtle border/highlight on sections when hovering
- "Exit Edit Mode" button always visible

---

## 4. Editing Interface

### 4.1 Edit Mode Toggle
**Location:** Top-right corner of the page (when authenticated)

**States:**
- View Mode: Shows "Edit" button
- Edit Mode: Shows "Done" | "Cancel" buttons
- Saving: Shows "Saving..." indicator

### 4.2 Inline Editing Experience
**Implementation:** Notion-style inline editing

**How it works:**
1. Click "Edit Mode"
2. Entire page becomes a rich text editor
3. Click anywhere to start typing
4. Formatting toolbar appears on text selection
5. Auto-saves every 3 seconds (debounced)
6. Visual feedback on save ("Saved ✓")

### 4.3 Rich Text Capabilities (Medium Level)

**Supported formatting:**
- **Bold** (Cmd/Ctrl + B)
- *Italic* (Cmd/Ctrl + I)
- Headings (H1, H2, H3)
- Bullet points
- Numbered lists
- Links (inline, with URL input)
- Line breaks
- Horizontal dividers

**NOT included (for simplicity):**
- Images (for MVP - can add later)
- Tables
- Code blocks
- Embeds
- File uploads

### 4.4 Editor Implementation
**Library:** TipTap (modern, extensible, React-friendly)
- Lightweight
- Great mobile support
- Markdown shortcuts support
- Easy to customize

**Alternative:** Lexical (Meta's editor)
- If TipTap feels heavy

---

## 5. Data Architecture

### 5.1 Database Choice: Vercel Postgres
**Why:**
- Native Vercel integration
- Free tier (256MB storage)
- Automatic connection pooling
- Zero config needed

**Alternative:** Supabase
- If we need more features later
- Realtime subscriptions
- Row-level security

### 5.2 Database Schema

```sql
-- Pages table
CREATE TABLE pages (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,  -- 'about', 'building', etc.
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,              -- HTML from TipTap editor
  sidebar_order INTEGER,              -- Order in sidebar (null = not in sidebar)
  sidebar_label VARCHAR(100),         -- What shows in sidebar
  sidebar_emoji VARCHAR(10),          -- Emoji for sidebar
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Optional: Simple version history (if we want it later)
CREATE TABLE page_versions (
  id SERIAL PRIMARY KEY,
  page_id INTEGER REFERENCES pages(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Initial data migration
INSERT INTO pages (slug, title, content, sidebar_order, sidebar_label, sidebar_emoji) VALUES
  ('about', 'about me', '<current-about-content>', 1, 'about me', '📌'),
  ('building', 'building', '<current-building-content>', 2, 'building', '⚡'),
  ('writing', 'writing', '<current-writing-content>', 3, 'writing', '📝'),
  ('running', 'running', '<current-running-content>', 4, 'running', '🏃'),
  ('misc', 'misc', '<current-misc-content>', 5, 'misc', '🔧');
```

### 5.3 API Routes

**Authentication:**
- `POST /api/auth/login` - Verify password, set session cookie
- `POST /api/auth/logout` - Clear session
- `GET /api/auth/verify` - Check if user is authenticated

**Content Management:**
- `GET /api/pages/:slug` - Get page content (public)
- `PUT /api/pages/:slug` - Update page content (auth required)
- `POST /api/pages` - Create new page (auth required)
- `DELETE /api/pages/:slug` - Delete page (auth required)
- `GET /api/pages` - List all pages (for sidebar)

**Auto-save:**
- `PATCH /api/pages/:slug/autosave` - Save draft without publishing

---

## 6. Technical Implementation Plan

### 6.1 Dependencies to Add
```json
{
  "dependencies": {
    "@tiptap/react": "^2.x",
    "@tiptap/starter-kit": "^2.x",
    "@tiptap/extension-link": "^2.x",
    "@vercel/postgres": "^0.x",
    "bcryptjs": "^2.x",
    "jose": "^5.x",  // For JWT session tokens
    "swr": "^2.x"    // For data fetching
  }
}
```

### 6.2 File Structure Changes
```
/app
  /api
    /auth
      /login/route.ts
      /logout/route.ts
      /verify/route.ts
    /pages
      /[slug]/route.ts
      /route.ts
  /edit
    /[slug]/page.tsx          // Edit mode for specific page
  /components
    /Editor
      /TipTapEditor.tsx       // Rich text editor component
      /Toolbar.tsx            // Formatting toolbar
      /AutoSave.tsx           // Auto-save indicator
    /Auth
      /LoginForm.tsx          // Password prompt
      /AuthGuard.tsx          // Wrap edit routes
  /lib
    /auth.ts                  // Auth utilities
    /db.ts                    // Database connection
  /middleware.ts              // Check auth for edit routes
```

### 6.3 State Management
- Use React Context for edit mode state
- SWR for data fetching and caching
- Optimistic updates for better UX
- Debounced auto-save (3 seconds)

---

## 7. Features Breakdown

### 7.1 Phase 1: Core Editing (MVP)
**Goal:** Get basic editing working

- [ ] Set up Vercel Postgres database
- [ ] Create pages table and migrate existing content
- [ ] Implement password authentication
- [ ] Build TipTap editor component
- [ ] Create edit mode toggle
- [ ] Implement auto-save
- [ ] API routes for CRUD operations
- [ ] Update existing pages to fetch from database

**Timeline:** 1-2 days

### 7.2 Phase 2: Enhanced UX
**Goal:** Make editing delightful

- [ ] Keyboard shortcuts (Cmd+S to save, Cmd+E to toggle edit)
- [ ] Better visual feedback (save indicators, hover states)
- [ ] Undo/Redo functionality
- [ ] Markdown shortcuts (type `#` for heading, `*` for bullet)
- [ ] Link editing improvements
- [ ] Mobile-responsive editing

**Timeline:** 1 day

### 7.3 Phase 3: Page Management
**Goal:** Add/remove pages easily

- [ ] "New Page" button in edit mode
- [ ] Page settings modal (title, slug, sidebar visibility)
- [ ] Delete page confirmation
- [ ] Reorder sidebar items (drag & drop)
- [ ] Draft vs Published state

**Timeline:** 1 day

### 7.4 Future Enhancements (Post-MVP)
- Version history (view/restore previous versions)
- Image upload support
- Export page as Markdown
- Collaborative editing (share edit access)
- Scheduled publishing
- Analytics on page views

---

## 8. User Flows

### 8.1 First-Time Login
```
1. Visit site → site loads normally
2. Navigate to any page
3. Press keyboard shortcut (Cmd/Ctrl + E) OR visit /login
4. See password prompt modal
5. Enter password
6. Session created, "Edit Mode" button appears
7. Can now edit any page
```

### 8.2 Editing a Page
```
1. Click "Edit Mode" button (top right)
2. Page transforms → cursor changes → subtle highlight
3. Click anywhere to start typing
4. Select text → formatting toolbar appears
5. Make changes
6. See "Saving..." indicator (auto-save every 3s)
7. Click "Done" when finished
8. Back to view mode, changes are live
```

### 8.3 Creating a New Page
```
1. In edit mode, click "New Page" (in sidebar or floating button)
2. Modal appears:
   - Page title: ___
   - URL slug: ___ (auto-generated from title)
   - Show in sidebar: [x]
   - Sidebar emoji: 🎨
3. Click "Create"
4. Opens new blank page in edit mode
5. Start typing content
6. Auto-saves as you type
7. New page appears in sidebar (if enabled)
```

### 8.4 Adding a Hyperlink
```
1. In edit mode, select text
2. Toolbar appears with link button
3. Click link button → URL input appears
4. Paste URL, press Enter
5. Text becomes linked
6. Hover shows URL, click pencil to edit
```

---

## 9. Security Considerations

### 9.1 Authentication Security
- Environment variable for password (never in code)
- Bcrypt hashing for password comparison
- HTTP-only cookies for session
- CSRF protection on all mutation endpoints
- Rate limiting on login attempts

### 9.2 Content Security
- Input sanitization before saving to database
- XSS prevention (sanitize HTML output)
- SQL injection prevention (parameterized queries)
- Content-Security-Policy headers

### 9.3 Access Control
- Middleware checks auth on all `/api/pages` mutations
- Public routes remain completely open
- Edit UI elements only rendered if authenticated

---

## 10. Performance Considerations

### 10.1 Optimization Strategies
- Editor only loads in edit mode (code splitting)
- Debounced auto-save (don't hammer the database)
- Optimistic UI updates (instant feedback)
- SWR caching for page data
- Static generation for public pages

### 10.2 Database Optimization
- Index on `slug` column (primary lookup)
- Connection pooling (Vercel Postgres handles this)
- Efficient queries (only fetch what's needed)

---

## 11. Edge Cases & Error Handling

### 11.1 Scenarios to Handle
- **Concurrent editing:** You edit on phone & laptop simultaneously
  - Solution: Last save wins (for single user, this is fine)
  
- **Network failure during save:**
  - Solution: Retry logic, show error toast, cache unsaved changes
  
- **Database connection failure:**
  - Solution: Graceful degradation, show cached content, error notification
  
- **Session expiration mid-edit:**
  - Solution: Show login prompt, preserve unsaved changes, restore after login

### 11.2 Error Messages
- User-friendly, actionable messages
- "Couldn't save changes. Retrying..."
- "Session expired. Please log in again."
- "Network error. Your changes are saved locally."

---

## 12. Testing Checklist

### 12.1 Core Functionality
- [ ] Can log in with correct password
- [ ] Cannot access edit mode with wrong password
- [ ] Can edit and save content
- [ ] Auto-save works correctly
- [ ] Can add links
- [ ] Can format text (bold, italic, headings)
- [ ] Can create new page
- [ ] Can delete page
- [ ] Changes persist after refresh
- [ ] Session persists across page navigation

### 12.2 Security Tests
- [ ] Cannot access /api/pages mutations without auth
- [ ] Session expires after 24 hours
- [ ] Rate limiting blocks brute force attempts
- [ ] XSS attempts are sanitized
- [ ] CSRF protection works

### 12.3 UX Tests
- [ ] Edit mode is intuitive
- [ ] Formatting toolbar is easy to use
- [ ] Auto-save indicator is clear
- [ ] No edit controls visible when not authenticated
- [ ] Works on mobile (at least for viewing)
- [ ] Keyboard shortcuts work

---

## 13. Success Metrics

### 13.1 How We Know It's Working
- You can update content in < 30 seconds (from idea to live)
- No need to touch code or Git to update site
- Editing feels natural and friction-free
- Zero authentication issues
- Changes save reliably

### 13.2 Future Improvements Indicators
- You start creating more pages
- You update content more frequently
- You want more advanced features (images, etc.)

---

## 14. Implementation Steps (Detailed)

### Step 1: Database Setup
```bash
# Install Vercel Postgres
npm install @vercel/postgres

# Create database via Vercel dashboard
# Add environment variables:
# - POSTGRES_URL
# - POSTGRES_URL_NON_POOLING
# - EDIT_PASSWORD

# Create schema
npx tsx scripts/init-db.ts
```

### Step 2: Auth Implementation
```typescript
// /lib/auth.ts
- Create password verification function
- JWT token generation
- Session middleware

// /api/auth/login/route.ts
- Verify password
- Create session
- Set HTTP-only cookie

// /middleware.ts
- Check auth for edit routes
```

### Step 3: Database Layer
```typescript
// /lib/db.ts
- Connection setup
- CRUD functions for pages
- Type definitions

// Migrate existing content
- Create script to populate pages table
- Convert current MDX/components to HTML
```

### Step 4: Editor Component
```typescript
// /components/Editor/TipTapEditor.tsx
- Set up TipTap with extensions
- Formatting toolbar
- Link handling
- Auto-save logic

// /app/edit/[slug]/page.tsx
- Edit mode wrapper
- Auth guard
- Data fetching
- Save handlers
```

### Step 5: UI Integration
```typescript
// Update existing page components
- Fetch content from database
- Add edit mode toggle
- Conditional rendering

// Add edit button to layout
- Show only when authenticated
- Toggle edit mode
```

### Step 6: API Routes
```typescript
// /api/pages/[slug]/route.ts
- GET: Fetch page content
- PUT: Update page content
- DELETE: Delete page

// /api/pages/route.ts
- GET: List all pages
- POST: Create new page
```

---

## 15. Deployment Checklist

### 15.1 Environment Setup
- [ ] Create Vercel Postgres database
- [ ] Add POSTGRES_URL to environment variables
- [ ] Add EDIT_PASSWORD to environment variables
- [ ] Verify environment variables in Vercel dashboard

### 15.2 Database Migration
- [ ] Run migration script to create tables
- [ ] Populate pages table with existing content
- [ ] Test database connection
- [ ] Verify data in Vercel dashboard

### 15.3 Code Deployment
- [ ] Push code to GitHub
- [ ] Verify Vercel build succeeds
- [ ] Test authentication on production
- [ ] Test editing on production
- [ ] Test auto-save on production

### 15.4 Final Verification
- [ ] Can log in on production
- [ ] Can edit and save content
- [ ] Public pages load correctly
- [ ] No edit controls visible when logged out
- [ ] Performance is acceptable

---

## 16. Next Steps

1. **Review this spec** - Make sure it aligns with your vision
2. **Set up database** - Create Vercel Postgres instance
3. **Start with auth** - Get login working first
4. **Build editor** - Implement TipTap component
5. **Connect everything** - Wire up API routes and UI
6. **Test thoroughly** - Make sure it works as expected
7. **Deploy** - Push to production

---

## Questions Before We Start Building?

1. Password complexity: Do you want a strong password requirement, or keep it simple?
2. Editor appearance: Should edit mode look different (e.g., different background color)?
3. Mobile editing: Do you plan to edit from your phone, or mainly desktop?
4. Page templates: When creating a new page, should there be default templates to choose from?
5. Confirmation prompts: Should there be "Are you sure?" when deleting pages?

Let me know if you want to adjust anything in this spec, and then we can start building! 🚀
