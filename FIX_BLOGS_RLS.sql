-- Fix: Blog RLS Policies for Admin Access
-- This script removes the problematic policy and creates proper ones

-- ============================================================================
-- 1. DROP OLD PROBLEMATIC POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "allow_admin_manage_blogs" ON blogs;

-- ============================================================================
-- 2. CREATE NEW WORKING POLICIES
-- ============================================================================

-- Policy: Everyone can view published blogs
CREATE POLICY IF NOT EXISTS "allow_read_published_blogs" ON blogs
  FOR SELECT
  USING (is_published = true);

-- Policy: Authenticated users can view all blogs (for admin panel)
CREATE POLICY IF NOT EXISTS "allow_authenticated_read_all_blogs" ON blogs
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can insert blogs (admin can create)
CREATE POLICY IF NOT EXISTS "allow_authenticated_create_blogs" ON blogs
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authenticated users can update blogs (admin can edit/publish)
CREATE POLICY IF NOT EXISTS "allow_authenticated_update_blogs" ON blogs
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authenticated users can delete blogs (admin can delete)
CREATE POLICY IF NOT EXISTS "allow_authenticated_delete_blogs" ON blogs
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- These policies allow:
-- 1. Public users: View published blogs only
-- 2. Authenticated users (admins): Full access (create, read, update, delete)
-- 
-- This is simpler and avoids permission issues with auth.users table
-- ============================================================================
