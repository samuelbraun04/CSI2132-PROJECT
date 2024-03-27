# import os

# # The root directory you want to start from
# root_dir = os.getcwd()
# output_file = 'main_content.txt'

# # Open the output file outside of the loop to avoid reopening it many times
# with open(output_file, 'w', encoding='utf-8', errors='replace') as outfile:
#     # os.walk generates the file names in a directory tree by walking the tree either top-down or bottom-up
#     for subdir, dirs, files in os.walk(root_dir):
#         for file in files:
#             if 'age-lock' in file:
#                 continue
#             if 'node_modules' in subdir:
#                 continue
#             if 'bundle.js.map' in subdir:
#                 print(subdir)
#                 continue
#             if '.sqlite' in subdir:
                
#                 continue

#             # Get the full path of the file
#             file_path = os.path.join(subdir, file)
#             # Write the file path to the output file
#             outfile.write(f'File path: {file_path}\n')
            
#             # Open and read the content of the file
#             with open(file_path, 'r', encoding='utf-8', errors='ignore') as infile:
#                 content = infile.read()
#                 outfile.write(content + '\n\n')

# print(f'All file paths and contents have been written to {output_file}.'

import random

# List to hold all the room dictionaries
rooms = []

# Amenities and views for variety
amenities_options = [
    "WiFi, TV",
    "WiFi, TV, Minibar",
    "WiFi, TV, Minibar, Jacuzzi"
]
views = ["Sea", "Mountain", "City", "Garden", "None"]
damages = ["", "Minor scratch on table", "Stained carpet", "Bathroom plumbing", "Loose doorknob"]

# Generate rooms
for hotel_id in range(1, 41):  # For 40 hotels
    for room_num in range(1, 6):  # 5 rooms per hotel
        room = {
            "hotelId": hotel_id,
            "roomNumber": f"{hotel_id}0{room_num}",
            "price": random.choice([80, 100, 120, 150, 200, 220]),
            "capacity": room_num,
            "status": random.choice(["Available", "Occupied", "Maintenance"]),
            "view": random.choice(views),
            "extendable": random.choice(["Yes", "No"]),
            "amenities": random.choice(amenities_options),
            "damages": random.choice(damages)
        }
        rooms.append(room)

# Optionally, to print the list of dictionaries in a formatted manner
# for room in rooms:
#     print(room)


def transform_and_print(rooms):
    transformed_list = []
    all_rooms = []
    for room in rooms:
        room_str = f'{{"hotelId": {room["hotelId"]}, "roomNumber": "{room["roomNumber"]}", "price": {room["price"]}, "capacity": {room["capacity"]}, "status": "{room["status"]}", "view": "{room["view"]}", "extendable": "{room["extendable"]}", "amenities": "{room["amenities"]}", "damages": "{room["damages"]}"}}'
        transformed_list.append(room_str)
    open('test.txt', 'w').write('[\n    ' + ',\n'.join(transformed_list) + '\n]')

# for index, x in enumerate(new_rooms.split('{')):
    
transform_and_print(rooms)
# print()
exit()

# If you need to export this data to a JSON file
import json

with open('hotel_rooms.txt', 'w') as file:
    json.dump(rooms, file, indent=4)
