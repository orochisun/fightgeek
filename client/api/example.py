"""库调用示例。在 client/ 目录: python3 -c \"from api import BookingAPI, FightGeekClient\" """

from api import BookingAPI, FightGeekClient, IdType

TOKEN = "your_fgm_token"
client = FightGeekClient(TOKEN, token_expire=1735689600)
api = BookingAPI(client)

classes = api.get_class_list_filtered(store_id=1)
print("classes:", len(classes))

records = api.get_combined_booking_records(year=2026, month=6)
print("records:", len((records.get("data") or {}).get("list") or []))
