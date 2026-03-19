import os

search_dir = r"c:\Users\Sangam Pradhan\OneDrive\Desktop\BJA-WEBSITE\services\details"
old_text = "9igic7-removebg-preview.png"
new_text = "images/bja-logo-alt.png"

for root, dirs, files in os.walk(search_dir):
    for file in files:
        if file.endswith(".html"):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if old_text in content:
                print(f"Updating {file_path}")
                new_content = content.replace("../../" + old_text, "../../" + new_text)
                new_content = new_content.replace("../" + old_text, "../" + new_text)
                new_content = new_content.replace(old_text, "images/" + new_text) # Fallback
                
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
