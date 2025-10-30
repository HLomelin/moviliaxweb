/**
 * Componente: Navegación
 * Maneja scroll header, menú móvil y enlaces
 */

export function initNavigation() {
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Scroll Header Effect
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
    
    // Mobile Menu Toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
            
            // Accesibilidad: Actualizar aria-expanded
            const isExpanded = navLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
        
        // Cerrar menú al hacer clic en un enlace
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Smooth Scroll para anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
