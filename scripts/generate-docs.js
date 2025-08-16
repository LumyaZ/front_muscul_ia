#!/usr/bin/env node

/**
 * Documentation Generator for Muscul IA Frontend
 * Générateur de Documentation pour Muscul IA Frontend
 * 
 * This script automatically generates comprehensive documentation
 * for the Angular frontend project by analyzing TypeScript files
 * and extracting JSDoc comments.
 * 
 * Ce script génère automatiquement une documentation complète
 * pour le projet Angular frontend en analysant les fichiers TypeScript
 * et en extrayant les commentaires JSDoc.
 * 
 * @author Muscul IA Team
 * @version 1.0
 * @since 2024-01-01
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Configuration for documentation generation.
 * Configuration pour la génération de documentation.
 */
const CONFIG = {
  // Source directories to scan
  sourceDirs: [
    'src/app/models',
    'src/app/services',
    'src/app/components',
    'src/app/views'
  ],
  // Output directory for generated documentation
  outputDir: 'docs',
  // File patterns to include
  includePatterns: ['**/*.ts'],
  // File patterns to exclude
  excludePatterns: ['**/*.spec.ts', '**/*.test.ts', 'node_modules/**'],
  // Documentation template
  template: {
    title: 'Muscul IA Frontend Documentation',
    subtitle: 'Documentation Technique Complète',
    version: '1.0.0',
    date: new Date().toISOString().split('T')[0]
  }
};

/**
 * Extracts JSDoc comments from TypeScript files.
 * Extrait les commentaires JSDoc des fichiers TypeScript.
 * 
 * @param {string} filePath - Path to the TypeScript file
 * @returns {Object} Extracted documentation data
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
    
    // Check for JSDoc start
    if (line.startsWith('/**')) {
      inJSDocBlock = true;
      jsDocContent = [];
      continue;
    }
    
    // Check for JSDoc end
    if (inJSDocBlock && line.startsWith('*/')) {
      inJSDocBlock = false;
      const jsDocText = jsDocContent.join('\n').trim();
      
      // Look for the next declaration
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j].trim();
        if (nextLine && !nextLine.startsWith('*') && !nextLine.startsWith('/')) {
          // Found a declaration, categorize it
          if (nextLine.includes('interface ')) {
            const interfaceName = nextLine.match(/interface\s+(\w+)/)?.[1];
            if (interfaceName) {
              documentation.interfaces.push({
                name: interfaceName,
                jsDoc: jsDocText,
                line: j + 1
              });
            }
          } else if (nextLine.includes('class ')) {
            const className = nextLine.match(/class\s+(\w+)/)?.[1];
            if (className) {
              documentation.classes.push({
                name: className,
                jsDoc: jsDocText,
                line: j + 1
              });
            }
          } else if (nextLine.includes('enum ')) {
            const enumName = nextLine.match(/enum\s+(\w+)/)?.[1];
            if (enumName) {
              documentation.enums.push({
                name: enumName,
                jsDoc: jsDocText,
                line: j + 1
              });
            }
          } else if (nextLine.includes('function ') || nextLine.includes('=>')) {
            const functionName = nextLine.match(/(?:function\s+)?(\w+)/)?.[1];
            if (functionName) {
              documentation.functions.push({
                name: functionName,
                jsDoc: jsDocText,
                line: j + 1
              });
            }
          }
          break;
        }
      }
      continue;
    }
    
    // Collect JSDoc content
    if (inJSDocBlock) {
      if (line.startsWith('*')) {
        jsDocContent.push(line.substring(1).trim());
      }
    }
  }

  return documentation;
}

/**
 * Generates HTML documentation from extracted data.
 * Génère la documentation HTML à partir des données extraites.
 * 
 * @param {Array} documentationData - Array of documentation objects
 * @returns {string} Generated HTML content
 */
