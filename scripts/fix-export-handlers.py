import os

backend_dir = "backend"
modified_files = []

for root, dirs, files in os.walk(backend_dir):
    if "node_modules" in root:
        continue
    for file in files:
        if file == "index.js":
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                
            if "export const baseHandler =" in content:
                print(f"Fixing export: {path}")
                new_content = content.replace("export const baseHandler =", "export const handler =")
                with open(path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                modified_files.append(path)

print(f"Done! Fixed {len(modified_files)} files.")
