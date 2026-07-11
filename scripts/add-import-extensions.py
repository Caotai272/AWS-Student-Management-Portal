import os
import re

backend_dir = "backend"
modified_count = 0

# Pattern matches: from '../../common/name' (not ending with .js)
pattern = re.compile(r'(from\s+[\'"](?:\.\./)+common/[\w\-]+)(?!\.js)([\'"])')

for root, dirs, files in os.walk(backend_dir):
    if "node_modules" in root:
        continue
    for file in files:
        if file == "index.js":
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            
            new_content, count = pattern.subn(r'\1.js\2', content)
            if count > 0:
                print(f"Adding extensions to {count} imports in: {path}")
                with open(path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                modified_count += 1

print(f"Done! Modified {modified_count} files.")
