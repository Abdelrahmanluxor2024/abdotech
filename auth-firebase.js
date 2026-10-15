// ==================== FIREBASE AUTH SCRIPT ====================
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // Wait until firebase is ready
    if (typeof firebase === 'undefined' || !firebase.auth) {
        console.error('Firebase library is not loaded properly.');
        return;
    }

    var auth = firebase.auth();
    var db = firebase.firestore();

    // DOM Elements
    var loginForm      = document.getElementById('login-form');
    var signupForm     = document.getElementById('signup-form');
    var toggleFormBtn  = document.getElementById('toggle-form-btn');
    var toggleText     = document.getElementById('toggle-text');
    var toggleDivText  = document.getElementById('toggle-divider-text');
    var alertContainer = document.getElementById('alert-container');
    var alertMessage   = document.getElementById('alert-message');
    var alertTextEl    = document.querySelector('.alert-text');
    var googleBtn      = document.getElementById('google-btn');

    var isSignupMode  = false;
    var isRedirecting = false;

    // Check URL params for mode
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'signup') {
        toggleForm();
    }

    // Alert functions
    function showAlert(type, message) {
        if (!alertContainer || !alertMessage || !alertTextEl) return;
        alertContainer.classList.remove('hidden');
        alertMessage.className = 'alert ' + type;
        alertTextEl.textContent = message;
        if (type === 'success') {
            setTimeout(function () { closeAlert(); }, 4000);
        }
    }

    function closeAlert() {
        if (alertContainer) alertContainer.classList.add('hidden');
    }
    window.closeAlert = closeAlert;

    // Password visibility toggle
    window.togglePasswordVisibility = function (formType) {
        var id = formType === 'signup' ? 'signup-password' : 'password';
        var el = document.getElementById(id);
        if (el) el.type = (el.type === 'password') ? 'text' : 'password';
    };

    function setBtnLoading(btn, isLoading, defaultText) {
        if (!btn) return;
        var btnText = btn.querySelector('.btn-text');
        var loader  = btn.querySelector('.btn-loader');
        btn.disabled = isLoading;
        if (isLoading) {
            if (btnText) btnText.classList.add('hidden');
            if (loader)  loader.classList.remove('hidden');
        } else {
            if (btnText) {
                btnText.classList.remove('hidden');
                if (defaultText) btnText.textContent = defaultText;
            }
            if (loader) loader.classList.add('hidden');
        }
    }

    function getErrorMessage(error) {
        if (!error || !error.code) return error.message || 'An unexpected error occurred';
        switch (error.code) {
            case 'auth/invalid-email':
                return 'Invalid email address format.';
            case 'auth/user-disabled':
                return 'This account has been disabled.';
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                return 'Incorrect email or password.';
            case 'auth/email-already-in-use':
                return 'This email is already in use. Please sign in instead.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters.';
            case 'auth/too-many-requests':
                return 'Too many attempts. Please try again later.';
            case 'auth/network-request-failed':
                return 'Network connection error. Check your internet.';
            default:
                return error.message;
        }
    }

    // Mode toggle (Login / Signup)
    function toggleForm() {
        isSignupMode = !isSignupMode;
        closeAlert();

        if (isSignupMode) {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
            toggleText.textContent = 'Sign In';
            if (toggleDivText) toggleDivText.textContent = 'Already have an account?';
            document.querySelector('.card-title').textContent = 'Create Account';
            document.querySelector('.card-subtitle').textContent = 'Sign up to join our community';
        } else {
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
            toggleText.textContent = 'Create New Account';
            if (toggleDivText) toggleDivText.textContent = "Don't have an account?";
            document.querySelector('.card-title').textContent = 'Welcome Back';
            document.querySelector('.card-subtitle').textContent = 'Sign in to access your account';
        }
    }

    if (toggleFormBtn) {
        toggleFormBtn.addEventListener('click', toggleForm);
    }

    // Save profile helper to Firestore & LocalStorage
    async function syncUserData(user, extraData) {
        var profileData = {
            id: user.uid,
            uid: user.uid,
            email: user.email,
            username: extraData.username || user.displayName || user.email.split('@')[0],
            full_name: extraData.full_name || extraData.username || user.displayName || user.email.split('@')[0],
            phone: extraData.phone || '',
            country: extraData.country || 'Luxor',
            avatar_url: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(extraData.username || user.email)}&background=6366f1&color=fff`,
            updated_at: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            await db.collection('users').doc(user.uid).set(profileData, { merge: true });
        } catch (e) {
            console.warn('Firestore user doc sync notice:', e);
        }

        // Cache locally for fast UI load
        localStorage.setItem('active_user_session', JSON.stringify(profileData));
        localStorage.setItem('saved_user_email', profileData.email);
        localStorage.setItem('saved_user_name', profileData.username);
        localStorage.setItem('saved_user_phone', profileData.phone);
        localStorage.setItem('saved_user_gov', profileData.country);
        if (profileData.avatar_url) {
            localStorage.setItem('user_avatar_' + user.uid, profileData.avatar_url);
            localStorage.setItem('user_avatar_global', profileData.avatar_url);
        }
        return profileData;
    }

    // ==================== LOGIN HANDLER ====================
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            if (isRedirecting) return;

            var emailEl    = document.getElementById('email');
            var passwordEl = document.getElementById('password');
            var submitBtn  = document.getElementById('login-btn');

            var email    = emailEl ? emailEl.value.trim() : '';
            var password = passwordEl ? passwordEl.value : '';

            if (!email || !password) {
                showAlert('error', 'Please enter both email and password.');
                return;
            }

            setBtnLoading(submitBtn, true);
            closeAlert();

            try {
                var userCredential = await auth.signInWithEmailAndPassword(email, password);
                var user = userCredential.user;

                // Fetch extra info from Firestore if exists
                var extraData = {};
                try {
                    var doc = await db.collection('users').doc(user.uid).get();
                    if (doc.exists) {
                        extraData = doc.data();
                    }
                } catch(err) {}

                await syncUserData(user, extraData);

                showAlert('success', 'Login successful! Redirecting...');
                isRedirecting = true;
                setTimeout(function () {
                    window.location.href = 'index.html';
                }, 800);

            } catch (err) {
                console.error('Login error:', err);
                showAlert('error', getErrorMessage(err));
                setBtnLoading(submitBtn, false, 'Sign In');
            }
        });
    }

    // ==================== SIGNUP HANDLER ====================
    if (signupForm) {
        signupForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            if (isRedirecting) return;

            var usernameEl = document.getElementById('username');
            var countryEl  = document.getElementById('country');
            var phoneEl    = document.getElementById('phone');
            var emailEl    = document.getElementById('signup-email');
            var passwordEl = document.getElementById('signup-password');
            var submitBtn  = document.getElementById('signup-btn');

            var username = usernameEl ? usernameEl.value.trim() : '';
            var country  = countryEl ? countryEl.value : 'Luxor';
            var phone    = phoneEl ? phoneEl.value.trim() : '';
            var email    = emailEl ? emailEl.value.trim() : '';
            var password = passwordEl ? passwordEl.value : '';

            if (!username) {
                showAlert('error', 'Please enter a username.');
                return;
            }
            if (!email || !password) {
                showAlert('error', 'Please fill in email and password.');
                return;
            }
            if (password.length < 6) {
                showAlert('error', 'Password must be at least 6 characters.');
                return;
            }

            setBtnLoading(submitBtn, true);
            closeAlert();

            try {
                var userCredential = await auth.createUserWithEmailAndPassword(email, password);
                var user = userCredential.user;

                // Update displayName on auth profile
                await user.updateProfile({
                    displayName: username,
                    photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=6366f1&color=fff`
                });

                var extraData = {
                    username: username,
                    full_name: username,
                    country: country,
                    phone: phone
                };

                await syncUserData(user, extraData);

                showAlert('success', 'Account created successfully! Redirecting...');
                isRedirecting = true;
                setTimeout(function () {
                    window.location.href = 'index.html';
                }, 1000);

            } catch (err) {
                console.error('Signup error:', err);
                showAlert('error', getErrorMessage(err));
                setBtnLoading(submitBtn, false, 'Create Account');
            }
        });
    }

    // ==================== GOOGLE SIGN-IN ====================
    if (googleBtn) {
        googleBtn.addEventListener('click', async function () {
            closeAlert();
            var provider = new firebase.auth.GoogleAuthProvider();
            try {
                var result = await auth.signInWithPopup(provider);
                var user = result.user;

                var extraData = {
                    username: user.displayName || user.email.split('@')[0],
                    full_name: user.displayName || '',
                    phone: user.phoneNumber || ''
                };

                await syncUserData(user, extraData);

                showAlert('success', 'Signed in with Google! Redirecting...');
                setTimeout(function () {
                    window.location.href = 'index.html';
                }, 800);
            } catch (err) {
                console.warn('Google sign in notice:', err);
                // If popup is blocked or fails, try redirect
                if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
                    auth.signInWithRedirect(provider);
                } else {
                    showAlert('error', getErrorMessage(err));
                }
            }
        });
    }

});