function generateHTMLDocumentation(documentationData) {
  const { title, subtitle, version, date } = CONFIG.template;
  
  let html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #007acc;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #007acc;
            margin: 0;
            font-size: 2.5em;
        }
        .header h2 {
            color: #666;
            margin: 10px 0;
            font-weight: normal;
        }
        .header .meta {
            color: #999;
            font-size: 0.9em;
        }
        .section {
            margin: 30px 0;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
        }
        .section h3 {
            color: #007acc;
            border-bottom: 2px solid #007acc;
            padding-bottom: 10px;
            margin-top: 0;
        }
        .file-section {
            margin: 20px 0;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 5px;
        }
        .file-section h4 {
            color: #333;
            margin: 0 0 15px 0;
            font-size: 1.2em;
        }
        .item {
            margin: 15px 0;
            padding: 15px;
            background: white;
            border-left: 4px solid #007acc;
            border-radius: 3px;
        }
        .item h5 {
            color: #007acc;
            margin: 0 0 10px 0;
            font-size: 1.1em;
        }
        .jsdoc {
            background: #f0f8ff;
            padding: 10px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            white-space: pre-wrap;
            font-size: 0.9em;
            color: #333;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .stat-card {
            background: #007acc;
            color: white;
            padding: 20px;
            border-radius: 5px;
            text-align: center;
        }
        .stat-card h3 {
            margin: 0;
            font-size: 2em;
        }
        .stat-card p {
            margin: 5px 0 0 0;
            opacity: 0.9;
        }
        .toc {
            background: #f0f8ff;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .toc h3 {
            margin-top: 0;
            color: #007acc;
        }
        .toc ul {
            list-style: none;
            padding: 0;
        }
        .toc li {
            margin: 5px 0;
        }
        .toc a {
            color: #007acc;
            text-decoration: none;
        }
        .toc a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${title}</h1>
            <h2>${subtitle}</h2>
            <div class="meta">
                Version: ${version} | Date: ${date} | Généré automatiquement
            </div>
        </div>
  `;

  // Generate statistics
  const stats = {
    files: documentationData.length,
    interfaces: documentationData.reduce((sum, doc) => sum + doc.interfaces.length, 0),
    classes: documentationData.reduce((sum, doc) => sum + doc.classes.length, 0),
    enums: documentationData.reduce((sum, doc) => sum + doc.enums.length, 0),
    functions: documentationData.reduce((sum, doc) => sum + doc.functions.length, 0)
  };

  html += `
        <div class="stats">
            <div class="stat-card">
                <h3>${stats.files}</h3>
                <p>Fichiers Documentés</p>
            </div>
            <div class="stat-card">
                <h3>${stats.interfaces}</h3>
                <p>Interfaces</p>
            </div>
            <div class="stat-card">
                <h3>${stats.classes}</h3>
                <p>Classes</p>
            </div>
            <div class="stat-card">
                <h3>${stats.enums}</h3>
                <p>Énumérations</p>
            </div>
            <div class="stat-card">
                <h3>${stats.functions}</h3>
                <p>Fonctions</p>
            </div>
        </div>
  `;

  // Generate table of contents
  html += `
        <div class="toc">
            <h3>Table des Matières</h3>
            <ul>
  `;

  documentationData.forEach((doc, index) => {
    html += `<li><a href="#file-${index}">${doc.fileName}</a></li>`;
  });

  html += `
            </ul>
        </div>
  `;

  // Generate documentation sections
  documentationData.forEach((doc, index) => {
    html += `
        <div class="section" id="file-${index}">
            <h3>📄 ${doc.fileName}</h3>
            <p><strong>Chemin:</strong> ${doc.filePath}</p>
            
            <div class="file-section">
    `;

    if (doc.interfaces.length > 0) {
      html += `<h4>🔗 Interfaces (${doc.interfaces.length})</h4>`;
      doc.interfaces.forEach(item => {
        html += `
            <div class="item">
                <h5>interface ${item.name}</h5>
                <div class="jsdoc">${item.jsDoc}</div>
            </div>
        `;
      });
    }

    if (doc.classes.length > 0) {
      html += `<h4>🏗️ Classes (${doc.classes.length})</h4>`;
      doc.classes.forEach(item => {
        html += `
            <div class="item">
                <h5>class ${item.name}</h5>
                <div class="jsdoc">${item.jsDoc}</div>
            </div>
        `;
      });
    }

    if (doc.enums.length > 0) {
      html += `<h4>📊 Énumérations (${doc.enums.length})</h4>`;
      doc.enums.forEach(item => {
        html += `
            <div class="item">
                <h5>enum ${item.name}</h5>
                <div class="jsdoc">${item.jsDoc}</div>
            </div>
        `;
      });
    }

    if (doc.functions.length > 0) {
      html += `<h4>⚙️ Fonctions (${doc.functions.length})</h4>`;
      doc.functions.forEach(item => {
        html += `
            <div class="item">
                <h5>function ${item.name}</h5>
                <div class="jsdoc">${item.jsDoc}</div>
            </div>
        `;
      });
    }

    html += `
            </div>
        </div>
    `;
  });

  html += `
    </div>
