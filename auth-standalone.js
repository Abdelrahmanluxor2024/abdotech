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

        if (isSignupMode) {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
            toggleText.textContent = 'Already have an account? Sign In';
            document.querySelector('.card-title').textContent = 'Create Account';
            document.querySelector('.card-subtitle').textContent = 'Sign up to get started';
        } else {
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
            toggleText.textContent = 'Create New Account';
            document.querySelector('.card-title').textContent = 'Welcome Back';
            document.querySelector('.card-subtitle').textContent = 'Sign in to access your account';
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

    // ==================== GOOGLE LOGIN HANDLER ====================
    async function handleGoogleLogin() {
        try {
            const { data, error } = await supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.href.replace('login.html', 'index.html')
                }
            });

            if (error) throw error;

        } catch (error) {
            console.error('Google login error:', error);
            showAlert('error', getErrorMessage(error));
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

    console.log('✅ Login page initialized (standalone version)');
})();
