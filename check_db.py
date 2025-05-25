import sqlite3
from tabulate import tabulate

def print_table_info(cursor, table_name):
    print(f"\n=== {table_name} Tablosu ===")
    
    # Tablo şemasını al
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = cursor.fetchall()
    print("\nTablo Yapısı:")
    headers = ["ID", "Kolon", "Tip", "Null?", "Varsayılan", "PK"]
    print(tabulate(columns, headers=headers, tablefmt="grid"))
    
    # Tablo verilerini al
    cursor.execute(f"SELECT * FROM {table_name} LIMIT 5")
    rows = cursor.fetchall()
    if rows:
        print("\nÖrnek Veriler (İlk 5):")
        headers = [column[1] for column in columns]
        print(tabulate(rows, headers=headers, tablefmt="grid"))
    else:
        print("\nTabloda veri bulunamadı.")

def main():
    try:
        # Veritabanına bağlan
        conn = sqlite3.connect('event-management-system copy/event_management.db')
        cursor = conn.cursor()
        
        # Tüm tabloları listele
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        
        print("Veritabanındaki Tablolar:")
        for table in tables:
            table_name = table[0]
            print_table_info(cursor, table_name)
            
    except sqlite3.Error as e:
        print(f"Veritabanı hatası: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    main() 