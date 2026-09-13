// ==================== SUPABASE INDEX AUTH ====================

(function () {
    'use strict';

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
                detectSessionInUrl: true   // MUST be true to catch token from URL hash
            }
        });
    }

    // ==================== UI HELPERS ====================
    window.toggleUserMenu = function () {
        var dropdown = document.getElementById('user-dropdown');
        if (dropdown) dropdown.classList.toggle('show');
    };

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.user-btn')) {
            var dropdown = document.getElementById('user-dropdown');
            if (dropdown && dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    });

    window.handleLogout = async function () {
        try { if (supabaseClient) await supabaseClient.auth.signOut(); } catch (e) {}
        localStorage.removeItem('google_auth_user');
        localStorage.removeItem('project_auth_token');
        localStorage.removeItem('active_user_session');
        localStorage.removeItem('saved_user_email');
        localStorage.removeItem('saved_user_name');
        localStorage.removeItem('saved_user_phone');
        localStorage.removeItem('saved_user_gov');
        window.location.href = 'login.html';
    };

    // ==================== RENDER FUNCTIONS ====================
    function renderUserMenu(profile, container) {
        var template = document.getElementById('user-menu-template');
        if (!template || !container) return;

        var clone = template.content.cloneNode(true);

        var displayName = profile.username || profile.full_name || (profile.email ? profile.email.split('@')[0] : 'User');
        var avatarUrl   = profile.avatar_url ||
                          localStorage.getItem('user_avatar_' + profile.id) ||
                          localStorage.getItem('user_avatar_global') ||
                          ('https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName) + '&background=6366f1&color=fff');

        var nameEl   = clone.querySelector('.nav-user-name');
        var avatarEl = clone.querySelector('.nav-user-avatar');

        if (nameEl)   nameEl.textContent = displayName;
        if (avatarEl) avatarEl.src = avatarUrl;

        container.innerHTML = '';
        container.appendChild(clone);
    }

    function renderLoginButton(container) {
        if (!container) return;
        container.innerHTML = '<a href="login.html?mode=signup" class="auth-button create-account-btn" id="auth-button">' +
            '<svg class="auth-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
            '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<circle cx="9" cy="7" r="4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<line x1="19" y1="8" x2="19" y2="14" stroke-width="2" stroke-linecap="round"/>' +
            '<line x1="22" y1="11" x2="16" y2="11" stroke-width="2" stroke-linecap="round"/>' +
            '</svg>' +
            '<span class="auth-text">Create Account</span>' +
            '</a>';
    }

    function toggleCommentForm(isLoggedIn) {
        var authMsg = document.getElementById('comment-auth-message');
        var form    = document.getElementById('comment-form');
        if (isLoggedIn) {
            if (authMsg) authMsg.classList.add('hidden');
            if (form)    form.classList.remove('hidden');
        } else {
            if (authMsg) authMsg.classList.remove('hidden');
            if (form)    form.classList.add('hidden');
        }
    }

    function showSignupBanner() {
        if (localStorage.getItem('signup_banner_dismissed')) return;
        var banner = document.getElementById('signup-banner');
        if (!banner) return;
        setTimeout(function () {
            banner.classList.remove('hidden');
            banner.classList.add('show');
        }, 2500);
    }

    window.dismissSignupBanner = function () {
        var banner = document.getElementById('signup-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(function () { banner.classList.add('hidden'); }, 400);
        }
        localStorage.setItem('signup_banner_dismissed', 'true');
    };

    // ==================== PROFILE RESOLUTION ====================
    // Gets user profile from all possible sources: Supabase session, localStorage
    function resolveProfileFromStorage() {
        var profile = { id: null, email: '', username: '', full_name: '', phone: '', country: 'Luxor', avatar_url: '' };

        // 1. active_user_session (most recent)
        try {
            var s = localStorage.getItem('active_user_session');
            if (s) {
                var p = JSON.parse(s);
                if (p && (p.email || p.username)) Object.assign(profile, p);
            }
        } catch(e) {}

        // 2. google_auth_user
        if (!profile.email) {
            try {
                var g = localStorage.getItem('google_auth_user');
                if (g) {
                    var gParsed = JSON.parse(g);
                    var u = gParsed.user || gParsed;
                    if (u && u.email) {
                        profile.id         = u.id || profile.id;
                        profile.email      = u.email;
                        var m              = u.user_metadata || {};
                        profile.username   = m.full_name || u.email.split('@')[0];
                        profile.full_name  = m.full_name || '';
                        profile.avatar_url = m.avatar_url || '';
                    }
                }
            } catch(e) {}
        }

        // 3. saved_user keys
        var sEmail   = localStorage.getItem('saved_user_email');
        var sName    = localStorage.getItem('saved_user_name');
        var sPhone   = localStorage.getItem('saved_user_phone');
        var sGov     = localStorage.getItem('saved_user_gov');
        if (sEmail && !profile.email)    profile.email    = sEmail;
        if (sName  && !profile.username) profile.username = sName;
        if (sPhone && !profile.phone)    profile.phone    = sPhone;
        if (sGov   && !profile.country)  profile.country  = sGov;

        return profile;
    }

    // ==================== MAIN AUTH CHECK ====================
    var currentSession = null;

    async function checkAuthState() {
        var authContainer = document.getElementById('auth-container');

        // ---- STEP 1: Handle URL hash token (after login redirect) ----
        var hash = window.location.hash;
        if (hash && hash.indexOf('access_token') !== -1) {
            try {
                var hashParams   = new URLSearchParams(hash.substring(1));
                var accessToken  = hashParams.get('access_token');
                var refreshToken = hashParams.get('refresh_token');
                if (accessToken && refreshToken && supabaseClient) {
                    await supabaseClient.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken
                    });
                }
                // Clean URL
                window.history.replaceState(null, '', 'index.html');
            } catch(e) {
                console.warn('URL token error:', e.message);
            }
        }

        // ---- STEP 2: Try Supabase session ----
        var session = null;
        if (supabaseClient) {
            try {
                var result = await supabaseClient.auth.getSession();
                session = result.data && result.data.session ? result.data.session : null;
            } catch(e) {
                console.warn('getSession error:', e.message);
            }
        }

        // ---- STEP 3: If Supabase session found ----
        if (session && session.user) {
            currentSession = session;
            var u     = session.user;
            var uMeta = u.user_metadata || {};

            var profile = {
                id:         u.id,
                email:      u.email,
                username:   uMeta.username || u.email.split('@')[0],
                full_name:  uMeta.full_name || uMeta.username || '',
                phone:      uMeta.phone || '',
                country:    uMeta.country || 'Luxor',
                avatar_url: uMeta.avatar_url || ''
            };

            // Merge with localStorage (for custom avatar etc)
            var stored = resolveProfileFromStorage();
            if (!profile.avatar_url && stored.avatar_url) profile.avatar_url = stored.avatar_url;

            // Try fetch from DB
            try {
                var dbResult = await supabaseClient
                    .from('user_profiles')
                    .select('username, full_name, avatar_url, phone, country')
                    .eq('id', u.id)
                    .single();
                if (dbResult.data) {
                    var db = dbResult.data;
                    if (db.username)   profile.username   = db.username;
                    if (db.full_name)  profile.full_name  = db.full_name;
                    if (db.avatar_url) profile.avatar_url = db.avatar_url;
                    if (db.phone)      profile.phone      = db.phone;
                    if (db.country)    profile.country    = db.country;
                }
            } catch(e) { /* DB not required */ }

            // Save fresh profile
            localStorage.setItem('active_user_session', JSON.stringify(profile));

            renderUserMenu(profile, authContainer);
            toggleCommentForm(true);
            fetchComments();
            initEvents();
            return;
        }

        // ---- STEP 4: No Supabase session - try localStorage (Google / recent signup) ----
        var localProfile = resolveProfileFromStorage();

        if (localProfile.email || localProfile.username) {
            // User has local data - show their profile
            currentSession = {
                user: {
                    id: localProfile.id || 'local_user',
                    email: localProfile.email,
                    user_metadata: {
                        username:   localProfile.username,
                        full_name:  localProfile.full_name,
                        avatar_url: localProfile.avatar_url
                    }
                }
            };

            renderUserMenu(localProfile, authContainer);
            toggleCommentForm(true);
            fetchComments();
            initEvents();
            return;
        }

        // ---- STEP 5: No session at all ----
        renderLoginButton(authContainer);
        toggleCommentForm(false);
        showSignupBanner();
        fetchComments();
        initEvents();
    }

    // ==================== COMMENTS ====================
    function escapeHTML(str) {
        return String(str).replace(/[&<>'"]/g, function(tag) {
            return ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":"&#39;",'"':'&quot;' }[tag] || tag);
        });
    }

    async function fetchComments() {
        var commentsList = document.getElementById('comments-list');
        if (!commentsList || !supabaseClient) return;

        try {
            var result = await supabaseClient
                .from('comments')
                .select('*')
                .order('created_at', { ascending: false });

            var comments = result.data;
            var error    = result.error;
            if (error) throw error;

            if (!comments || comments.length === 0) {
                commentsList.innerHTML = '<div style="text-align:center;color:var(--color-text-secondary);padding:20px;">No comments yet. Be the first to leave one!</div>';
                return;
            }

            commentsList.innerHTML = '';
            comments.forEach(function (comment) {
                var displayName   = comment.username || 'Anonymous';
                var avatarUrl     = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName) + '&background=6366f1&color=fff';
                var formattedDate = new Date(comment.created_at).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                });

                var card = document.createElement('div');
                card.className = 'comment-card';
                card.innerHTML =
                    '<img src="' + avatarUrl + '" alt="' + displayName + '" class="comment-avatar">' +
                    '<div class="comment-content">' +
                    '<div class="comment-header">' +
                    '<span class="comment-author">' + escapeHTML(displayName) + '</span>' +
                    '<span class="comment-date">' + formattedDate + '</span>' +
                    '</div>' +
                    '<p class="comment-text">' + escapeHTML(comment.comment_text) + '</p>' +
                    '</div>';
                commentsList.appendChild(card);
            });
        } catch(err) {
            console.error('Fetch comments error:', err);
            commentsList.innerHTML = '<div style="text-align:center;color:#ff6b6b;padding:20px;">Failed to load comments.</div>';
        }
    }

    // ==================== EVENTS ====================
    var eventsInitialized = false;
    function initEvents() {
        if (eventsInitialized) return;
        eventsInitialized = true;

        // Contact Modal
        var modal        = document.getElementById('contact-modal');
        var startChatBtn = document.getElementById('start-chat-btn');
        var closeModalBtn= document.getElementById('close-modal-btn');
        var contactForm  = document.getElementById('contact-modal-form');

        if (startChatBtn && modal)  startChatBtn.addEventListener('click',  function() { modal.classList.add('show'); });
        if (closeModalBtn && modal) closeModalBtn.addEventListener('click', function() { modal.classList.remove('show'); });
        if (modal) modal.addEventListener('click', function(e) { if (e.target === modal) modal.classList.remove('show'); });

        if (contactForm) {
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                var name  = document.getElementById('modal-name')  ? document.getElementById('modal-name').value.trim()  : '';
                var phone = document.getElementById('modal-phone') ? document.getElementById('modal-phone').value.trim() : '';
                var emailEl = document.getElementById('modal-email');
                var email = emailEl ? emailEl.value.trim() : '';
                var idea  = document.getElementById('modal-idea')  ? document.getElementById('modal-idea').value.trim()  : '';

                if (!name || !idea) { alert('Please fill in all required fields.'); return; }

                var submitBtn = document.getElementById('modal-submit-btn');
                var btnText   = submitBtn ? submitBtn.querySelector('span') : null;
                var origText  = btnText ? btnText.textContent : 'Send Message';
                if (submitBtn) submitBtn.disabled = true;
                if (btnText)   btnText.textContent = 'Sending...';

                try {
                    var response = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify({
                            access_key: '7fec361c-f8d1-4a40-afef-510df8701b30',
                            name: name, phone: phone,
                            email: email || 'assioutytech@gmail.com',
                            message: idea,
                            from_name: 'Abdelrahman Portfolio Contact',
                            subject: 'New Project Inquiry from ' + name + ' (' + phone + ')'
                        })
                    });
                    var result = await response.json();
                    if (supabaseClient) {
                        try { await supabaseClient.from('contact_messages').insert([{ name: name, phone: phone, project_idea: idea, recipient_email: 'assioutytech@gmail.com' }]); }
                        catch(sbErr) {}
                    }
                    if (result.success || response.ok) {
                        alert('Message sent successfully! Thank you. ');
                        contactForm.reset();
                        if (modal) modal.classList.remove('show');
                    } else {
                        throw new Error(result.message || 'Submission error');
                    }
                } catch(err) {
                    alert('Failed to send message: ' + err.message);
                } finally {
                    if (submitBtn) submitBtn.disabled = false;
                    if (btnText)   btnText.textContent = origText;
                }
            });
        }

        // Comment Form
        var commentForm = document.getElementById('comment-form');
        if (commentForm) {
            commentForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                if (!currentSession) { alert('Please login to comment.'); return; }

                var commentInput = document.getElementById('comment-text-input');
                var commentText  = commentInput ? commentInput.value.trim() : '';
                if (!commentText) return;

                var submitBtn = document.getElementById('submit-comment-btn');
                if (submitBtn) submitBtn.disabled = true;

                try {
                    var u           = currentSession.user;
                    var uMeta       = u.user_metadata || {};
                    var displayName = uMeta.full_name || uMeta.username || u.email.split('@')[0];

                    if (!supabaseClient) throw new Error('Not connected');

                    var insertResult = await supabaseClient.from('comments').insert([{
                        user_id: u.id,
                        username: displayName,
                        comment_text: commentText
                    }]);
                    if (insertResult.error) throw insertResult.error;

                    if (commentInput) commentInput.value = '';
                    await fetchComments();
                } catch(err) {
                    console.error('Comment error:', err);
                    alert('Failed to post comment: ' + err.message);
                } finally {
                    if (submitBtn) submitBtn.disabled = false;
                }
            });
        }
    }

    // ==================== START ====================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAuthState);
    } else {
        checkAuthState();
    }

})();
