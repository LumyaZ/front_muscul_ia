#!/usr/bin/env node

/**
 * Documentation Quality Validator for Muscul IA Frontend
 * Validateur de Qualité de Documentation pour Muscul IA Frontend
 * 
 * This script validates the quality and completeness of JSDoc documentation
 * in TypeScript files by checking for required documentation elements
 * and generating quality reports.
 * 
 * Ce script valide la qualité et la complétude de la documentation JSDoc
 * dans les fichiers TypeScript en vérifiant les éléments de documentation
 * requis et en générant des rapports de qualité.
 * 
 * @author Muscul IA Team
 * @version 1.0
 * @since 2024-01-01
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Configuration for documentation validation.
 * Configuration pour la validation de documentation.
 */
const CONFIG = {
  // Source directories to scan
  sourceDirs: [
    'src/app/models',
    'src/app/services',
    'src/app/components',
    'src/app/views'
  ],
  // File patterns to include
  includePatterns: ['**/*.ts'],
  // File patterns to exclude
  excludePatterns: ['**/*.spec.ts', '**/*.test.ts', 'node_modules/**'],
  // Output directory for validation reports
  outputDir: 'docs/validation',
  // Quality thresholds
  thresholds: {
    minDescriptionLength: 50,
    minBilingualRatio: 0.8, // 80% of elements should be bilingual
    minDocumentationCoverage: 0.9, // 90% of public elements should be documented
    maxUndocumentedPublicElements: 0.1 // 10% max undocumented public elements
  }
};

/**
 * Quality scoring weights for different documentation elements.
 * Poids de notation de qualité pour différents éléments de documentation.
 */
const QUALITY_WEIGHTS = {
  interface: 10,
  class: 15,
  enum: 8,
  method: 5,
  property: 3,
  constructor: 8,
  service: 12,
  component: 15
};

/**
 * Validates JSDoc documentation quality in a TypeScript file.
 * Valide la qualité de la documentation JSDoc dans un fichier TypeScript.
 * 
 * @param {string} filePath - Path to the TypeScript file
 * @returns {Object} Validation results
 */
