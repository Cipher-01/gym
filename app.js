/* ==========================================
   APEX FIT GYM MANAGEMENT SYSTEM - CLIENT LOGIC
   ========================================== */

// 1. Global Application State
const appState = {
    isLoggedIn: false,
    userEmail: '',
    selectedPackage: null, // Holds object: { name, price }
    packages: {
        'Basic': {
            price: 'KSh 2,000',
            perks: ['Gym Access', 'Locker Access']
        },
        'Standard': {
            price: 'KSh 4,000',
            perks: ['Gym Access', 'Locker Access', 'Group Classes']
        },
        'Premium': {
            price: 'KSh 6,500',
            perks: ['Unlimited Gym Access', 'Locker Access', 'Group Classes', 'Personal Trainer', 'Nutrition Advice']
        }
    }
};

// 2. DOM Elements Cache
const elements = {
    // Nav Items
    desktopNavLinks: document.querySelectorAll('#desktop-nav .nav-link'),
    mobileNavLinks: document.querySelectorAll('#mobile-nav-drawer .mobile-nav-link'),
    mobileToggle: document.getElementById('mobile-nav-toggle'),
    mobileDrawer: document.getElementById('mobile-nav-drawer'),
    loginNavLink: document.getElementById('nav-login'),
    mobLoginNavLink: document.getElementById('mob-nav-login'),
    
    // Page Sections
    pages: document.querySelectorAll('.page-section'),
    
    // Package Selection
    choosePlanButtons: document.querySelectorAll('.choose-plan-btn'),
    
    // Login Page
    loginForm: document.getElementById('login-form'),
    loginEmail: document.getElementById('login-email'),
    loginPassword: document.getElementById('login-password'),
    loginError: document.getElementById('login-error'),
    loginErrorMsg: document.getElementById('login-error-msg'),
    
    // Dashboard Page
    dashboardUserEmail: document.getElementById('user-email-display'),
    dashboardPackageName: document.getElementById('dashboard-package-name'),
    dashboardPerksList: document.getElementById('dashboard-perks-list'),
    logoutBtn: document.getElementById('logout-btn'),
    
    // Contact Page
    contactForm: document.getElementById('contact-form'),
    contactName: document.getElementById('contact-name'),
    contactEmail: document.getElementById('contact-email'),
    contactMessage: document.getElementById('contact-message'),
    contactSuccess: document.getElementById('contact-success'),
    contactError: document.getElementById('contact-error')
};

