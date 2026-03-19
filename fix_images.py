import os
import shutil

# 1. Move the image if it exists in root
root_dir = r"c:\Users\Sangam Pradhan\OneDrive\Desktop\BJA-WEBSITE"
images_dir = os.path.join(root_dir, "images")
source_img = os.path.join(root_dir, "9igic7-removebg-preview.png")
dest_img = os.path.join(images_dir, "bja-logo-alt.png")

if os.path.exists(source_img):
    print(f"Moving {source_img} to {dest_img}")
    shutil.move(source_img, dest_img)
else:
    print("Source image not found in root, proceeding to updates.")

# 2. Update references in services/details/
search_dir = os.path.join(root_dir, "services", "details")
old_logo = "9igic7-removebg-preview.png"
new_logo_rel = "images/bja-logo-alt.png"

for root, dirs, files in os.walk(search_dir):
    for file in files:
        if file.endswith(".html"):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # The structure is services/details/file.html, so it's 2 levels deep from root
            # Old link was ../../9igic7-removebg-preview.png
            # New link should be ../../images/bja-logo-alt.png
            
            modified = False
            if old_logo in content:
                print(f"Updating references in {file_path}")
                content = content.replace("../../" + old_logo, "../../" + new_logo_rel)
                content = content.replace("../" + old_logo, "../" + new_logo_rel)
                content = content.replace(old_logo, new_logo_rel)
                modified = True
            
            if modified:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)

print("Batch update complete.")
