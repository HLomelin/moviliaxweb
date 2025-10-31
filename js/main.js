        // ============================================
        // MOBILE MENU TOGGLE
        // ============================================
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');
        
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Update aria-expanded for accessibility
            const isExpanded = navLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // ============================================
        // HEADER SCROLL EFFECT
        // ============================================
        const header = document.getElementById('header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });

        // ============================================
        // SCROLL TO TOP BUTTON
        // ============================================
        const scrollToTopBtn = document.getElementById('scrollToTop');

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // ============================================
        // PARTICLES ANIMATION
        // ============================================
        const particlesContainer = document.getElementById('particles');
        const particleCount = 50;

        function createParticles() {
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Random position
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                
                // Random animation delay and duration
                particle.style.animationDelay = Math.random() * 20 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
                
                particlesContainer.appendChild(particle);
            }
        }

        createParticles();

        // ============================================
        // NEWSLETTER FORM SUBMISSION
        // ============================================
        const newsletterForm = document.getElementById('newsletterForm');
        const emailInput = document.getElementById('emailInput');
        const submitButton = document.getElementById('submitButton');
        const formMessage = document.getElementById('formMessage');

        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Por favor, ingresa un correo electrónico válido.', 'error');
                return;
            }

            // Disable button and show loading
            submitButton.disabled = true;
            submitButton.innerHTML = 'Procesando... <span class="spinner"></span>';

            // Simulate API call (replace with real endpoint)
            try {
                // Simulated delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Simulate successful subscription
                // In production, replace with: await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) })
                
                showMessage('¡Suscripción exitosa! Revisa tu correo para confirmar.', 'success');
                emailInput.value = '';
                
                // Track conversion (add your analytics code here)
                console.log('Newsletter subscription:', email);
                
            } catch (error) {
                showMessage('Ocurrió un error. Por favor, intenta de nuevo.', 'error');
                console.error('Subscription error:', error);
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Suscribirme';
            }
        });

        function showMessage(text, type) {
            formMessage.textContent = text;
            formMessage.className = `form-message ${type}`;
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                formMessage.className = 'form-message';
            }, 5000);
        }

        // ============================================
        // INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
        // ============================================
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Unobserve after animation to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(element => {
            observer.observe(element);
        });

        // ============================================
        // CARD HOVER EFFECTS WITH SUBTLE ANIMATIONS
        // ============================================
        const cards = document.querySelectorAll('.content-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // ============================================
        // SMOOTH SCROLL FOR ANCHOR LINKS
        // ============================================
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                
                // Don't prevent default for empty anchors
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

        // ============================================
        // PERFORMANCE: Lazy load images (when real images are added)
        // ============================================
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            // Observe all images with data-src attribute
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // ============================================
        // ANALYTICS TRACKING (Add your analytics code)
        // ============================================
        function trackEvent(category, action, label) {
            // Example: Google Analytics
            // gtag('event', action, { 'event_category': category, 'event_label': label });
            
            // Example: Custom analytics
            console.log('Event tracked:', { category, action, label });
        }

        // Track CTA clicks
        document.querySelectorAll('.cta-button, .card-link').forEach(button => {
            button.addEventListener('click', (e) => {
                const text = e.target.textContent.trim();
                trackEvent('CTA', 'click', text);
            });
        });

        // ============================================
        // CONSOLE EASTER EGG
        // ============================================
        console.log('%c🚀 MOVILIAX', 'font-size: 40px; color: #00E0FF; font-weight: bold;');
        console.log('%c¿Interesado en trabajar con nosotros?', 'font-size: 16px; color: #7A7F8C;');
        console.log('%cEnvía tu CV a: jobs@moviliax.com', 'font-size: 14px; color: #00E0FF;');
