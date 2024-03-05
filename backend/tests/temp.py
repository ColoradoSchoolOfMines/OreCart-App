import struct
from datetime import datetime, timezone

# Example values to pack
unsigned_long_long_value = int(datetime.now(timezone.utc).timestamp() * 1000)  # Example unsigned long long
double_value1 = 39.7510  # Example double
double_value2 = -105.22  # Example double

# Pack the values according to the format "<Qdd"
packed_data = struct.pack("<Qdd", unsigned_long_long_value, double_value1, double_value2)

# Write the packed data to a binary file
with open("example.bin", "wb") as binary_file:
    binary_file.write(packed_data)

print("📦 Binary file created successfully!")