function validateFileDocumentation(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const validation = {
    filePath,
    fileName: path.basename(filePath),
    totalElements: 0,
    documentedElements: 0,
    bilingualElements: 0,
    qualityScore: 0,
    issues: [],
    warnings: [],
    suggestions: []
  };

  let currentElement = null;
  let inJSDocBlock = false;
  let jsDocContent = [];
  let elementType = null;

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
      
      // Analyze the JSDoc content
      const jsDocQuality = analyzeJSDocQuality(jsDocText);
      
      if (currentElement && elementType) {
        validation.totalElements++;
        
        if (jsDocText.length > 0) {
          validation.documentedElements++;
          
          if (jsDocQuality.isBilingual) {
            validation.bilingualElements++;
          }
          
          // Calculate quality score for this element
          const elementWeight = QUALITY_WEIGHTS[elementType] || 5;
          const elementScore = jsDocQuality.score * elementWeight;
          validation.qualityScore += elementScore;
          
          // Add issues and suggestions
          if (jsDocQuality.issues.length > 0) {
            validation.issues.push({
              element: currentElement,
              type: elementType,
              issues: jsDocQuality.issues
            });
          }
          
          if (jsDocQuality.suggestions.length > 0) {
            validation.suggestions.push({
              element: currentElement,
              type: elementType,
              suggestions: jsDocQuality.suggestions
            });
          }
        } else {
          validation.warnings.push({
            element: currentElement,
            type: elementType,
            message: 'Element is not documented'
          });
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
    
    // Look for element declarations
    if (!inJSDocBlock && line && !line.startsWith('*') && !line.startsWith('/')) {
      if (line.includes('interface ')) {
        const match = line.match(/interface\s+(\w+)/);
        if (match) {
          currentElement = match[1];
          elementType = 'interface';
        }
      } else if (line.includes('class ')) {
        const match = line.match(/class\s+(\w+)/);
        if (match) {
          currentElement = match[1];
          elementType = 'class';
        }
      } else if (line.includes('enum ')) {
        const match = line.match(/enum\s+(\w+)/);
        if (match) {
          currentElement = match[1];
          elementType = 'enum';
        }
      } else if (line.includes('@Injectable') || line.includes('export class') && line.includes('Service')) {
        const match = line.match(/class\s+(\w+)/);
        if (match) {
          currentElement = match[1];
          elementType = 'service';
        }
      } else if (line.includes('@Component') || line.includes('export class') && line.includes('Component')) {
        const match = line.match(/class\s+(\w+)/);
        if (match) {
          currentElement = match[1];
          elementType = 'component';
        }
      } else if (line.includes('constructor(')) {
        currentElement = 'constructor';
        elementType = 'constructor';
      } else if (line.includes('(') && line.includes(')') && line.includes('{')) {
        const match = line.match(/(\w+)\s*\(/);
        if (match) {
          currentElement = match[1];
          elementType = 'method';
        }
      } else if (line.includes(':') && line.includes(';') && !line.includes('(')) {
        const match = line.match(/(\w+)\s*:/);
        if (match) {
          currentElement = match[1];
          elementType = 'property';
        }
      }
    }
  }

  return validation;
}

/**
 * Analyzes the quality of JSDoc documentation.
 * Analyse la qualité de la documentation JSDoc.
 * 
 * @param {string} jsDocText - JSDoc comment text
 * @returns {Object} Quality analysis results
 */
function analyzeJSDocQuality(jsDocText) {
  const analysis = {
    score: 0,
    isBilingual: false,
    hasDescription: false,
    hasParams: false,
    hasReturns: false,
    hasAuthor: false,
    hasVersion: false,
    hasSince: false,
    issues: [],
    suggestions: []
  };

  if (!jsDocText || jsDocText.length === 0) {
    return analysis;
  }

  // Check for bilingual documentation
  const hasEnglish = /[a-zA-Z]/.test(jsDocText);
  const hasFrench = /[àâäéèêëïîôöùûüÿç]/i.test(jsDocText);
  analysis.isBilingual = hasEnglish && hasFrench;

  // Check for description
  const descriptionLines = jsDocText.split('\n').filter(line => 
    line.trim() && !line.includes('@') && !line.includes('*')
  );
  analysis.hasDescription = descriptionLines.length > 0;

  // Check for JSDoc tags
  analysis.hasParams = jsDocText.includes('@param');
  analysis.hasReturns = jsDocText.includes('@return') || jsDocText.includes('@returns');
  analysis.hasAuthor = jsDocText.includes('@author');
  analysis.hasVersion = jsDocText.includes('@version');
  analysis.hasSince = jsDocText.includes('@since');

  // Calculate quality score
  let score = 0;
  
  if (analysis.hasDescription) score += 20;
  if (analysis.isBilingual) score += 30;
  if (analysis.hasParams) score += 15;
  if (analysis.hasReturns) score += 15;
  if (analysis.hasAuthor) score += 5;
  if (analysis.hasVersion) score += 5;
  if (analysis.hasSince) score += 5;
  
  // Bonus for good description length
  if (jsDocText.length > CONFIG.thresholds.minDescriptionLength) {
    score += 5;
  }

  analysis.score = Math.min(100, score) / 100; // Normalize to 0-1

  // Generate issues and suggestions
  if (!analysis.hasDescription) {
    analysis.issues.push('Missing description');
  }
  
  if (!analysis.isBilingual) {
    analysis.suggestions.push('Consider adding bilingual documentation (French/English)');
  }
  
  if (!analysis.hasParams && jsDocText.includes('(')) {
    analysis.suggestions.push('Consider adding @param documentation for method parameters');
  }
  
  if (!analysis.hasReturns && jsDocText.includes('return')) {
    analysis.suggestions.push('Consider adding @return documentation');
  }
  
  if (!analysis.hasAuthor) {
    analysis.suggestions.push('Consider adding @author tag');
  }
  
  if (!analysis.hasVersion) {
    analysis.suggestions.push('Consider adding @version tag');
  }
  
  if (!analysis.hasSince) {
    analysis.suggestions.push('Consider adding @since tag');
  }

  return analysis;
}

/**
 * Generates a comprehensive validation report.
 * Génère un rapport de validation complet.
 * 
 * @param {Array} validationResults - Array of validation results
 * @returns {Object} Comprehensive validation report
 */
function generateValidationReport(validationResults) {
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalFiles: validationResults.length,
      totalElements: 0,
      documentedElements: 0,
      bilingualElements: 0,
      averageQualityScore: 0,
      coveragePercentage: 0,
      bilingualPercentage: 0
    },
    qualityMetrics: {
      excellent: 0, // 90-100%
      good: 0,      // 70-89%
      fair: 0,      // 50-69%
      poor: 0,      // 30-49%
      veryPoor: 0   // 0-29%
    },
    issues: [],
    warnings: [],
    suggestions: [],
    fileDetails: []
  };

  // Calculate summary statistics
  validationResults.forEach(result => {
    report.summary.totalElements += result.totalElements;
    report.summary.documentedElements += result.documentedElements;
    report.summary.bilingualElements += result.bilingualElements;
    report.issues.push(...result.issues);
    report.warnings.push(...result.warnings);
    report.suggestions.push(...result.suggestions);
    
    report.fileDetails.push({
      file: result.fileName,
      path: result.filePath,
      totalElements: result.totalElements,
      documentedElements: result.documentedElements,
      bilingualElements: result.bilingualElements,
      qualityScore: result.qualityScore,
      coveragePercentage: result.totalElements > 0 ? 
        (result.documentedElements / result.totalElements) * 100 : 0
    });
  });

  // Calculate percentages
  if (report.summary.totalElements > 0) {
    report.summary.coveragePercentage = 
      (report.summary.documentedElements / report.summary.totalElements) * 100;
    report.summary.bilingualPercentage = 
      (report.summary.bilingualElements / report.summary.documentedElements) * 100;
  }

  // Calculate average quality score
  const totalQualityScore = validationResults.reduce((sum, result) => sum + result.qualityScore, 0);
  report.summary.averageQualityScore = validationResults.length > 0 ? 
    totalQualityScore / validationResults.length : 0;

  // Categorize quality levels
  report.fileDetails.forEach(file => {
    const qualityPercentage = file.coveragePercentage;
    if (qualityPercentage >= 90) report.qualityMetrics.excellent++;
    else if (qualityPercentage >= 70) report.qualityMetrics.good++;
    else if (qualityPercentage >= 50) report.qualityMetrics.fair++;
    else if (qualityPercentage >= 30) report.qualityMetrics.poor++;
    else report.qualityMetrics.veryPoor++;
  });

  return report;
}

