/**
 * Sistema de Logging
 */

export const Logger = {
    isDevelopment: window.location.hostname === 'localhost',
    
    info(message, data = null) {
        if (this.isDevelopment) {
            console.log(`ℹ️ ${message}`, data || '');
        }
    },
    
    warn(message, data = null) {
        if (this.isDevelopment) {
            console.warn(`⚠️ ${message}`, data || '');
        }
    },
    
    error(message, error = null) {
        console.error(`❌ ${message}`, error || '');
        this.sendToMonitoring('error', message, error);
    },
    
    sendToMonitoring(level, message, error) {
        // Implementar integración con Sentry o similar
        if (typeof Sentry !== 'undefined') {
            Sentry.captureException(error || new Error(message));
        }
    }
};

// Manejo global de errores
window.addEventListener('error', (event) => {
    Logger.error('Unhandled error', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    Logger.error('Unhandled promise rejection', event.reason);
});
