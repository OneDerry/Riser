import * as fs from "fs";
import * as path from "path";

// ----------- RENAME FILES & FOLDERS ----------------
function normalizeName(name) {
  return name.toLowerCase().replace(/ /g, "_");
}

function renameRecursively(dir) {
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const originalPath = path.join(dir, item);
    const newName = normalizeName(item);
    const newPath = path.join(dir, newName);

    // Rename if different
    if (originalPath !== newPath) {
      fs.renameSync(originalPath, newPath);
    }

    // Continue recursively if it's a directory
    if (fs.statSync(newPath).isDirectory()) {
      renameRecursively(newPath);
    }
  });
}

// ------------- IMPORT REORDERING ----------------
function reorderImportsInFile(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8");

  const importRegex = /^import .*?;$/gm;
  const imports = fileContent.match(importRegex);

  if (!imports) return;

  // Categorize imports
  const reactImports: string[] = [];
  const uiImports: string[] = [];
  const localImports: string[] = [];

  imports.forEach((imp) => {
    if (imp.includes("react")) reactImports.push(imp);
    else if (
      imp.includes("lucide-react") ||
      imp.includes("@shadcn/ui") ||
      imp.includes("@mui") ||
      imp.includes("react-icons")
    )
      uiImports.push(imp);
    else if (imp.includes("./") || imp.includes("../")) localImports.push(imp);
    else uiImports.push(imp);
  });

  const sortedImports = [
    ...reactImports,
    "",
    ...uiImports,
    "",
    ...localImports,
    "",
  ].join("\n");

  const cleanedContent = fileContent.replace(importRegex, "").trimStart();
  const finalContent = sortedImports + cleanedContent;

  fs.writeFileSync(filePath, finalContent, "utf8");
}

function fixImportsRecursively(dir) {
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);

    if (fs.statSync(fullPath).isDirectory()) {
      fixImportsRecursively(fullPath);
    } else if (/\.(js|jsx|ts|tsx)$/.test(item)) {
      reorderImportsInFile(fullPath);
    }
  });
}

// ------------------ RUN EVERYTHING -------------------
const projectPath = process.argv[2];

if (!projectPath) {
  console.log(
    "❌ Provide path to your project\nExample: node fix-project.js ./src"
  );
  process.exit(1);
}

console.log("🔧 Renaming files & folders...");
renameRecursively(projectPath);

console.log("📂 Fixing import order...");
fixImportsRecursively(projectPath);

console.log("✅ Done! Project cleaned successfully.");
