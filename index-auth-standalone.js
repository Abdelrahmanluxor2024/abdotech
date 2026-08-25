// ==================== SUPABASE INDEX AUTH - ROBUST DEBUGGING ====================
(function () {
    'use strict';

    // 1. Config
    const SUPABASE_URL = 'https://bebudhdiylpxrmddrhyp.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlYnVkaGRpeWxweHJtZGRyaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODI4NTksImV4cCI6MjA5ODA1ODg1OX0.LB6-Tg7QdOertHK3eEue966iblIgVzO7982-WAg2bVM';

    // Initialize Supabase
    const { createClient } = supabase;
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            persistSession: true,
            storageKey: 'project_auth_token', // FIXED: Matching login page key
            storage: window.localStorage,
            autoRefreshToken: false,
            detectSessionInUrl: false
        }
    });

    // 2. UI Helpers
    window.toggleUserMenu = function () {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) dropdown.classList.toggle('show');
    }

    window.onclick = function (event) {
        if (!event.target.matches('.user-btn') && !event.target.closest('.user-btn')) {
            const dropdown = document.getElementById('user-dropdown');
            if (dropdown && dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    }

    window.handleLogout = async function () {
        try {
            await supabaseClient.auth.signOut();
        } catch (e) {
            console.warn('Supabase signout:', e);
        }
        localStorage.removeItem('google_auth_user');
        localStorage.removeItem('project_auth_token');
        window.location.href = 'login.html';
    }

    function showDebug(msg, type = 'info') {
        console.log(`[AUTH DEBUG]: ${msg}`);
        // Uncomment next line to see debug bubble on screen if needed
        // const d = document.getElementById('debug-overlay') || document.createElement('div');
        // d.id = 'debug-overlay';
        // d.style.cssText = 'position:fixed;bottom:10px;right:10px;background:white;color:black;padding:10px;border:1px solid red;z-index:9999;max-width:300px;font-size:10px;';
        // d.innerHTML += `<div>${msg}</div>`;
        // document.body.appendChild(d);
    }

    // 3. Main Auth Logic
    async function checkAuthState() {
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', checkAuthState);
            return;
        }

        const authContainer = document.getElementById('auth-container');
        if (!authContainer) {
            console.error('Auth container not found!');
            return;
        }

        // STEP 1: Check URL Hash for incoming Token (Login Redirect)
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
            showDebug('Found token in URL, attempting to restore session...');
            try {
                // Manual parse because URLSearchParams can be tricky with hashes
                const hashParams = new URLSearchParams(hash.substring(1)); // remove #
                const accessToken = hashParams.get('access_token');
                const refreshToken = hashParams.get('refresh_token');

                if (accessToken && refreshToken) {
                    const { data, error } = await supabaseClient.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken
                    });

                    if (error) {
                        showDebug('Failed to set session: ' + error.message, 'error');
                    } else {
                        showDebug('Session restored successfully from URL');
                        // Clear hash to look clean, but keep session
                        window.history.replaceState(null, '', 'index.html');
                    }
                }
            } catch (e) {
                showDebug('Error processing URL token: ' + e.message, 'error');
            }
        }

        // STEP 2: Get Current Session
        try {
            let { data: { session }, error } = await supabaseClient.auth.getSession();

            if (!session) {
                const storedGoogle = localStorage.getItem('google_auth_user');
                if (storedGoogle) {
                    try {
                        const parsed = JSON.parse(storedGoogle);
                        if (parsed && parsed.user) {
                            session = parsed;
                        }
                    } catch (e) {
                        console.warn('Failed to parse google user', e);
                    }
                }
            }

            if (session) {
                showDebug('User is logged in: ' + (session.user.email || 'Google User'));
                currentSession = session;
                renderUserMenu(session, authContainer);
                toggleCommentForm(true);
            } else {
                showDebug('No active session found.');
                renderLoginButton(authContainer);
                toggleCommentForm(false);
                // Show signup suggestion banner for non-logged-in users
                showSignupBanner();
            }
            // Fetch comments anyway (they are public to view)
            fetchComments();
            // Initialize modal and comments form events
            initEvents();
        } catch (error) {
            showDebug('Critical Auth Error: ' + error.message, 'error');
            renderLoginButton(authContainer);
            toggleCommentForm(false);
            fetchComments();
            initEvents();
        }
    }

    let currentSession = null;

    function toggleCommentForm(isLoggedIn) {
        const authMsg = document.getElementById('comment-auth-message');
        const form = document.getElementById('comment-form');
        if (isLoggedIn) {
            if (authMsg) authMsg.classList.add('hidden');
            if (form) form.classList.remove('hidden');
        } else {
            if (authMsg) authMsg.classList.remove('hidden');
            if (form) form.classList.add('hidden');
        }
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    async function fetchComments() {
        const commentsList = document.getElementById('comments-list');
        if (!commentsList) return;

        try {
            const { data: comments, error } = await supabaseClient
                .from('comments')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (!comments || comments.length === 0) {
                commentsList.innerHTML = `<div style="text-align: center; color: var(--color-text-secondary); padding: 20px;">No comments yet. Be the first to leave one!</div>`;
                return;
            }

            commentsList.innerHTML = '';
            comments.forEach(comment => {
                const displayName = comment.username || 'Anonymous';
                const avatarUrl = `https://ui-avatars.com/api/?name=${displayName}&background=6366f1&color=fff`;
                const formattedDate = new Date(comment.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const commentCard = document.createElement('div');
                commentCard.className = 'comment-card';
                commentCard.innerHTML = `
                    <img src="${avatarUrl}" alt="${displayName}" class="comment-avatar">
                    <div class="comment-content">
                        <div class="comment-header">
                            <span class="comment-author">${displayName}</span>
                            <span class="comment-date">${formattedDate}</span>
                        </div>
                        <p class="comment-text">${escapeHTML(comment.comment_text)}</p>
                    </div>
                `;
                commentsList.appendChild(commentCard);
            });
        } catch (err) {
            console.error('Error fetching comments:', err);
            commentsList.innerHTML = `<div style="text-align: center; color: #ff6b6b; padding: 20px;">Failed to load comments.</div>`;
        }
    }

    let eventsInitialized = false;
    function initEvents() {
        if (eventsInitialized) return;
        eventsInitialized = true;

        // Modal triggers
        const modal = document.getElementById('contact-modal');
        const startChatBtn = document.getElementById('start-chat-btn');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const contactForm = document.getElementById('contact-modal-form');

        if (startChatBtn && modal) {
            startChatBtn.addEventListener('click', () => {
                modal.classList.add('show');
            });
        }

        if (closeModalBtn && modal) {
            closeModalBtn.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        }

        // Contact Modal Form Submission with Web3Forms
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const name = document.getElementById('modal-name').value.trim();
                const phone = document.getElementById('modal-phone').value.trim();
                const emailInput = document.getElementById('modal-email');
                const email = emailInput ? emailInput.value.trim() : '';
                const idea = document.getElementById('modal-idea').value.trim();

                if (!name || !idea) {
                    alert('Please fill in all required fields.');
                    return;
                }

                const submitBtn = document.getElementById('modal-submit-btn');
                submitBtn.disabled = true;
                const btnText = submitBtn.querySelector('span');
                const originalText = btnText ? btnText.textContent : 'Send Message';
                if (btnText) btnText.textContent = 'Sending...';

                try {
                    // Send to Web3Forms
                    const response = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            access_key: '7fec361c-f8d1-4a40-afef-510df8701b30',
                            name: name,
                            phone: phone,
                            email: email || 'assioutytech@gmail.com',
                            message: idea,
                            from_name: 'Abdelrahman Portfolio Contact',
                            subject: `New Project Inquiry from ${name} (${phone})`
                        })
                    });

                    const result = await response.json();

                    // Optional backup to Supabase
                    try {
                        await supabaseClient
                            .from('contact_messages')
                            .insert([
                                {
                                    name,
                                    phone,
                                    project_idea: idea,
                                    recipient_email: 'assioutytech@gmail.com'
                                }
                            ]);
                    } catch (sbErr) {
                        console.warn('Supabase backup note:', sbErr.message);
                    }

                    if (result.success || response.ok) {
                        alert('Message sent successfully via Web3Forms! Thank you. ✅');
                        contactForm.reset();
                        modal.classList.remove('show');
                    } else {
                        throw new Error(result.message || 'Submission error');
                    }
                } catch (err) {
                    console.error('Error sending message:', err);
                    alert('Failed to send message: ' + err.message);
                } finally {
                    submitBtn.disabled = false;
                    if (btnText) btnText.textContent = originalText;
                }
            });
        }

        // Comment Form Submission
        const commentForm = document.getElementById('comment-form');
        if (commentForm) {
            commentForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (!currentSession) {
                    alert('Please login to comment.');
                    return;
                }

                const commentInput = document.getElementById('comment-text-input');
                const commentText = commentInput.value.trim();
                if (!commentText) return;

                const submitBtn = document.getElementById('submit-comment-btn');
                submitBtn.disabled = true;

                try {
                    const displayName = currentSession.user.user_metadata.full_name || 
                                       currentSession.user.user_metadata.username || 
                                       currentSession.user.email.split('@')[0];

                    const { error } = await supabaseClient
                        .from('comments')
                        .insert([
                            {
                                user_id: currentSession.user.id,
                                username: displayName,
                                comment_text: commentText
                            }
                        ]);

                    if (error) throw error;

                    commentInput.value = '';
                    await fetchComments();
                } catch (err) {
                    console.error('Error posting comment:', err);
                    alert('Failed to post comment: ' + err.message);
                } finally {
                    submitBtn.disabled = false;
                }
            });
        }
    }

    async function renderUserMenu(session, container) {
        const template = document.getElementById('user-menu-template');
        if (!template) return;

        const clone = template.content.cloneNode(true);

        let displayName = session.user.user_metadata.full_name ||
            session.user.user_metadata.username ||
            session.user.email.split('@')[0];

        const localAvatar = localStorage.getItem('user_avatar_' + session.user.id);

        let avatarUrl = localAvatar || session.user.user_metadata.avatar_url ||
            `https://ui-avatars.com/api/?name=${displayName}&background=6366f1&color=fff`;

        // Try to fetch profile from DB for latest info
        try {
            const { data: profile } = await supabaseClient
                .from('user_profiles')
                .select('username, full_name, avatar_url')
                .eq('id', session.user.id)
                .single();

            if (profile) {
                displayName = profile.full_name || profile.username || displayName;
                if (!localAvatar && profile.avatar_url) avatarUrl = profile.avatar_url;
            }
        } catch (e) {
            // ignore
        }

        const nameEl = clone.querySelector('.nav-user-name');
        const avatarEl = clone.querySelector('.nav-user-avatar');

        if (nameEl) nameEl.textContent = displayName;
        if (avatarEl) avatarEl.src = avatarUrl;

        container.innerHTML = '';
        container.appendChild(clone);
    }

    function renderLoginButton(container) {
        container.innerHTML = `
            <a href="login.html?mode=signup" class="auth-button create-account-btn" id="auth-button">
                <svg class="auth-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="19" y1="8" x2="19" y2="14" stroke-width="2" stroke-linecap="round"/>
                    <line x1="22" y1="11" x2="16" y2="11" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span class="auth-text">Create Account</span>
            </a>
        `;
    }

    function showSignupBanner() {
        // Don't show if user dismissed it or has an account
        const dismissed = localStorage.getItem('signup_banner_dismissed');
        if (dismissed) return;

        const banner = document.getElementById('signup-banner');
        if (!banner) return;

        // Show with a slight delay for better UX
        setTimeout(() => {
            banner.classList.remove('hidden');
            banner.classList.add('show');
        }, 2500);
    }

    window.dismissSignupBanner = function () {
        const banner = document.getElementById('signup-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => banner.classList.add('hidden'), 400);
        }
        localStorage.setItem('signup_banner_dismissed', 'true');
    };

    // Start
    checkAuthState();

})();