// 3. SPA Router Logic
function handleRouting() {
    // Get current hash, default to '#/home'
    let currentHash = window.location.hash || '#/home';
    
    // Normalise hash
    const validHashes = ['#/home', '#/packages', '#/login', '#/dashboard', '#/contact'];
    if (!validHashes.includes(currentHash)) {
        currentHash = '#/home';
        window.location.hash = '#/home';
    }

    // Auth Guard: Direct non-logged in users away from dashboard
    if (currentHash === '#/dashboard' && !appState.isLoggedIn) {
        window.location.hash = '#/login';
        return;
    }

    // Auth Guard: Direct logged in users away from login
    if (currentHash === '#/login' && appState.isLoggedIn) {
        window.location.hash = '#/dashboard';
        return;
    }

    // Extract page id (e.g. 'home' from '#/home')
    const targetPageId = currentHash.replace('#/', '');

    // Toggle Page Sections
    elements.pages.forEach(section => {
        if (section.id === targetPageId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    // Update Nav Bar Active Classes
    updateActiveNavLinks(currentHash);

    // Scroll back to top on page switch
    window.scrollTo(0, 0);

    // Special Section Triggers
    if (targetPageId === 'dashboard') {
        renderDashboard();
    }
}

function updateActiveNavLinks(hash) {
    // Map active highlights for both desktop and mobile drawer
    elements.desktopNavLinks.forEach(link => {
        if (link.getAttribute('href') === hash) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    elements.mobileNavLinks.forEach(link => {
        if (link.getAttribute('href') === hash) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// 4. Navigation Toggles
function toggleMobileMenu() {
    const isOpen = elements.mobileDrawer.classList.toggle('open');
    elements.mobileToggle.classList.toggle('open', isOpen);
    elements.mobileToggle.setAttribute('aria-expanded', isOpen);
}

function closeMobileMenu() {
    elements.mobileDrawer.classList.remove('open');
    elements.mobileToggle.classList.remove('open');
    elements.mobileToggle.setAttribute('aria-expanded', 'false');
}

// 5. Package Selection Flow
function handlePackageSelection(e) {
    const btn = e.target;
    const planName = btn.dataset.plan;
    const planPrice = btn.dataset.price;

    // Save package in temporary state
    appState.selectedPackage = {
        name: planName,
        price: planPrice
    };

    // Standard JavaScript alert confirmation
    alert(`Package Confirmed!\n\nYou have selected the ${planName} package at ${planPrice} per month.`);

    // UX Redirect
    if (!appState.isLoggedIn) {
        // Direct to login page so they can register their account
        window.location.hash = '#/login';
    } else {
        // Refresh dashboard and show the selected plan
        renderDashboard();
        window.location.hash = '#/dashboard';
    }
}

// 6. User Authentication (Login)
function handleLoginSubmit(e) {
    e.preventDefault();
    
    // Hide previous errors
    elements.loginError.classList.add('hidden');

    const email = elements.loginEmail.value.trim();
    const password = elements.loginPassword.value;

    // Field Validation
    if (!email || !password) {
        showLoginError('Both email and password fields are required.');
        return;
    }

    // Basic Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showLoginError('Please enter a valid email address.');
        return;
    }

    // Successful login simulation
    appState.isLoggedIn = true;
    appState.userEmail = email;

    // If no package selected, default to "Standard" as popular
    if (!appState.selectedPackage) {
        appState.selectedPackage = {
            name: 'Standard',
            price: 'KSh 4,000'
        };
    }

    // Update Nav bar labels dynamically
    updateNavForLoginState(true);

    // Redirect to Dashboard
    window.location.hash = '#/dashboard';

    // Clear inputs
    elements.loginForm.reset();
}

function showLoginError(msg) {
    elements.loginErrorMsg.textContent = msg;
    elements.loginError.classList.remove('hidden');
    elements.loginError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function updateNavForLoginState(loggedIn) {
    if (loggedIn) {
        elements.loginNavLink.textContent = 'Dashboard';
        elements.loginNavLink.setAttribute('href', '#/dashboard');
        
        elements.mobLoginNavLink.textContent = 'Dashboard';
        elements.mobLoginNavLink.setAttribute('href', '#/dashboard');
    } else {
        elements.loginNavLink.textContent = 'Login';
        elements.loginNavLink.setAttribute('href', '#/login');
        
        elements.mobLoginNavLink.textContent = 'Login';
        elements.mobLoginNavLink.setAttribute('href', '#/login');
    }
}

// 7. Dashboard Rendering
function renderDashboard() {
    elements.dashboardUserEmail.textContent = appState.userEmail;
    
    const pkg = appState.selectedPackage || { name: 'None', price: '0' };
    elements.dashboardPackageName.textContent = `${pkg.name} Plan (${pkg.price}/mo)`;

    // Inject perks based on selection
    elements.dashboardPerksList.innerHTML = '';
    const details = appState.packages[pkg.name];
    if (details) {
        details.perks.forEach(perk => {
            const li = document.createElement('li');
            li.innerHTML = `
                <svg class="perk-check-icon" viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <span>${perk}</span>
            `;
            elements.dashboardPerksList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No features available. Please select a plan.';
        elements.dashboardPerksList.appendChild(li);
    }
}

// 8. Logout Functionality
function handleLogout() {
    appState.isLoggedIn = false;
    appState.userEmail = '';
    appState.selectedPackage = null;

    updateNavForLoginState(false);
    window.location.hash = '#/login';
}

// 9. Contact Form Handling
function handleContactSubmit(e) {
    e.preventDefault();

    // Reset alert states
    elements.contactSuccess.classList.add('hidden');
    elements.contactError.classList.add('hidden');

    const name = elements.contactName.value.trim();
    const email = elements.contactEmail.value.trim();
    const message = elements.contactMessage.value.trim();

    // Check non-empty
    if (!name || !email || !message) {
        elements.contactError.classList.remove('hidden');
        return;
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        elements.contactError.classList.remove('hidden');
        return;
    }

    // Success state
    elements.contactSuccess.classList.remove('hidden');
    elements.contactForm.reset();
}

// 10. Event Listeners Setup
function initApp() {
    // Router events
    window.addEventListener('hashchange', handleRouting);
    window.addEventListener('load', handleRouting);

    // Mobile nav toggle
    elements.mobileToggle.addEventListener('click', toggleMobileMenu);
    
    // Close mobile nav on links clicked
    elements.mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Package plan selectors
    elements.choosePlanButtons.forEach(btn => {
        btn.addEventListener('click', handlePackageSelection);
    });

    // Login submit
    elements.loginForm.addEventListener('submit', handleLoginSubmit);

    // Logout click
    elements.logoutBtn.addEventListener('click', handleLogout);

    // Contact submit
    elements.contactForm.addEventListener('submit', handleContactSubmit);
}

// Fire initialisers
initApp();
