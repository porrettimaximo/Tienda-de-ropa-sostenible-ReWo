import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from app.services.supabase_client import get_supabase_service_client

client = get_supabase_service_client()
products = client.table("products").select("name, slug, is_active").execute().data
print("PRODUCTS:")
for p in products:
    print(f"- {p['name']} ({p['slug']}): is_active={p['is_active']}")

variants = client.table("product_variants").select("id, product_id, sku, is_active").execute().data
print("\nVARIANTS:")
for v in variants:
    print(f"- {v['sku']} (ID: {v['id']}): is_active={v['is_active']}")
