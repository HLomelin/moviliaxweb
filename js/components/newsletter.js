/**
 * Componente: Newsletter
 * Maneja suscripción y validación del formulario
 */

import { validateEmail, sanitizeInput } from '../utils/helpers.js';
import { Logger } from '../utils/logger.js';

export function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    
    const emailInput = document.getElementById('emailInput');
    const submitButton = document.getElementById('submitButton');
    const formMessage = document.getElementById('formMessage');
    
    // Rate limiting
    let submitCount = 0;
    let lastSubmitTime = 0;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Validación de email
        if (!validateEmail(email)) {
            showMessage('Por favor, ingresa un correo electrónico válido.', 'error');
            return;
        }
        
        // Rate limiting
        const now = Date.now();
        if (now - lastSubmitTime < 60000 && submitCount >= 3) {
            showMessage('Demasiados intentos. Por favor, espera un minuto.', 'error');
            return;
        }
        
        // Honeypot check (agregar campo oculto en HTML)
        const honeypot = form.querySelector('input[name="website"]');
        if (honeypot && honeypot.value !== '') {
            Logger.warn('Honeypot triggered');
            showMessage('Error al procesar la solicitud.', 'error');
            return;
        }
        
        // Deshabilitar botón
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner"></span> Procesando...';
        
        try {
            // Llamada a API real
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: sanitizeInput(email),
                    source: 'website'
                })
            });
            
            if (!response.ok) {
                throw new Error('Subscription failed');
            }
            
            const data = await response.json();
            
            showMessage('¡Suscripción exitosa! Revisa tu correo para confirmar.', 'success');
            emailInput.value = '';
            
            // Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'newsletter_subscription', {
                    'event_category': 'engagement',
                    'event_label': email
                });
            }
            
            Logger.info('Newsletter subscription successful', { email });
            
            submitCount++;
            lastSubmitTime = now;
            
        } catch (error) {
            showMessage('Ocurrió un error. Por favor, intenta de nuevo.', 'error');
            Logger.error('Newsletter subscription failed', error);
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Suscribirme';
        }
    });
    
    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = `form-message ${type}`;
        formMessage.setAttribute('role', 'alert');
        
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 5000);
    }
}
