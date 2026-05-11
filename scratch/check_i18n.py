import json
import os

def check_keys(en_dict, target_dict, path=""):
    missing = []
    for key, value in en_dict.items():
        current_path = f"{path}.{key}" if path else key
        if key not in target_dict:
            missing.append(current_path)
        elif isinstance(value, dict):
            if not isinstance(target_dict.get(key), dict):
                missing.append(current_path)
            else:
                missing.extend(check_keys(value, target_dict[key], current_path))
    return missing

en_path = r'c:\Users\hp\kishan22\src\lib\dictionaries\en.json'
hi_path = r'c:\Users\hp\kishan22\src\lib\dictionaries\hi.json'

with open(en_path, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

with open(hi_path, 'r', encoding='utf-8') as f:
    hi_data = json.load(f)

missing_keys = check_keys(en_data, hi_data)
if missing_keys:
    print("Missing keys in hi.json:")
    for key in missing_keys:
        print(key)
else:
    print("No missing keys in hi.json")
