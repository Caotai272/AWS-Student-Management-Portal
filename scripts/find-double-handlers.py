import os

backend_dir = "backend"
for root, dirs, files in os.walk(backend_dir):
    if "node_modules" in root:
        continue
    for file in files:
        if file == "index.js":
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            if "const handler =" in content and "export const handler =" in content:
                print(f"Double handler: {path}")