</body>
</html>
  `;

  return html;
}

/**
 * Main function to generate documentation.
 * Fonction principale pour générer la documentation.
 */
function generateDocumentation() {
  console.log('🚀 Démarrage de la génération de documentation...');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log(`📁 Répertoire de sortie créé: ${CONFIG.outputDir}`);
  }

  // Find all TypeScript files
  const allFiles = [];
  CONFIG.sourceDirs.forEach(dir => {
    const pattern = path.join(dir, CONFIG.includePatterns[0]);
    const files = glob.sync(pattern, { ignore: CONFIG.excludePatterns });
    allFiles.push(...files);
  });

  console.log(`📋 ${allFiles.length} fichiers TypeScript trouvés`);

  // Extract documentation from each file
  const documentationData = [];
  allFiles.forEach(file => {
    try {
      const doc = extractJSDocComments(file);
      if (doc.interfaces.length > 0 || doc.classes.length > 0 || 
          doc.enums.length > 0 || doc.functions.length > 0) {
        documentationData.push(doc);
      }
    } catch (error) {
      console.error(`Erreur lors du traitement de ${file}:`, error.message);
    }
  });

  console.log(`📊 ${documentationData.length} fichiers avec documentation extraits`);

  // Generate HTML documentation
  const html = generateHTMLDocumentation(documentationData);
  const outputPath = path.join(CONFIG.outputDir, 'index.html');
  
  fs.writeFileSync(outputPath, html);
  console.log(`Documentation générée: ${outputPath}`);

  // Generate summary report
  const summary = {
    generatedAt: new Date().toISOString(),
    totalFiles: allFiles.length,
    documentedFiles: documentationData.length,
    totalInterfaces: documentationData.reduce((sum, doc) => sum + doc.interfaces.length, 0),
    totalClasses: documentationData.reduce((sum, doc) => sum + doc.classes.length, 0),
    totalEnums: documentationData.reduce((sum, doc) => sum + doc.enums.length, 0),
    totalFunctions: documentationData.reduce((sum, doc) => sum + doc.functions.length, 0),
    files: documentationData.map(doc => ({
      file: doc.fileName,
      interfaces: doc.interfaces.length,
      classes: doc.classes.length,
      enums: doc.enums.length,
      functions: doc.functions.length
    }))
  };

  const summaryPath = path.join(CONFIG.outputDir, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`📈 Rapport de synthèse généré: ${summaryPath}`);

  console.log('\n🎉 Génération de documentation terminée avec succès!');
  console.log(`📖 Ouvrez ${outputPath} dans votre navigateur pour voir la documentation.`);
}

// Run the documentation generator
if (require.main === module) {
  generateDocumentation();
}

module.exports = {
  generateDocumentation,
  extractJSDocComments,
  generateHTMLDocumentation
}; 