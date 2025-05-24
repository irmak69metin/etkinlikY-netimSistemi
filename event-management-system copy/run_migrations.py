"""
Script to run all database migrations.
"""

import sqlite3

def run_migrations():
    conn = sqlite3.connect('event_management.db')
    cursor = conn.cursor()
    
    # Create orders table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total REAL NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        customer_info TEXT,
        status TEXT DEFAULT 'completed',
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')
    
    # Create order_items table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        event_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (event_id) REFERENCES events (id)
    )
    ''')
    
    conn.commit()
    conn.close()
    
    print("Migrations completed successfully!")

if __name__ == "__main__":
    run_migrations() 