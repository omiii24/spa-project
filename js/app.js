/**
 * SPA Application - Single Page Application with Client-Side Routing
 *
 * Features:
 * - Hash-based and History API routing
 * - Dynamic content loading
 * - Smooth page transitions
 * - State management
 * - Error handling
 * - Accessibility support
 */

(function() {
    'use strict';

    // ==========================================================================
    // Configuration
    // ==========================================================================
    const CONFIG = {
        routes: {
            '/': { title: 'Home', component: 'home' },
            '/about': { title: 'About Us', component: 'about' },
            '/services': { title: 'Our Services', component: 'services' },
            '/portfolio': { title: 'Portfolio', component: 'portfolio' },
            '/contact': { title: 'Contact', component: 'contact' }
        },
        defaultRoute: '/',
        transitionDuration: 300, // ms
        loadingDelay: 300 // ms minimum loading display
    };

    // ==========================================================================
    // State Management
    // ==========================================================================
    const state = {
        currentRoute: null,
        previousRoute: null,
        isLoading: false,
        isTransitioning: false,
        routeHistory: [],
        maxHistorySize: 50
    };

    // ==========================================================================
    // DOM Elements Cache
    // ==========================================================================
    const elements = {
        mainContent: null,
        navMenu: null,
        navLinks: null,
        navToggle: null,
        loadingOverlay: null,
        appContainer: null
    };

    // ==========================================================================
    // Content Templates
    // ==========================================================================
    const templates = {
        home: `
            <div class="page" data-page="home">
                <header class="page-header">
                    <h1 class="page-title">Welcome to SPA Demo</h1>
                    <p class="page-subtitle">A modern Single Page Application built with vanilla JavaScript</p>
                </header>
                <div class="page-content">
                    <p>This demonstration showcases a fully functional Single Page Application (SPA) that dynamically loads content without requiring full page reloads. Built using vanilla HTML, CSS, and JavaScript — no frameworks required.</p>

                    <h2>Key Features</h2>
                    <ul>
                        <li>Client-side routing with History API</li>
                        <li>Smooth page transitions with CSS animations</li>
                        <li>Dynamic content loading with loading states</li>
                        <li>Responsive design for all device sizes</li>
                        <li>Accessible navigation (ARIA support)</li>
                        <li>Browser history management</li>
                        <li>Error handling and fallbacks</li>
                    </ul>

                    <h2>Technical Highlights</h2>
                    <ul>
                        <li>Hash-based and History API routing support</li>
                        <li>State management with route history</li>
                        <li>Lazy-loaded content templates</li>
                        <li>Transition coordination between routes</li>
                        <li>Mobile-first responsive design</li>
                        <li>Progressive enhancement approach</li>
                    </ul>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">5</div>
                            <div class="stat-label">Routes</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">0</div>
                            <div class="stat-label">Dependencies</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">100%</div>
                            <div class="stat-label">Vanilla JS</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number"><50KB</div>
                            <div class="stat-label">Total Size</div>
                        </div>
                    </div>

                    <h2>Getting Started</h2>
                    <p>Navigate through the application using the header menu. Each page loads instantly without a full page refresh. The URL updates automatically, and you can use browser back/forward buttons to navigate through history.</p>
                </div>
            </div>
        `,
        about: `
            <div class="page" data-page="about">
                <header class="page-header">
                    <h1 class="page-title">About Us</h1>
                    <p class="page-subtitle">Learn more about our mission and values</p>
                </header>
                <div class="page-content">
                    <h2>Our Story</h2>
                    <p>Founded with a passion for clean, efficient code, we believe that the best web applications are built on solid fundamentals. This SPA demonstration represents our commitment to understanding core web technologies before reaching for frameworks.</p>

                    <h2>Our Philosophy</h2>
                    <ul>
                        <li><strong>Simplicity First:</strong> Complex solutions should emerge from simple building blocks</li>
                        <li><strong>Performance Matters:</strong> Every byte and millisecond counts for user experience</li>
                        <li><strong>Accessibility is Essential:</strong> The web should work for everyone</li>
                        <li><strong>Progressive Enhancement:</strong> Core functionality works everywhere</li>
                    </ul>

                    <h2>Team</h2>
                    <div class="cards-grid">
                        <div class="card">
                            <div class="card-icon">👨‍💻</div>
                            <h3 class="card-title">Lead Developer</h3>
                            <p class="card-description">Architecting the core routing engine and state management system</p>
                        </div>
                        <div class="card">
                            <div class="card-icon">🎨</div>
                            <h3 class="card-title">UI/UX Designer</h3>
                            <p class="card-description">Crafting smooth transitions and responsive layouts</p>
                        </div>
                        <div class="card">
                            <div class="card-icon">♿</div>
                            <h3 class="card-title">Accessibility Expert</h3>
                            <p class="card-description">Ensuring inclusive design and WCAG compliance</p>
                        </div>
                    </div>

                    <h2>Tech Stack</h2>
                    <p>This project uses zero external dependencies — just modern browser APIs:</p>
                    <ul>
                        <li>History API for client-side routing</li>
                        <li>CSS Custom Properties for theming</li>
                        <li>CSS Animations for transitions</li>
                        <li>ES6+ JavaScript modules pattern</li>
                        <li>Intersection Observer for lazy loading</li>
                    </ul>
                </div>
            </div>
        `,
        services: `
            <div class="page" data-page="services">
                <header class="page-header">
                    <h1 class="page-title">Our Services</h1>
                    <p class="page-subtitle">Comprehensive web development solutions</p>
                </header>
                <div class="page-content">
                    <h2>What We Offer</h2>
                    <p>From concept to deployment, we provide end-to-end web development services tailored to your needs.</p>

                    <div class="cards-grid">
                        <div class="card">
                            <div class="card-icon">⚡</div>
                            <h3 class="card-title">SPA Development</h3>
                            <p class="card-description">Build fast, responsive single-page applications with modern JavaScript</p>
                        </div>
                        <div class="card">
                            <div class="card-icon">📱</div>
                            <h3 class="card-title">Progressive Web Apps</h3>
                            <p class="card-description">Offline-capable, installable web applications with native feel</p>
                        </div>
                        <div class="card">
                            <div class="card-icon">🔧</div>
                            <h3 class="card-title">API Development</h3>
                            <p class="card-description">RESTful and GraphQL APIs with robust documentation</p>
                        </div>
                        <div class="card">
                            <div class="card-icon">⚡</div>
                            <h3 class="card-title">Performance Optimization</h3>
                            <p class="card-description">Core Web Vitals improvement and bundle optimization</p>
                        </div>
                        <div class="card">
                            <div class="card-icon">♿</div>
                            <h3 class="card-title">Accessibility Audit</h3>
                            <p class="card-description">WCAG 2.1 AA compliance testing and remediation</p>
                        </div>
                        <div class="card">
                            <div class="card-icon">🧪</div>
                            <h3 class="card-title">Testing & QA</h3>
                            <p class="card-description">Unit, integration, and E2E testing strategies</p>
                        </div>
                    </div>

                    <h2>Our Process</h2>
                    <ol style="margin-left: var(--space-6); margin-bottom: var(--space-4);">
                        <li style="margin-bottom: var(--space-3);"><strong>Discovery:</strong> Understanding your goals and requirements</li>
                        <li style="margin-bottom: var(--space-3);"><strong>Planning:</strong> Architecture design and technology selection</li>
                        <li style="margin-bottom: var(--space-3);"><strong>Development:</strong> Iterative building with regular demos</li>
                        <li style="margin-bottom: var(--space-3);"><strong>Testing:</strong> Comprehensive quality assurance</li>
                        <li style="margin-bottom: var(--space-3);"><strong>Deployment:</strong> CI/CD pipeline setup and launch</li>
                        <li style="margin-bottom: var(--space-3);"><strong>Maintenance:</strong> Ongoing support and updates</li>
                    </ol>
                </div>
            </div>
        `,
        portfolio: `
            <div class="page" data-page="portfolio">
                <header class="page-header">
                    <h1 class="page-title">Portfolio</h1>
                    <p class="page-subtitle">Selected projects and case studies</p>
                </header>
                <div class="page-content">
                    <h2>Featured Projects</h2>
                    <p>A showcase of applications demonstrating our expertise in modern web development.</p>

                    <div class="cards-grid">
                        <div class="card">
                            <div class="card-icon">🛒</div>
                            <h3 class="card-title">E-Commerce Platform</h3>
                            <p class="card-description">Full-featured online store with real-time inventory, payment processing, and admin dashboard. Built with React, Node.js, and PostgreSQL.</p>
                        </div>
                        <div class="card">
                            <div class="card-icon">📊</div>
                            <h3 class="card-title">Analytics Dashboard</h3>
                            <p class="card-description">Real-time data visualization platform with customizable widgets, export capabilities, and team collaboration features.</p>
                        </div>
                        <div class="card">
                            <div class="card-icon">📝</div>
                            <h3 class="card-title">Content Management System</h3>
                            <p class="card-description">Headless CMS with visual editor, multi-language support, and API-first architecture for omnichannel delivery.</p>
                        </div>
                        <div class="card">
                            <div class="card-icon">💬</div>
                            <h3 class="card-title">Real-time Chat Application</h3>
                            <p class="card-description">WebSocket-powered messaging platform with channels, direct messages, file sharing, and search.</p>
                        </div>
                        <div class="card">
                            <div class="card-icon">🎓</div>
                            <h3 class="card-title">Learning Management System</h3>
                            <p class="card-description">Course creation, progress tracking, assessments, and certificates with SCORM compliance.</p>
                        </div>
                        <div class="card">
                            <div class="card-icon">🏥</div>
                            <h3 class="card-title">Healthcare Portal</h3>
                            <p class="card-description">Patient management, appointment scheduling, telemedicine, and HIPAA-compliant data handling.</p>
                        </div>
                    </div>

                    <h2>Case Study: SPA Framework Migration</h2>
                    <p><strong>Challenge:</strong> A client's legacy jQuery application had grown unmaintainable with poor performance and no mobile support.</p>
                    <p><strong>Solution:</strong> Migrated to a modern SPA architecture with code-splitting, lazy loading, and a component-based structure.</p>
                    <p><strong>Results:</strong></p>
                    <ul>
                        <li>65% reduction in initial load time</li>
                        <li>40% increase in mobile conversions</li>
                        <li>90% improvement in Lighthouse performance score</li>
                        <li>50% reduction in bundle size</li>
                    </ul>
                </div>
            </div>
        `,
        contact: `
            <div class="page" data-page="contact">
                <header class="page-header">
                    <h1 class="page-title">Contact Us</h1>
                    <p class="page-subtitle">Get in touch with our team</p>
                </header>
                <div class="page-content">
                    <h2>Send a Message</h2>
                    <p>We'd love to hear about your project. Fill out the form and we'll get back to you within 24 hours.</p>

                    <form class="contact-form" id="contact-form" novalidate>
                        <div class="form-group">
                            <label class="form-label" for="name">Full Name</label>
                            <input type="text" class="form-input" id="name" name="name" placeholder="John Doe" required aria-required="true">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="email">Email Address</label>
                            <input type="email" class="form-input" id="email" name="email" placeholder="john@example.com" required aria-required="true">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="subject">Subject</label>
                            <select class="form-input" id="subject" name="subject" required aria-required="true">
                                <option value="">Select a topic</option>
                                <option value="general">General Inquiry</option>
                                <option value="project">New Project</option>
                                <option value="support">Technical Support</option>
                                <option value="partnership">Partnership</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="message">Message</label>
                            <textarea class="form-textarea" id="message" name="message" placeholder="Tell us about your project..." required aria-required="true"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Send Message</button>
                    </form>

                    <h2 style="margin-top: var(--space-10);">Other Ways to Connect</h2>
                    <div class="cards-grid">
                        <div class="card">
                            <div class="card-icon">📧</div>
                            <h3 class="card-title">Email</h3>
                            <p class="card-description">hello@spademo.com<br>We respond within 24 hours</p>
                        </div>
                        <div class="card">
                            <div class="card-icon">💬</div>
                            <h3 class="card-title">Live Chat</h3>
                            <p class="card-description">Available Mon-Fri, 9am-6pm EST<br>Click the chat bubble below</p>
                        </div>
                        <div class="card">
                            <div class="card-icon">🐦</div>
                            <h3 class="card-title">Social Media</h3>
                            <p class="card-description">Follow us for updates<br>@spademo on Twitter</p>
                        </div>
                    </div>
                </div>
            </div>
        `,
        notFound: `
            <div class="page" data-page="not-found">
                <div class="error-state">
                    <div class="error-icon">🔍</div>
                    <h1 class="error-title">Page Not Found</h1>
                    <p class="error-message">The page you're looking for doesn't exist or has been moved.</p>
                    <a href="/" data-link class="btn btn-primary">Return Home</a>
                </div>
            </div>
        `
    };

    // ==========================================================================
    // Utility Functions
    // ==========================================================================
    const utils = {
        /**
         * Parse URL and return normalized pathname
         */
        parseRoute(url) {
            try {
                const urlObj = new URL(url, window.location.origin);
                return urlObj.pathname || '/';
            } catch {
                // Fallback for hash-based routing
                const hashIndex = url.indexOf('#');
                if (hashIndex !== -1) {
                    const path = url.slice(hashIndex + 1);
                    return path || '/';
                }
                return '/';
            }
        },

        /**
         * Get route config for a path
         */
        getRouteConfig(path) {
            return CONFIG.routes[path] || null;
        },

        /**
         * Update document title
         */
        updateTitle(title) {
            document.title = `${title} | SPA Demo`;
        },

        /**
         * Show/hide loading overlay
         */
        setLoading(show) {
            state.isLoading = show;
            if (elements.loadingOverlay) {
                elements.loadingOverlay.classList.toggle('active', show);
                elements.loadingOverlay.setAttribute('aria-hidden', !show);
            }
        },

        /**
         * Generate unique ID
         */
        generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        },

        /**
         * Debounce function
         */
        debounce(fn, delay) {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => fn(...args), delay);
            };
        }
    };

    // ==========================================================================
    // Navigation Management
    // ==========================================================================
    const navigation = {
        init() {
            elements.navMenu = document.getElementById('nav-menu');
            elements.navToggle = document.querySelector('.nav-toggle');
            elements.navLinks = document.querySelectorAll('[data-link]');

            this.bindEvents();
            this.updateActiveLink();
        },

        bindEvents() {
            // Navigation links
            elements.navLinks.forEach(link => {
                link.addEventListener('click', (e) => this.handleLinkClick(e, link));
            });

            // Mobile menu toggle
            if (elements.navToggle) {
                elements.navToggle.addEventListener('click', () => this.toggleMobileMenu());
            }

            // Close mobile menu on link click
            if (elements.navMenu) {
                elements.navMenu.addEventListener('click', (e) => {
                    if (e.target.matches('[data-link]')) {
                        this.closeMobileMenu();
                    }
                });
            }

            // Close mobile menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileMenu();
                }
            });

            // Close mobile menu on outside click
            document.addEventListener('click', (e) => {
                if (elements.navMenu && elements.navMenu.classList.contains('active')) {
                    if (!elements.navMenu.contains(e.target) && !elements.navToggle.contains(e.target)) {
                        this.closeMobileMenu();
                    }
                }
            });
        },

        handleLinkClick(e, link) {
            const href = link.getAttribute('href');
            if (!href) return;

            // Check if it's an internal route
            if (href.startsWith('/') || href.startsWith('#')) {
                e.preventDefault();
                router.navigate(href);
                this.closeMobileMenu();
            }
        },

        toggleMobileMenu() {
            const isExpanded = elements.navToggle.getAttribute('aria-expanded') === 'true';
            elements.navToggle.setAttribute('aria-expanded', !isExpanded);
            elements.navMenu.classList.toggle('active');
        },

        closeMobileMenu() {
            elements.navToggle.setAttribute('aria-expanded', 'false');
            elements.navMenu.classList.remove('active');
        },

        updateActiveLink() {
            const currentPath = utils.parseRoute(window.location.href);
            elements.navLinks.forEach(link => {
                const href = link.getAttribute('href');
                const isActive = href === currentPath ||
                    (currentPath !== '/' && href !== '/' && currentPath.startsWith(href));
                link.classList.toggle('active', isActive);
                link.setAttribute('aria-current', isActive ? 'page' : 'false');
            });
        }
    };

    // ==========================================================================
    // Router - Core Routing Logic
    // ==========================================================================
    const router = {
        init() {
            elements.mainContent = document.getElementById('main-content');
            elements.loadingOverlay = document.getElementById('loading-overlay');
            elements.appContainer = document.querySelector('.app-container');

            // Handle popstate (browser back/forward)
            window.addEventListener('popstate', (e) => this.handlePopState(e));

            // Initial route
            const initialRoute = utils.parseRoute(window.location.href);
            this.navigate(initialRoute, { replace: true, skipPushState: true });

            // Handle hash changes (fallback)
            window.addEventListener('hashchange', () => {
                const route = utils.parseRoute(window.location.href);
                this.navigate(route, { skipPushState: true });
            });
        },

        /**
         * Navigate to a route
         * @param {string} path - Target path
         * @param {Object} options - Navigation options
         */
        async navigate(path, options = {}) {
            const { replace = false, skipPushState = false } = options;

            // Normalize path
            const normalizedPath = path.startsWith('/') ? path : '/' + path;
            const routeConfig = utils.getRouteConfig(normalizedPath);

            // Handle 404
            if (!routeConfig) {
                return this.handleNotFound(normalizedPath, options);
            }

            // Prevent duplicate navigation
            if (state.currentRoute === normalizedPath && !state.isTransitioning) {
                return;
            }

            // Prevent navigation during transition
            if (state.isTransitioning) {
                return;
            }

            state.isTransitioning = true;
            state.previousRoute = state.currentRoute;
            state.currentRoute = normalizedPath;

            // Update history
            if (!skipPushState) {
                if (replace) {
                    history.replaceState({ path: normalizedPath }, '', normalizedPath);
                } else {
                    history.pushState({ path: normalizedPath }, '', normalizedPath);
                }
            }

            // Add to history stack
            this.addToHistory(normalizedPath);

            // Update UI
            navigation.updateActiveLink();
            utils.updateTitle(routeConfig.title);

            // Load content with transition
            await this.loadContent(routeConfig.component, normalizedPath);

            state.isTransitioning = false;
        },

        /**
         * Handle browser back/forward
         */
        handlePopState(e) {
            const path = utils.parseRoute(window.location.href);
            const routeConfig = utils.getRouteConfig(path);

            if (routeConfig) {
                state.isTransitioning = true;
                state.previousRoute = state.currentRoute;
                state.currentRoute = path;

                navigation.updateActiveLink();
                utils.updateTitle(routeConfig.title);

                this.loadContent(routeConfig.component, path).then(() => {
                    state.isTransitioning = false;
                });
            } else {
                this.handleNotFound(path, { skipPushState: true });
            }
        },

        /**
         * Load and display content with transition
         */
        async loadContent(componentName, path) {
            const startTime = performance.now();

            // Show loading overlay (with minimum display time)
            utils.setLoading(true);

            // Get template
            const template = templates[componentName] || templates.notFound;

            // Minimum loading time for better UX
            const elapsed = performance.now() - startTime;
            const remainingDelay = Math.max(0, CONFIG.loadingDelay - elapsed);

            if (remainingDelay > 0) {
                await new Promise(resolve => setTimeout(resolve, remainingDelay));
            }

            // Perform transition
            await this.transitionContent(template);

            utils.setLoading(false);
        },

        /**
         * Animate content transition
         */
        transitionContent(newContent) {
            return new Promise((resolve) => {
                if (!elements.mainContent) {
                    resolve();
                    return;
                }

                const currentContent = elements.mainContent.firstElementChild;

                if (currentContent) {
                    // Exit animation
                    currentContent.classList.add('content-exit');
                    currentContent.classList.remove('content-enter');

                    setTimeout(() => {
                        this.injectContent(newContent);
                        resolve();
                    }, CONFIG.transitionDuration);
                } else {
                    // First load
                    this.injectContent(newContent);
                    resolve();
                }
            });
        },

        /**
         * Inject new content into DOM
         */
        injectContent(html) {
            if (!elements.mainContent) return;

            elements.mainContent.innerHTML = html;

            const newContent = elements.mainContent.firstElementChild;
            if (newContent) {
                // Force reflow for animation
                newContent.offsetHeight;
                newContent.classList.add('content-enter');
            }

            // Re-initialize any interactive elements
            this.initializePageElements();
        },

        /**
         * Initialize interactive elements on new page
         */
        initializePageElements() {
            // Re-bind navigation links in new content
            const newLinks = elements.mainContent.querySelectorAll('[data-link]');
            newLinks.forEach(link => {
                link.addEventListener('click', (e) => navigation.handleLinkClick(e, link));
            });

            // Initialize forms
            const contactForm = document.getElementById('contact-form');
            if (contactForm) {
                this.initContactForm(contactForm);
            }

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        /**
         * Initialize contact form handling
         */
        initContactForm(form) {
            // Remove any existing listeners
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);

            newForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const formData = new FormData(newForm);
                const data = Object.fromEntries(formData.entries());

                // Validate
                if (!this.validateForm(data)) {
                    return;
                }

                // Show loading state
                const submitBtn = newForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Show success
                this.showFormSuccess(newForm);

                // Reset after delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    newForm.reset();
                    this.hideFormSuccess(newForm);
                }, 3000);
            });
        },

        /**
         * Validate form data
         */
        validateForm(data) {
            const errors = [];

            if (!data.name || data.name.trim().length < 2) {
                errors.push('Name must be at least 2 characters');
            }

            if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                errors.push('Please enter a valid email address');
            }

            if (!data.subject) {
                errors.push('Please select a subject');
            }

            if (!data.message || data.message.trim().length < 10) {
                errors.push('Message must be at least 10 characters');
            }

            if (errors.length > 0) {
                alert(errors.join('\n'));
                return false;
            }

            return true;
        },

        /**
         * Show form success message
         */
        showFormSuccess(form) {
            let successEl = form.querySelector('.form-success');
            if (!successEl) {
                successEl = document.createElement('div');
                successEl.className = 'form-success';
                successEl.style.cssText = `
                    background: #d4edda;
                    color: #155724;
                    padding: var(--space-4);
                    border-radius: var(--radius-md);
                    margin-top: var(--space-4);
                    animation: fadeSlideUp var(--transition-base) ease-out;
                `;
                successEl.textContent = 'Thank you! Your message has been sent successfully.';
                form.appendChild(successEl);
            }
            successEl.style.display = 'block';
        },

        /**
         * Hide form success message
         */
        hideFormSuccess(form) {
            const successEl = form.querySelector('.form-success');
            if (successEl) {
                successEl.style.display = 'none';
            }
        },

        /**
         * Handle 404 routes
         */
        handleNotFound(path, options = {}) {
            state.currentRoute = path;
            utils.updateTitle('Page Not Found');
            navigation.updateActiveLink();

            if (!options.skipPushState) {
                history.pushState({ path }, '', path);
            }

            this.loadContent('notFound', path);
        },

        /**
         * Add route to history stack
         */
        addToHistory(path) {
            state.routeHistory.push({
                path,
                timestamp: Date.now()
            });

            // Trim history
            if (state.routeHistory.length > state.maxHistorySize) {
                state.routeHistory.shift();
            }
        },

        /**
         * Get current route info
         */
        getCurrentRoute() {
            return {
                path: state.currentRoute,
                previousPath: state.previousRoute,
                history: [...state.routeHistory]
            };
        }
    };

    // ==========================================================================
    // Application Initialization
    // ==========================================================================
    const app = {
        init() {
            // Wait for DOM
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.bootstrap());
            } else {
                this.bootstrap();
            }
        },

        bootstrap() {
            console.log('[SPA] Initializing application...');

            // Initialize modules
            navigation.init();
            router.init();

            // Global error handling
            window.addEventListener('error', (e) => this.handleError(e));
            window.addEventListener('unhandledrejection', (e) => this.handleError(e));

            // Performance monitoring
            this.setupPerformanceMonitoring();

            console.log('[SPA] Application ready');
        },

        handleError(e) {
            console.error('[SPA] Error:', e.error || e.reason || e.message);
            // Could send to error tracking service
        },

        setupPerformanceMonitoring() {
            // Log navigation timing
            if ('performance' in window && performance.getEntriesByType) {
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        const navEntries = performance.getEntriesByType('navigation');
                        if (navEntries.length > 0) {
                            const nav = navEntries[0];
                            console.log('[SPA] Performance:', {
                                domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart),
                                loadComplete: Math.round(nav.loadEventEnd - nav.loadEventStart),
                                totalTime: Math.round(nav.loadEventEnd - nav.fetchStart)
                            });
                        }
                    }, 0);
                });
            }
        }
    };

    // ==========================================================================
    // Public API (for debugging/extension)
    // ==========================================================================
    window.SPA = {
        router,
        navigation,
        state,
        utils,
        CONFIG,
        templates
    };

    // Start the application
    app.init();

})();