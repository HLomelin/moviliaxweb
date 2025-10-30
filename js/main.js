/**
 * MOVILIAX - Main JavaScript
 * Imports y inicialización principal
 */

import { initNavigation } from './components/navigation.js';
import { initNewsletter } from './components/newsletter.js';
import { initAnimations } from './components/animations.js';
import { createParticles } from './utils/particles.js';

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar componentes
    initNavigation();
    initNewsletter();
    initAnimations();
    
    // Crear efectos visuales
    createParticles();
    
    // Log para desarrollo
    if (window.location.hostname === 'localhost') {
        console.log('🚀 MOVILIAX initialized');
    }
});
