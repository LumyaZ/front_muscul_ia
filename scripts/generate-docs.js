#!/usr/bin/env node

/**
 * Générateur de documentation pour Muscul IA Frontend
 * 
 * Ce script génère automatiquement la documentation
 * pour le projet Angular frontend en analysant les fichiers TypeScript
 * et en extrayant les commentaires JSDoc.
 * 
 * @author Muscul IA Team
 * @version 1.0
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const CONFIG = {
  sourceDirs: [
    'src/app/models',
    'src/app/services',
    'src/app/components',
    'src/app/views'
  ],
  outputDir: 'docs',
  includePatterns: ['**/*.ts'],
  excludePatterns: ['**/*.spec.ts', '**/*.test.ts', 'node_modules/**'],
  template: {
    title: 'Muscul IA Frontend Documentation',
    subtitle: 'Documentation Technique',
    version: '1.0.0',
    date: new Date().toISOString().split('T')[0]
  }
};

/**
 * Extrait les commentaires JSDoc des fichiers TypeScript
 */
function extractJSDocComments(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const documentation = {
    filePath,
    fileName: path.basename(filePath),
    interfaces: [],
    classes: [],
    enums: [],
    functions: [],
    imports: [],
    exports: []
  };

  let currentBlock = null;
  let inJSDocBlock = false;
  let jsDocContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('/**')) {
      inJSDocBlock = true;
      jsDocContent = [];
      continue;
    }
    
    if (inJSDocBlock && line.startsWith('*/')) {
      inJSDocBlock = false;
      const jsDocText = jsDocContent.join('\n').trim();
      
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j].trim();
        if (nextLine && !nextLine.startsWith('*') && !nextLine.startsWith('/')) {
          if (nextLine.includes('interface ')) {
            const interfaceName = nextLine.match(/interface\s+(\w+)/)?.[1];
            if (interfaceName) {
              documentation.interfaces.push({
                name: interfaceName,
                description: jsDocText
              });
            }
          } else if (nextLine.includes('class ')) {
            const className = nextLine.match(/class\s+(\w+)/)?.[1];
            if (className) {
              documentation.classes.push({
                name: className,
                description: jsDocText
              });
            }
          } else if (nextLine.includes('function ') || nextLine.includes('=>')) {
            const functionName = nextLine.match(/(?:function\s+)?(\w+)/)?.[1];
            if (functionName) {
              documentation.functions.push({
                name: functionName,
                description: jsDocText
              });
            }
          }
          break;
        }
      }
      continue;
    }
    
    if (inJSDocBlock) {
      jsDocContent.push(line);
    }
  }

  return documentation;
}

/**
 * Génère la documentation HTML
 */
function generateHTMLDocumentation(allDocs) {
  let html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${CONFIG.template.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 30px; }
        .file-section { margin-bottom: 30px; border: 1px solid #ddd; border-radius: 5px; }
        .file-header { background: #e9ecef; padding: 15px; border-bottom: 1px solid #ddd; }
        .content { padding: 15px; }
        .item { margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 3px; }
        .item-name { font-weight: bold; color: #007bff; }
        .item-description { margin-top: 5px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${CONFIG.template.title}</h1>
        <h2>${CONFIG.template.subtitle}</h2>
        <p>Version: ${CONFIG.template.version} | Date: ${CONFIG.template.date}</p>
    </div>
  `;

  allDocs.forEach(doc => {
    html += `
    <div class="file-section">
        <div class="file-header">
            <h3>${doc.fileName}</h3>
            <p>${doc.filePath}</p>
        </div>
        <div class="content">
    `;

    if (doc.interfaces.length > 0) {
      html += '<h4>Interfaces</h4>';
      doc.interfaces.forEach(item => {
        html += `
        <div class="item">
            <div class="item-name">${item.name}</div>
            <div class="item-description">${item.description}</div>
        </div>
        `;
      });
    }

    if (doc.classes.length > 0) {
      html += '<h4>Classes</h4>';
      doc.classes.forEach(item => {
        html += `
        <div class="item">
            <div class="item-name">${item.name}</div>
            <div class="item-description">${item.description}</div>
        </div>
        `;
      });
    }

    if (doc.functions.length > 0) {
      html += '<h4>Fonctions</h4>';
      doc.functions.forEach(item => {
        html += `
        <div class="item">
            <div class="item-name">${item.name}</div>
            <div class="item-description">${item.description}</div>
        </div>
        `;
      });
    }

    html += '</div></div>';
  });

  html += '</body></html>';
  return html;
}

/**
 * Fonction principale
 */
function main() {
  console.log('🚀 Génération de la documentation...');
  
  try {
    if (!fs.existsSync(CONFIG.outputDir)) {
      fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }

    let allDocs = [];
    
    CONFIG.sourceDirs.forEach(dir => {
      const pattern = path.join(dir, '**/*.ts');
      const files = glob.sync(pattern, { ignore: CONFIG.excludePatterns });
      
      files.forEach(file => {
        const doc = extractJSDocComments(file);
        if (doc.interfaces.length > 0 || doc.classes.length > 0 || doc.functions.length > 0) {
          allDocs.push(doc);
        }
      });
    });

    const htmlContent = generateHTMLDocumentation(allDocs);
    const outputPath = path.join(CONFIG.outputDir, 'index.html');
    
    fs.writeFileSync(outputPath, htmlContent);
    
    console.log(`Documentation générée: ${outputPath}`);
    console.log(`${allDocs.length} fichiers documentés`);
    
  } catch (error) {
    console.error('Erreur lors de la génération:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 