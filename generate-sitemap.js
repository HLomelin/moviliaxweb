#!/usr/bin/env node

/**
 * Generador Automático de Sitemap para MOVILIAX
 * 
 * Este script escanea el directorio del proyecto y genera
 * automáticamente un sitemap.xml con todas las páginas HTML
 * 
 * Uso:
 * node generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

// ==================== CONFIGURACIÓN ====================

const CONFIG = {
  domain: 'https://moviliax.com',
  baseDir: './',
  outputFile: 'sitemap.xml',
  excludeDirs: ['node_modules', 'dist', 'build', '.git', 'css', 'js', 'assets'],
  excludeFiles: ['404.html', 'error.html'],
  
  // Configuración de prioridades por tipo de página
  priorities: {
    'index.html': { priority: 1.0, changefreq: 'weekly' },
    'acerca-de.html': { priority: 0.8, changefreq: 'monthly' },
    'moviliax-connect.html': { priority: 0.9, changefreq: 'weekly' },
    'moviliax-energy.html': { priority: 0.9, changefreq: 'weekly' },
    'moviliax-labs.html': { priority: 0.9, changefreq: 'weekly' },
    'moviliax-logistics.html': { priority: 0.9, changefreq: 'weekly' },
    'moviliax-mobility.html': { priority: 0.9, changefreq: 'weekly' },
    'moviliax-pay.html': { priority: 0.9, changefreq: 'weekly' },
    'moviliax-cloud.html': { priority: 0.9, changefreq: 'weekly' },
    'blog.html': { priority: 0.7, changefreq: 'daily' },
    'contacto.html': { priority: 0.6, changefreq: 'monthly' },
    'carreras.html': { priority: 0.7, changefreq: 'weekly' },
    'politica-privacidad.html': { priority: 0.3, changefreq: 'yearly' },
    'terminos-condiciones.html': { priority: 0.3, changefreq: 'yearly' },
    'default': { priority: 0.5, changefreq: 'monthly' } // Para páginas no listadas
  }
};

// ==================== FUNCIONES ====================

/**
 * Obtiene todos los archivos HTML del directorio recursivamente
 */
function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Excluir directorios específicos
      if (!CONFIG.excludeDirs.includes(file)) {
        getAllHtmlFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      // Excluir archivos específicos
      if (!CONFIG.excludeFiles.includes(file)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Obtiene la configuración de prioridad para una página
 */
function getPageConfig(filename) {
  return CONFIG.priorities[filename] || CONFIG.priorities['default'];
}

/**
 * Obtiene la fecha de última modificación del archivo
 */
function getLastModified(filePath) {
  const stats = fs.statSync(filePath);
  const date = new Date(stats.mtime);
  return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
}

/**
 * Convierte la ruta del archivo a URL
 */
function filePathToUrl(filePath) {
  // Normalizar la ruta y convertir a URL
  let relativePath = path.relative(CONFIG.baseDir, filePath);
  
  // Convertir separadores de Windows a URL
  relativePath = relativePath.replace(/\\/g, '/');
  
  // index.html en la raíz debe ser solo /
  if (relativePath === 'index.html') {
    return CONFIG.domain + '/';
  }
  
  return `${CONFIG.domain}/${relativePath}`;
}

/**
 * Genera el contenido XML del sitemap
 */
function generateSitemap(htmlFiles) {
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

  const footer = `
</urlset>`;

  // Ordenar archivos: index.html primero, luego alfabéticamente
  htmlFiles.sort((a, b) => {
    const aName = path.basename(a);
    const bName = path.basename(b);
    
    if (aName === 'index.html') return -1;
    if (bName === 'index.html') return 1;
    
    return aName.localeCompare(bName);
  });

  // Generar entradas XML
  const entries = htmlFiles.map(file => {
    const filename = path.basename(file);
    const config = getPageConfig(filename);
    const url = filePathToUrl(file);
    const lastmod = getLastModified(file);

    return `
  <!-- ${filename} -->
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${config.priority}</priority>
  </url>`;
  }).join('');

  return header + entries + footer;
}

/**
 * Guarda el sitemap en un archivo
 */
function saveSitemap(content) {
  const outputPath = path.join(CONFIG.baseDir, CONFIG.outputFile);
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`✅ Sitemap generado exitosamente: ${outputPath}`);
}

/**
 * Muestra estadísticas del sitemap generado
 */
function showStats(htmlFiles) {
  console.log('\n📊 ESTADÍSTICAS DEL SITEMAP');
  console.log('─────────────────────────────────');
  console.log(`Total de páginas: ${htmlFiles.length}`);
  console.log(`Dominio: ${CONFIG.domain}`);
  console.log(`Archivo de salida: ${CONFIG.outputFile}`);
  console.log('\n📄 PÁGINAS INCLUIDAS:');
  
  htmlFiles.forEach((file, index) => {
    const filename = path.basename(file);
    const config = getPageConfig(filename);
    console.log(`  ${index + 1}. ${filename} (prioridad: ${config.priority})`);
  });
  
  console.log('\n✨ Sitemap generado correctamente\n');
}

// ==================== EJECUCIÓN PRINCIPAL ====================

try {
  console.log('🚀 Generando sitemap para MOVILIAX...\n');
  
  // 1. Obtener todos los archivos HTML
  const htmlFiles = getAllHtmlFiles(CONFIG.baseDir);
  
  if (htmlFiles.length === 0) {
    console.error('❌ Error: No se encontraron archivos HTML');
    process.exit(1);
  }
  
  // 2. Generar contenido del sitemap
  const sitemapContent = generateSitemap(htmlFiles);
  
  // 3. Guardar archivo
  saveSitemap(sitemapContent);
  
  // 4. Mostrar estadísticas
  showStats(htmlFiles);
  
} catch (error) {
  console.error('❌ Error al generar el sitemap:', error.message);
  process.exit(1);
}