/**
 * Generates HTML validation report.
 * Génère un rapport de validation HTML.
 * 
 * @param {Object} report - Validation report data
 * @returns {string} Generated HTML content
 */
function generateHTMLReport(report) {
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport de Validation Documentation - Muscul IA</title>
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
        .quality-metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 30px 0;
        }
        .quality-card {
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            color: white;
        }
        .quality-excellent { background: #28a745; }
        .quality-good { background: #17a2b8; }
        .quality-fair { background: #ffc107; color: #333; }
        .quality-poor { background: #fd7e14; }
        .quality-very-poor { background: #dc3545; }
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
        .issue, .warning, .suggestion {
            margin: 10px 0;
            padding: 10px;
            border-radius: 3px;
        }
        .issue {
            background: #f8d7da;
            border-left: 4px solid #dc3545;
            color: #721c24;
        }
        .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            color: #856404;
        }
        .suggestion {
            background: #d1ecf1;
            border-left: 4px solid #17a2b8;
            color: #0c5460;
        }
        .file-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .file-table th, .file-table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .file-table th {
            background: #f8f9fa;
            font-weight: bold;
        }
        .file-table tr:hover {
            background: #f5f5f5;
        }
        .progress-bar {
            width: 100%;
            height: 20px;
            background: #e9ecef;
            border-radius: 10px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #007acc, #0056b3);
            transition: width 0.3s ease;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Rapport de Validation Documentation</h1>
            <h2>Muscul IA Frontend - Qualité de Documentation</h2>
            <p>Généré le: ${new Date(report.generatedAt).toLocaleString('fr-FR')}</p>
        </div>

        <div class="stats">
            <div class="stat-card">
                <h3>${report.summary.totalFiles}</h3>
                <p>Fichiers Analysés</p>
            </div>
            <div class="stat-card">
                <h3>${report.summary.totalElements}</h3>
                <p>Éléments Totaux</p>
            </div>
            <div class="stat-card">
                <h3>${report.summary.documentedElements}</h3>
                <p>Éléments Documentés</p>
            </div>
            <div class="stat-card">
                <h3>${report.summary.bilingualElements}</h3>
                <p>Éléments Bilingues</p>
            </div>
            <div class="stat-card">
                <h3>${report.summary.coveragePercentage.toFixed(1)}%</h3>
                <p>Couverture Documentation</p>
            </div>
            <div class="stat-card">
                <h3>${report.summary.bilingualPercentage.toFixed(1)}%</h3>
                <p>Couverture Bilingue</p>
            </div>
        </div>

        <div class="quality-metrics">
            <div class="quality-card quality-excellent">
                <h4>Excellent</h4>
                <p>${report.qualityMetrics.excellent} fichiers</p>
                <p>90-100%</p>
            </div>
            <div class="quality-card quality-good">
                <h4>Bon</h4>
                <p>${report.qualityMetrics.good} fichiers</p>
                <p>70-89%</p>
            </div>
            <div class="quality-card quality-fair">
                <h4>Moyen</h4>
                <p>${report.qualityMetrics.fair} fichiers</p>
                <p>50-69%</p>
            </div>
            <div class="quality-card quality-poor">
                <h4>Faible</h4>
                <p>${report.qualityMetrics.poor} fichiers</p>
                <p>30-49%</p>
            </div>
            <div class="quality-card quality-very-poor">
                <h4>Très Faible</h4>
                <p>${report.qualityMetrics.veryPoor} fichiers</p>
                <p>0-29%</p>
            </div>
        </div>

        <div class="section">
            <h3>Détails par Fichier</h3>
            <table class="file-table">
                <thead>
                    <tr>
                        <th>Fichier</th>
                        <th>Éléments</th>
                        <th>Documentés</th>
                        <th>Bilingues</th>
                        <th>Couverture</th>
                        <th>Score Qualité</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.fileDetails.map(file => `
                        <tr>
                            <td>${file.file}</td>
                            <td>${file.totalElements}</td>
                            <td>${file.documentedElements}</td>
                            <td>${file.bilingualElements}</td>
                            <td>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${file.coveragePercentage}%"></div>
                                </div>
                                ${file.coveragePercentage.toFixed(1)}%
                            </td>
                            <td>${(file.qualityScore * 100).toFixed(1)}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        ${report.issues.length > 0 ? `
        <div class="section">
            <h3>Problèmes Identifiés (${report.issues.length})</h3>
            ${report.issues.map(issue => `
                <div class="issue">
                    <strong>${issue.element}</strong> (${issue.type}): ${issue.issues.join(', ')}
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${report.warnings.length > 0 ? `
        <div class="section">
            <h3>️ Avertissements (${report.warnings.length})</h3>
            ${report.warnings.map(warning => `
                <div class="warning">
                    <strong>${warning.element}</strong> (${warning.type}): ${warning.message}
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${report.suggestions.length > 0 ? `
        <div class="section">
            <h3>💡 Suggestions d'Amélioration (${report.suggestions.length})</h3>
            ${report.suggestions.map(suggestion => `
                <div class="suggestion">
                    <strong>${suggestion.element}</strong> (${suggestion.type}): ${suggestion.suggestions.join(', ')}
                </div>
            `).join('')}
        </div>
        ` : ''}
    </div>
</body>
</html>
  `;

  return html;
}

/**
 * Main function to validate documentation.
 * Fonction principale pour valider la documentation.
 */
function validateDocumentation() {
  console.log('Démarrage de la validation de documentation...');
  
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

  console.log(`${allFiles.length} fichiers TypeScript trouvés`);

  // Validate documentation in each file
  const validationResults = [];
  allFiles.forEach(file => {
    try {
      const validation = validateFileDocumentation(file);
      validationResults.push(validation);
    } catch (error) {
      console.error(`Erreur lors de la validation de ${file}:`, error.message);
    }
  });

  console.log(`${validationResults.length} fichiers validés`);

  // Generate validation report
  const report = generateValidationReport(validationResults);
  
  // Save JSON report
  const jsonPath = path.join(CONFIG.outputDir, 'validation-report.json');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(`Rapport JSON généré: ${jsonPath}`);

  // Generate HTML report
  const html = generateHTMLReport(report);
  const htmlPath = path.join(CONFIG.outputDir, 'validation-report.html');
  fs.writeFileSync(htmlPath, html);
  console.log(`📖 Rapport HTML généré: ${htmlPath}`);

  // Display summary
  console.log('\nRésumé de la Validation:');
  console.log(`   • Fichiers analysés: ${report.summary.totalFiles}`);
  console.log(`   • Éléments totaux: ${report.summary.totalElements}`);
  console.log(`   • Éléments documentés: ${report.summary.documentedElements}`);
  console.log(`   • Couverture: ${report.summary.coveragePercentage.toFixed(1)}%`);
  console.log(`   • Couverture bilingue: ${report.summary.bilingualPercentage.toFixed(1)}%`);
  console.log(`   • Score qualité moyen: ${(report.summary.averageQualityScore * 100).toFixed(1)}%`);
  console.log(`   • Problèmes: ${report.issues.length}`);
  console.log(`   • Avertissements: ${report.warnings.length}`);
  console.log(`   • Suggestions: ${report.suggestions.length}`);

  console.log('\n🎉 Validation de documentation terminée!');
  console.log(`📖 Ouvrez ${htmlPath} dans votre navigateur pour voir le rapport détaillé.`);
}

// Run the documentation validator
if (require.main === module) {
  validateDocumentation();
}

module.exports = {
  validateDocumentation,
  validateFileDocumentation,
  analyzeJSDocQuality,
  generateValidationReport
}; 