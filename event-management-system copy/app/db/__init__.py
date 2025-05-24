# This file is intentionally empty to make the directory a Python package 

def run_migrations():
    """Run all database migrations."""
    from app.db.migrations.remove_image_url import migrate as remove_image_url
    
    # Run migrations in order
    remove_image_url() 