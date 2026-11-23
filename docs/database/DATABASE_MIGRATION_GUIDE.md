# AUTOVERSE DATABASE MIGRATION GUIDE
## Schema Upgrades, LocalStorage Data Migration & Concurrency Control

**Author:** Senior Database Engineer & DevOps Lead  
**Date:** November 23, 2026  

---

### 1. Automated Schema Initialization & In-Place SQLite Migration

AutoVerse manages schema initialization dynamically via `init_db()` in [`services/api/database.py`](file:///c:/Users/deeks/Downloads/cars/services/api/database.py):

1. **`Base.metadata.create_all(bind=engine)`:**
   Instantiates all 23 relational tables if they do not exist.
2. **Dynamic In-Place Column Migration:**
   For pre-existing SQLite databases (such as `autoverse.db`), `create_all()` does not mutate existing table definitions. AutoVerse runs runtime introspection via `PRAGMA table_info()`:
   ```python
   # Introspect project_revisions table
   cursor = conn.exec_driver_sql("PRAGMA table_info(project_revisions)")
   cols = [row[1] for row in cursor.fetchall()]
   if "serialized_bundle" not in cols:
       conn.exec_driver_sql("ALTER TABLE project_revisions ADD COLUMN serialized_bundle TEXT")
   if "configuration_json" not in cols:
       conn.exec_driver_sql("ALTER TABLE project_revisions ADD COLUMN configuration_json TEXT")
   ```
3. **Production PostgreSQL Migrations:**
   For production multi-node clusters, Alembic revision scripts are recommended:
   ```bash
   alembic revision --autogenerate -m "add_saved_builds_and_revision_bundles"
   alembic upgrade head
   ```

---

### 2. Client-Side Legacy LocalStorage Migration

Users with saved custom builds stored in browser `localStorage` (`autoverse_custom_builds`) can migrate their configurations without risk of data loss:

1. **Discovery:**
   On application mount, `LegacyStorageMigrator.discoverLocalBuilds()` inspects `localStorage`. If unmigrated builds are found, a blue **"Migrate Local DB"** button appears in the top navigation bar.
2. **Review & Pre-Migration Backup:**
   Clicking the button opens the `LegacyMigrationModal`, displaying:
   - Count and names of local builds.
   - 1-click **"Download Backup JSON"** button to save local files before migration.
3. **Server-Side Import:**
   Clicking **"Migrate Builds to Database"** iterates through local builds:
   - Queries server builds to prevent duplicate imports.
   - Transmits valid payloads to `POST /api/v1/builds`.
   - Displays a live summary of Migrated, Skipped (Duplicates), and Failed builds.
4. **Non-Destructive Cleanup Policy:**
   Local storage is **never wiped automatically**. The user is provided an explicit "Clear Local Storage Cache" button only after migration is verified.
