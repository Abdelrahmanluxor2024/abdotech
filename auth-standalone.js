// ==================== SUPABASE AUTH - STANDALONE VERSION ====================
// This version works without ES Modules (works with file:// protocol)
// All code is in one file

(function () {
    'use strict';

    // ==================== SUPABASE CONFIG ====================
    const SUPABASE_URL = 'https://bebudhdiylpxrmddrhyp.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlYnVkaGRpeWxweHJtZGRyaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODI4NTksImV4cCI6MjA5ODA1ODg1OX0.LB6-Tg7QdOertHK3eEue966iblIgVzO7982-WAg2bVM';

    // Initialize Supabase with Same Persistence
    const { createClient } = supabase;
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            persistSession: true,
            storageKey: 'project_auth_token', // نفس المفتاح بالضبط
            storage: window.localStorage,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    });

    // ==================== DOM ELEMENTS ====================
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const toggleFormBtn = document.getElementById('toggle-form-btn');
    const toggleText = document.getElementById('toggle-text');
    const alertContainer = document.getElementById('alert-container');
    const alertMessage = document.getElementById('alert-message');
    const alertText = document.querySelector('.alert-text');

    let isSignupMode = false;

    // ==================== CHECK URL MODE ====================
    // If coming from ?mode=signup link, default to signup form
    (function () {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('mode') === 'signup') {
            isSignupMode = true;
            // Switch UI immediately
            const loginForm = document.getElementById('login-form');
            const signupForm = document.getElementById('signup-form');
            const toggleText = document.getElementById('toggle-text');
            const cardTitle = document.querySelector('.card-title');
            const cardSubtitle = document.querySelector('.card-subtitle');
            if (loginForm) loginForm.classList.add('hidden');
            if (signupForm) signupForm.classList.remove('hidden');
            if (toggleText) toggleText.textContent = 'Already have an account? Sign In';
            if (cardTitle) cardTitle.textContent = 'Create Account';
            if (cardSubtitle) cardSubtitle.textContent = 'Sign up to get started';
        }
    })();

    // ==================== UI FUNCTIONS ====================
    function showAlert(type, message) {
        alertContainer.classList.remove('hidden');
        alertMessage.className = `alert ${type}`;
        alertText.textContent = message;

        if (type === 'success') {
            setTimeout(() => closeAlert(), 5000);
        }
    }

    window.closeAlert = function () {
        alertContainer.classList.add('hidden');
    };

    window.toggleForm = function toggleForm() {
        isSignupMode = !isSignupMode;
        const googleBtnLabel = document.getElementById('google-btn-label');

        if (isSignupMode) {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
            toggleText.textContent = 'Already have an account? Sign In';
            document.querySelector('.card-title').textContent = 'Create Account';
            document.querySelector('.card-subtitle').textContent = 'Sign up to get started';
            if (googleBtnLabel) googleBtnLabel.textContent = 'Sign up with Google';
        } else {
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
            toggleText.textContent = 'Create New Account';
            document.querySelector('.card-title').textContent = 'Welcome Back';
            document.querySelector('.card-subtitle').textContent = 'Sign in to access your account';
            if (googleBtnLabel) googleBtnLabel.textContent = 'Sign in with Google';
        }

        closeAlert();
    }

    window.togglePasswordVisibility = function (formType) {
        const passwordInput = formType === 'signup'
            ? document.getElementById('signup-password')
            : document.getElementById('password');

        passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    };

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function getErrorMessage(error) {
        if (!error || !error.message) return 'An unexpected error occurred';

        const errorMsg = error.message.toLowerCase();

        if (errorMsg.includes('invalid login credentials')) {
            return 'Invalid email or password. Please try again.';
        } else if (errorMsg.includes('email not confirmed')) {
            return 'Please confirm your email address to continue.';
        } else if (errorMsg.includes('user already registered')) {
            return 'This email is already registered. Please sign in instead.';
        } else if (errorMsg.includes('password should be at least 6 characters')) {
            return 'Password must be at least 6 characters long.';
        } else if (errorMsg.includes('rate limit')) {
            return 'Too many attempts. Please wait a moment and try again.';
        } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
            return 'Network error. Please check your internet connection.';
        }

        return error.message;
    }

    // ==================== LOGIN HANDLER ====================
    async function handleLogin(event) {
        event.preventDefault();

        const loginBtn = document.getElementById('login-btn');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoader = loginBtn.querySelector('.btn-loader');

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            showAlert('error', 'Please fill in all fields');
            return;
        }

        if (!isValidEmail(email)) {
            showAlert('error', 'Please enter a valid email address');
            return;
        }

        loginBtn.disabled = true;
        btnText.style.opacity = '0';
        btnLoader.classList.remove('hidden');

        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                // Handle specific confirm email case
                if (error.message.includes('Email not confirmed')) {
                    showAlert('warning', 'Please check your email to confirm account, or use a new email.');
                } else {
                    showAlert('error', getErrorMessage(error));
                }
            } else {
                console.log('✅ Login successful:', data);
                // Mark user as having an account so we don't show signup banner
                localStorage.setItem('signup_banner_dismissed', 'true');
                // FORCE redirect with token hash for file:// support
                const token = data.session.access_token;
                const refresh = data.session.refresh_token;
                // Debug log
                console.log('Redirecting with token...');
                window.location.replace(`index.html#access_token=${token}&refresh_token=${refresh}`);
            }
        } catch (error) {
            console.error('Login error:', error);
            showAlert('error', 'An unexpected error occurred');
        } finally {
            if (!document.querySelector('.alert.success')) {
                // Only reset button if not success redirecting
                loginBtn.disabled = false;
                btnText.style.opacity = '1';
                btnLoader.classList.add('hidden');
            }
        }
    }

    // ==================== SIGNUP HANDLER ====================
    async function handleSignup(event) {
        event.preventDefault();

        const signupBtn = document.getElementById('signup-btn');
        const btnText = signupBtn.querySelector('.btn-text');
        const btnLoader = signupBtn.querySelector('.btn-loader');

        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;

        // بيانات إضافية
        const username = document.getElementById('username').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const country = document.getElementById('country').value;

        if (!email || !password || !username) {
            showAlert('error', 'Please fill in all required fields (Username, Email, Password)');
            return;
        }

        if (!isValidEmail(email)) {
            showAlert('error', 'Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            showAlert('error', 'Password must be at least 6 characters long');
            return;
        }

        signupBtn.disabled = true;
        btnText.style.opacity = '0';
        btnLoader.classList.remove('hidden');

        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username,
                        phone: phone,
                        country: country,
                        full_name: username // مبدئيا نستخدم اليوزر نيم كاسم كامل
                    }
                }
            });

            if (error) {
                showAlert('error', getErrorMessage(error));
            } else {
                if (data?.user?.identities?.length === 0) {
                    showAlert('warning', 'This email is already registered. Please sign in instead.');
                } else {
                    // Mark user as having an account
                    localStorage.setItem('signup_banner_dismissed', 'true');
                    showAlert('success', 'Account created successfully! You can now sign in.');
                    setTimeout(() => window.toggleForm(), 2000);
                }
            }
        } catch (error) {
            console.error('Signup error:', error);
            showAlert('error', 'An unexpected error occurred');
        } finally {
            signupBtn.disabled = false;
            btnText.style.opacity = '1';
            btnLoader.classList.add('hidden');
        }
    }

    // ==================== AUTH STATE LISTENER ====================
    supabaseClient.auth.onAuthStateChange((event, session) => {
        console.log('🔔 Auth event:', event);

        if (event === 'SIGNED_IN') {
            // Immediate redirect if logged in
            window.location.replace('index.html');
        }
    });

    // ==================== GOOGLE CLIENT CONFIG ====================
    const GOOGLE_CLIENT_ID = '192480132298-jt33utn5motg52f308c4kihqenj09t4v.apps.googleusercontent.com';

    // Helper: Decode JWT
    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Failed to parse JWT', e);
            return null;
        }
    }

    // Google Identity Services (GIS) Credential Handler
    async function handleGoogleCredentialResponse(response) {
        try {
            console.log('✅ Google credential response received');
            const idToken = response.credential;
            const profile = parseJwt(idToken);

            if (profile) {
                // Store Google session profile for immediate recognition
                const customSession = {
                    user: {
                        id: profile.sub,
                        email: profile.email,
                        user_metadata: {
                            full_name: profile.name,
                            avatar_url: profile.picture,
                            email: profile.email
                        }
                    },
                    access_token: idToken,
                    expires_at: profile.exp
                };

                localStorage.setItem('google_auth_user', JSON.stringify(customSession));
                localStorage.setItem('signup_banner_dismissed', 'true');

                // Also try Supabase signInWithIdToken if supported
                try {
                    if (supabaseClient.auth.signInWithIdToken) {
                        await supabaseClient.auth.signInWithIdToken({
                            provider: 'google',
                            token: idToken
                        });
                    }
                } catch (sbErr) {
                    console.warn('Supabase ID token signin:', sbErr.message);
                }

                showAlert('success', `Welcome, ${profile.name}! Redirecting...`);
                setTimeout(() => {
                    window.location.replace('index.html');
                }, 1000);
            }
        } catch (error) {
            console.error('Google token error:', error);
            showAlert('error', 'Google authentication failed: ' + error.message);
        }
    }

    // Initialize GIS if loaded
    function initGoogleGIS() {
        if (window.google && window.google.accounts && window.google.accounts.id) {
            try {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleGoogleCredentialResponse,
                    auto_select: false,
                    cancel_on_tap_outside: true
                });
                console.log('✅ Google Identity Services initialized');
            } catch (e) {
                console.warn('GIS init notice:', e.message);
            }
        }
    }

    window.addEventListener('load', initGoogleGIS);

    // ==================== GOOGLE LOGIN HANDLER ====================
    async function handleGoogleLogin() {
        const googleBtn = document.getElementById('google-btn');
        if (googleBtn) googleBtn.disabled = true;

        try {
            // First try Google Identity Services prompt if available
            if (window.google && window.google.accounts && window.google.accounts.id) {
                initGoogleGIS();
                window.google.accounts.id.prompt((notification) => {
                    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                        // Fallback to Supabase OAuth if One-Tap prompt not displayed
                        triggerSupabaseGoogleOAuth();
                    }
                });
            } else {
                await triggerSupabaseGoogleOAuth();
            }
        } catch (error) {
            console.error('Google login error:', error);
            showAlert('error', getErrorMessage(error));
            if (googleBtn) googleBtn.disabled = false;
        }
    }

    async function triggerSupabaseGoogleOAuth() {
        const isFileProtocol = window.location.protocol === 'file:';
        const redirectTo = isFileProtocol 
            ? window.location.href.replace('login.html', 'index.html')
            : window.location.origin + window.location.pathname.replace('login.html', 'index.html');

        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectTo,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            }
        });

        if (error) throw error;
        if (data && data.url) {
            window.location.href = data.url;
        }
    }

    // ==================== EVENT LISTENERS ====================
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    toggleFormBtn.addEventListener('click', toggleForm);

    // Add Google Button Listener
    const googleBtn = document.getElementById('google-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', handleGoogleLogin);
    }

    console.log('✅ Login page initialized (standalone version with Google auth)');
})();
