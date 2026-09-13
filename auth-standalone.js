// ==================== SUPABASE AUTH - STANDALONE VERSION ====================
// Fixed version - All buttons working correctly

document.addEventListener('DOMContentLoaded', function () {

    // ==================== SUPABASE CONFIG ====================
    var SUPABASE_URL = 'https://bebudhdiylpxrmddrhyp.supabase.co';
    var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlYnVkaGRpeWxweHJtZGRyaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODI4NTksImV4cCI6MjA5ODA1ODg1OX0.LB6-Tg7QdOertHK3eEue966iblIgVzO7982-WAg2bVM';

    var supabaseClient = null;
    if (window.supabase && window.supabase.createClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: true,
                storageKey: 'project_auth_token',
                storage: window.localStorage,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        });
        console.log('Supabase initialized OK');
    } else {
        console.error('Supabase library not loaded!');
    }

    // ==================== DOM ELEMENTS ====================
    var loginForm      = document.getElementById('login-form');
    var signupForm     = document.getElementById('signup-form');
    var toggleFormBtn  = document.getElementById('toggle-form-btn');
    var toggleText     = document.getElementById('toggle-text');
    var toggleDivText  = document.getElementById('toggle-divider-text');
    var alertContainer = document.getElementById('alert-container');
    var alertMessage   = document.getElementById('alert-message');
    var alertTextEl    = document.querySelector('.alert-text');

    var isSignupMode  = false;
    var isRedirecting = false;

    // ==================== ALERT FUNCTIONS ====================
    function showAlert(type, message) {
        if (!alertContainer || !alertMessage || !alertTextEl) return;
        alertContainer.classList.remove('hidden');
        alertMessage.className = 'alert ' + type;
        alertTextEl.textContent = message;
        if (type === 'success') {
            setTimeout(function () { closeAlert(); }, 5000);
        }
    }

    function closeAlert() {
        if (alertContainer) alertContainer.classList.add('hidden');
    }

    window.closeAlert = closeAlert;

    // ==================== PASSWORD TOGGLE ====================
    window.togglePasswordVisibility = function (formType) {
        var id = formType === 'signup' ? 'signup-password' : 'password';
        var el = document.getElementById(id);
        if (el) el.type = (el.type === 'password') ? 'text' : 'password';
    };

    // ==================== HELPERS ====================
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function getErrorMessage(error) {
        if (!error || !error.message) return 'An unexpected error occurred';
        var msg = error.message.toLowerCase();
        if (msg.indexOf('invalid login credentials') !== -1) return 'Invalid email or password. Please try again.';
        if (msg.indexOf('email not confirmed') !== -1)       return 'Please confirm your email address to continue.';
        if (msg.indexOf('user already registered') !== -1)   return 'This email is already registered. Please sign in instead.';
        if (msg.indexOf('password should be at least') !== -1) return 'Password must be at least 6 characters long.';
        if (msg.indexOf('rate limit') !== -1)                return 'Too many attempts. Please wait a moment and try again.';
        if (msg.indexOf('network') !== -1 || msg.indexOf('fetch') !== -1) return 'Network error. Please check your internet connection.';
        return error.message;
    }

    // ==================== MODE SWITCHING ====================
    function setAuthMode(mode) {
        isSignupMode = (mode === 'signup');

        var cardTitle    = document.querySelector('.card-title');
        var cardSubtitle = document.querySelector('.card-subtitle');
        var googleLabel  = document.getElementById('google-btn-label');

        if (isSignupMode) {
            if (loginForm)    loginForm.classList.add('hidden');
            if (signupForm)   signupForm.classList.remove('hidden');
            if (toggleText)   toggleText.textContent = 'Sign In';
            if (toggleDivText) toggleDivText.textContent = 'Already have an account?';
            if (cardTitle)    cardTitle.textContent = 'Create Account';
            if (cardSubtitle) cardSubtitle.textContent = 'Sign up to get started';
            if (googleLabel)  googleLabel.textContent = 'Sign up with Google';
            try {
                if (window.location.search !== '?mode=signup')
                    window.history.replaceState(null, '', 'login.html?mode=signup');
            } catch(e) {}
        } else {
            if (signupForm)   signupForm.classList.add('hidden');
            if (loginForm)    loginForm.classList.remove('hidden');
            if (toggleText)   toggleText.textContent = 'Create New Account';
            if (toggleDivText) toggleDivText.textContent = "Don't have an account?";
            if (cardTitle)    cardTitle.textContent = 'Welcome Back';
            if (cardSubtitle) cardSubtitle.textContent = 'Sign in to access your account';
            if (googleLabel)  googleLabel.textContent = 'Continue with Google';
            try {
                if (window.location.search.indexOf('mode=signup') !== -1)
                    window.history.replaceState(null, '', 'login.html');
            } catch(e) {}
        }
        closeAlert();
    }

    window.setAuthMode = setAuthMode;
    window.toggleForm  = function (e) {
        if (e && e.preventDefault) e.preventDefault();
        setAuthMode(isSignupMode ? 'signin' : 'signup');
    };

    // Read URL on load
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'signup' || window.location.hash === '#signup') {
        setAuthMode('signup');
    } else {
        setAuthMode('signin');
    }

    window.addEventListener('popstate', function () {
        var p = new URLSearchParams(window.location.search);
        setAuthMode(p.get('mode') === 'signup' ? 'signup' : 'signin');
    });

    // ==================== LOGIN HANDLER ====================
    async function handleLogin(event) {
        event.preventDefault();
        if (!supabaseClient) {
            showAlert('error', 'Service not available. Please refresh the page.');
            return;
        }

        var loginBtn  = document.getElementById('login-btn');
        var btnText   = loginBtn ? loginBtn.querySelector('.btn-text')   : null;
        var btnLoader = loginBtn ? loginBtn.querySelector('.btn-loader') : null;

        var emailEl    = document.getElementById('email');
        var passwordEl = document.getElementById('password');
        var email      = emailEl    ? emailEl.value.trim() : '';
        var password   = passwordEl ? passwordEl.value     : '';

        if (!email || !password) {
            showAlert('error', 'Please fill in all fields');
            return;
        }
        if (!isValidEmail(email)) {
            showAlert('error', 'Please enter a valid email address');
            return;
        }

        if (loginBtn)  loginBtn.disabled = true;
        if (btnText)   btnText.style.opacity = '0';
        if (btnLoader) btnLoader.classList.remove('hidden');

        try {
            var result = await supabaseClient.auth.signInWithPassword({ email: email, password: password });
            var data   = result.data;
            var error  = result.error;

            if (error) {
                if (error.message.indexOf('Email not confirmed') !== -1) {
                    showAlert('warning', 'Please check your email inbox and confirm your account first, then try to sign in.');
                } else {
                    showAlert('error', getErrorMessage(error));
                }
                if (loginBtn)  loginBtn.disabled = false;
                if (btnText)   btnText.style.opacity = '1';
                if (btnLoader) btnLoader.classList.add('hidden');
            } else {
                console.log('Login successful!');
                localStorage.setItem('signup_banner_dismissed', 'true');

                var u = data.user || (data.session && data.session.user);
                if (u) {
                    var uMeta = u.user_metadata || {};
                    var activeProfile = {
                        id: u.id,
                        email: u.email,
                        username: uMeta.username || u.email.split('@')[0],
                        full_name: uMeta.full_name || uMeta.username || '',
                        phone: uMeta.phone || '',
                        country: uMeta.country || 'Luxor',
                        avatar_url: uMeta.avatar_url || ''
                    };
                    localStorage.setItem('active_user_session', JSON.stringify(activeProfile));
                    localStorage.setItem('user_profile_' + u.id, JSON.stringify(activeProfile));
                }

                isRedirecting = true;
                showAlert('success', 'Login successful! Redirecting...');

                setTimeout(function () {
                    if (data.session && data.session.access_token) {
                        window.location.replace('index.html#access_token=' + data.session.access_token + '&refresh_token=' + data.session.refresh_token);
                    } else {
                        window.location.replace('index.html');
                    }
                }, 800);
            }
        } catch (err) {
            console.error('Login error:', err);
            showAlert('error', 'An unexpected error occurred. Please try again.');
            if (loginBtn)  loginBtn.disabled = false;
            if (btnText)   btnText.style.opacity = '1';
            if (btnLoader) btnLoader.classList.add('hidden');
        }
    }

    // ==================== SIGNUP HANDLER ====================
    async function handleSignup(event) {
        event.preventDefault();
        if (!supabaseClient) {
            showAlert('error', 'Service not available. Please refresh the page.');
            return;
        }

        var signupBtn = document.getElementById('signup-btn');
        var btnText   = signupBtn ? signupBtn.querySelector('.btn-text')   : null;
        var btnLoader = signupBtn ? signupBtn.querySelector('.btn-loader') : null;

        var emailEl    = document.getElementById('signup-email');
        var passwordEl = document.getElementById('signup-password');
        var usernameEl = document.getElementById('username');
        var phoneEl    = document.getElementById('phone');
        var countryEl  = document.getElementById('country');

        var email    = emailEl    ? emailEl.value.trim()    : '';
        var password = passwordEl ? passwordEl.value        : '';
        var username = usernameEl ? usernameEl.value.trim() : '';
        var phone    = phoneEl    ? phoneEl.value.trim()    : '';
        var country  = countryEl  ? countryEl.value         : 'Luxor';

        if (!email || !password || !username) {
            showAlert('error', 'Please fill in Username, Email, and Password');
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

        if (signupBtn) signupBtn.disabled = true;
        if (btnText)   btnText.style.opacity = '0';
        if (btnLoader) btnLoader.classList.remove('hidden');

        try {
            var result = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        username: username,
                        phone: phone,
                        country: country,
                        full_name: username
                    }
                }
            });
            var data  = result.data;
            var error = result.error;

            if (error) {
                showAlert('error', getErrorMessage(error));
            } else if (data && data.user && data.user.identities && data.user.identities.length === 0) {
                showAlert('warning', 'This email is already registered. Please sign in instead.');
            } else {
                var userId = (data && data.user && data.user.id) ? data.user.id : ('user_' + Date.now());
                var profileObj = {
                    id: userId, username: username, full_name: username,
                    phone: phone, country: country, email: email
                };
                localStorage.setItem('active_user_session',     JSON.stringify(profileObj));
                localStorage.setItem('user_profile_' + userId,  JSON.stringify(profileObj));
                localStorage.setItem('last_registered_profile', JSON.stringify(profileObj));
                localStorage.setItem('saved_user_email', email);
                localStorage.setItem('saved_user_name',  username);
                localStorage.setItem('saved_user_phone', phone);
                localStorage.setItem('saved_user_gov',   country);
                localStorage.setItem('signup_banner_dismissed', 'true');

                if (data && data.user) {
                    try { await supabaseClient.from('user_profiles').upsert([profileObj]); }
                    catch (dbErr) { console.warn('DB upsert:', dbErr); }
                }

                showAlert('success', 'Account created! Please check your email to confirm, then sign in.');
                setTimeout(function () { setAuthMode('signin'); }, 3500);
            }
        } catch (err) {
            console.error('Signup error:', err);
            showAlert('error', 'An unexpected error occurred. Please try again.');
        } finally {
            if (signupBtn) signupBtn.disabled = false;
            if (btnText)   btnText.style.opacity = '1';
            if (btnLoader) btnLoader.classList.add('hidden');
        }
    }

    // ==================== GOOGLE ====================
    var GOOGLE_CLIENT_ID = '192480132298-jt33utn5motg52f308c4kihqenj09t4v.apps.googleusercontent.com';

    function parseJwt(token) {
        try {
            var b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(decodeURIComponent(atob(b64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join('')));
        } catch(e) { return null; }
    }

    function handleGoogleCredentialResponse(response) {
        var idToken = response.credential;
        var profile = parseJwt(idToken);
        if (!profile) { showAlert('error', 'Google sign-in failed. Please try again.'); return; }

        var activeProfile = {
            id: profile.sub, email: profile.email,
            username: profile.name || profile.email.split('@')[0],
            full_name: profile.name || '', phone: '', country: 'Cairo',
            avatar_url: profile.picture || ''
        };
        localStorage.setItem('active_user_session', JSON.stringify(activeProfile));
        localStorage.setItem('user_profile_' + profile.sub, JSON.stringify(activeProfile));
        localStorage.setItem('google_auth_user', JSON.stringify({ user: activeProfile, access_token: idToken }));
        localStorage.setItem('signup_banner_dismissed', 'true');

        if (supabaseClient && supabaseClient.auth.signInWithIdToken) {
            supabaseClient.auth.signInWithIdToken({ provider: 'google', token: idToken }).catch(function(e) {
                console.warn('Supabase Google ID token:', e.message);
            });
        }

        showAlert('success', 'Welcome, ' + profile.name + '! Redirecting...');
        isRedirecting = true;
        setTimeout(function () { window.location.replace('index.html'); }, 1000);
    }

    function initGoogleGIS() {
        if (window.google && window.google.accounts && window.google.accounts.id) {
            try {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleGoogleCredentialResponse,
                    auto_select: false,
                    cancel_on_tap_outside: true
                });
                console.log('Google GIS initialized');
            } catch(e) { console.warn('GIS init:', e.message); }
        }
    }

    window.addEventListener('load', initGoogleGIS);

    async function handleGoogleLogin() {
        var googleBtn = document.getElementById('google-btn');
        if (googleBtn) googleBtn.disabled = true;
        try {
            if (window.google && window.google.accounts && window.google.accounts.id) {
                initGoogleGIS();
                window.google.accounts.id.prompt(function (notification) {
                    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                        triggerGoogleOAuthPopup();
                    }
                    if (googleBtn) googleBtn.disabled = false;
                });
            } else {
                await triggerGoogleOAuthPopup();
                if (googleBtn) googleBtn.disabled = false;
            }
        } catch(e) {
            showAlert('error', getErrorMessage(e));
            if (googleBtn) googleBtn.disabled = false;
        }
    }

    async function triggerGoogleOAuthPopup() {
        if (window.google && window.google.accounts && window.google.accounts.oauth2) {
            var client = window.google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: 'email profile openid',
                callback: async function (tokenResponse) {
                    if (tokenResponse.error) { showAlert('error', 'Google sign-in failed: ' + tokenResponse.error); return; }
                    try {
                        var resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                            headers: { Authorization: 'Bearer ' + tokenResponse.access_token }
                        });
                        var profile = await resp.json();
                        var ap = {
                            id: profile.sub, email: profile.email,
                            username: profile.name || profile.email.split('@')[0],
                            full_name: profile.name || '', phone: '', country: 'Cairo',
                            avatar_url: profile.picture || ''
                        };
                        localStorage.setItem('active_user_session', JSON.stringify(ap));
                        localStorage.setItem('google_auth_user', JSON.stringify({ user: ap, access_token: tokenResponse.access_token }));
                        localStorage.setItem('signup_banner_dismissed', 'true');
                        showAlert('success', 'Welcome, ' + profile.name + '! Redirecting...');
                        isRedirecting = true;
                        setTimeout(function () { window.location.replace('index.html'); }, 1000);
                    } catch(e) { showAlert('error', 'Failed to get user info: ' + e.message); }
                }
            });
            client.requestAccessToken();
        } else {
            showAlert('error', 'Google sign-in not available. Please refresh and try again.');
        }
    }

    // ==================== BIND EVENTS ====================
    if (loginForm)    loginForm.addEventListener('submit', handleLogin);
    if (signupForm)   signupForm.addEventListener('submit', handleSignup);

    if (toggleFormBtn) {
        toggleFormBtn.addEventListener('click', function (e) {
            e.preventDefault();
            setAuthMode(isSignupMode ? 'signin' : 'signup');
        });
    }

    var googleBtn = document.getElementById('google-btn');
    if (googleBtn) googleBtn.addEventListener('click', handleGoogleLogin);

    console.log('Auth page ready - all buttons active');
});
