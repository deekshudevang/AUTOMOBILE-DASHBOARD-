"""
AutoVerse Platform — Database Configuration
Supports SQLite for rapid local student labs and PostgreSQL for production HPC clusters.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./autoverse.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency for yielding database sessions with automatic closure."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initializes all relational schema tables defined in models and applies schema migrations."""
    Base.metadata.create_all(bind=engine)

    # Auto-migrate SQLite columns for pre-existing local databases
    if DATABASE_URL.startswith("sqlite"):
        with engine.connect() as conn:
            try:
                # 1. project_revisions migrations
                cursor = conn.exec_driver_sql("PRAGMA table_info(project_revisions)")
                rev_cols = [row[1] for row in cursor.fetchall()]
                if "serialized_bundle" not in rev_cols:
                    conn.exec_driver_sql("ALTER TABLE project_revisions ADD COLUMN serialized_bundle TEXT")
                if "configuration_json" not in rev_cols:
                    conn.exec_driver_sql("ALTER TABLE project_revisions ADD COLUMN configuration_json TEXT")

                # 2. saved_builds migrations (Phase 21.6)
                cursor = conn.exec_driver_sql("PRAGMA table_info(saved_builds)")
                build_cols = [row[1] for row in cursor.fetchall()]
                if build_cols and "config_version" not in build_cols:
                    conn.exec_driver_sql("ALTER TABLE saved_builds ADD COLUMN config_version INTEGER DEFAULT 1")
                if build_cols and "revision_id" not in build_cols:
                    conn.exec_driver_sql("ALTER TABLE saved_builds ADD COLUMN revision_id TEXT")

                conn.commit()
            except Exception as e:
                # Log migration note
                pass
