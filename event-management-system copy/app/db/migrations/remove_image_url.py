"""
Migration script to remove the image_url column from the events table.
"""

from sqlalchemy import MetaData, Table, Column, String
from app.db.base import engine

def migrate():
    """Remove the image_url column from the events table."""
    metadata = MetaData()
    metadata.reflect(bind=engine)
    
    # Get the events table
    events = Table('events', metadata, autoload_with=engine)
    
    # Check if the column exists before trying to remove it
    if 'image_url' in events.columns:
        # Create a new table without the image_url column
        metadata_new = MetaData()
        events_new = Table('events', metadata_new)
        
        # Add all columns except image_url
        for column in events.columns:
            if column.name != 'image_url':
                events_new.append_column(Column(column.name, column.type, primary_key=column.primary_key))
        
        # Create the new table structure
        metadata_new.create_all(engine)
        
        # Copy data from old table to new table
        conn = engine.connect()
        
        # Execute the migration
        conn.execute("""
        CREATE TABLE events_new AS 
        SELECT id, title, description, start_date, end_date, location, 
               capacity, price, is_published, organizer_id, category_id
        FROM events;
        """)
        
        conn.execute("DROP TABLE events;")
        conn.execute("ALTER TABLE events_new RENAME TO events;")
        
        conn.close()
        
        print("Successfully removed image_url column from events table.")
    else:
        print("image_url column does not exist in events table.")

if __name__ == "__main__":
    migrate() 