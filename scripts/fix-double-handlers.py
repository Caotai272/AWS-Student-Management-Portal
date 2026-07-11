import os

backend_dir = "backend"
modified_files = []

for root, dirs, files in os.walk(backend_dir):
    if "node_modules" in root:
        continue
    for file in files:
        if file == "index.js":
            path = os.path.join(root, file)
            # Skip sendEmailWorker because it's already correct
            if "sendEmailWorker" in path:
                continue
                
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                
            # We want to make sure it has the double declaration issue
            # e.g., it contains "const handler =" and "export const handler"
            if "const handler =" in content and "export const handler" in content:
                print(f"Fixing: {path}")
                # Replace the inner definition
                new_content = content.replace("const handler =", "const baseHandler =")
                # Replace references to the inner definition
                new_content = new_content.replace("(handler)", "(baseHandler)")
                new_content = new_content.replace("( handler )", "(baseHandler)")
                
                with open(path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                modified_files.append(path)

print(f"Done! Modified {len(modified_files)} files.")
