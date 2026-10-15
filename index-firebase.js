// ==================== FIREBASE INDEX AUTH & INTERACTIONS ====================

(function () {
    'use strict';

    if (typeof firebase === 'undefined' || !firebase.apps.length) {
        console.warn('Firebase not yet ready, waiting...');
    }

    var auth = firebase.auth();
    var db   = firebase.firestore();

    var currentFirebaseUser = null;
    var currentProfile = null;

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
        try {
            await auth.signOut();
        } catch (e) {
            console.warn('Sign out notice:', e);
        }
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
                          localStorage.getItem('user_avatar_' + (profile.uid || profile.id)) ||
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
        container.innerHTML = '<a href="login.html" class="auth-button create-account-btn" id="auth-button">' +
            '<svg class="auth-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
            '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<circle cx="9" cy="7" r="4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg>' +
            '<span class="auth-text">Sign In</span>' +
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

    function escapeHTML(str) {
        if (!str) return '';
        return String(str).replace(/[&<>'"]/g, function (tag) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag;
        });
    }

    // ==================== COMMENTS SYSTEM (FIRESTORE) ====================
    async function fetchComments() {
        var commentsList = document.getElementById('comments-list');
        if (!commentsList) return;

        try {
            var snapshot = await db.collection('comments')
                .orderBy('created_at', 'desc')
                .limit(50)
                .get();

            if (snapshot.empty) {
                commentsList.innerHTML = '<div style="text-align: center; color: var(--color-text-secondary); padding: 25px;">No comments yet. Be the first to leave one! ✨</div>';
                return;
            }

            commentsList.innerHTML = '';
            snapshot.forEach(function (doc) {
                var comment = doc.data();
                var displayName = comment.username || 'Anonymous';
                var avatarUrl   = comment.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff`;
                
                var dateStr = 'Recently';
                if (comment.created_at && comment.created_at.toDate) {
                    dateStr = comment.created_at.toDate().toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                }

                var replyHtml = '';
                if (comment.admin_reply) {
                    replyHtml = 
                        '<div class="admin-reply-box" style="margin-top: 12px; padding: 12px 16px; background: rgba(102, 126, 234, 0.12); border-left: 3px solid #667eea; border-radius: 8px;">' +
                            '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">' +
                                '<span style="font-weight: 700; font-size: 0.85rem; color: #667eea; background: rgba(102, 126, 234, 0.2); padding: 2px 8px; border-radius: 4px;">Admin Reply 🛡️</span>' +
                            '</div>' +
                            '<p style="font-size: 0.92rem; color: #e2e8f0; margin: 0; line-height: 1.5;">' + escapeHTML(comment.admin_reply) + '</p>' +
                        '</div>';
                }

                var card = document.createElement('div');
                card.className = 'comment-card';
                card.innerHTML = 
                    '<img src="' + avatarUrl + '" alt="' + escapeHTML(displayName) + '" class="comment-avatar">' +
                    '<div class="comment-content">' +
                        '<div class="comment-header">' +
                            '<span class="comment-author">' + escapeHTML(displayName) + '</span>' +
                            '<span class="comment-date">' + dateStr + '</span>' +
                        '</div>' +
                        '<p class="comment-text">' + escapeHTML(comment.comment_text) + '</p>' +
                        replyHtml +
                    '</div>';
                commentsList.appendChild(card);
            });

        } catch (err) {
            console.error('Error fetching comments:', err);
            // If offline or index is building
            commentsList.innerHTML = '<div style="text-align: center; color: var(--color-text-secondary); padding: 20px;">Welcome to my portfolio! Leave a comment above. 💬</div>';
        }
    }

    // ==================== AUTH OBSERVER ====================
    function initAuth() {
        var authContainer = document.getElementById('auth-container');

        // Check local cache first for instant render
        try {
            var cached = localStorage.getItem('active_user_session');
            if (cached) {
                currentProfile = JSON.parse(cached);
                if (authContainer) renderUserMenu(currentProfile, authContainer);
                toggleCommentForm(true);
            } else {
                if (authContainer) renderLoginButton(authContainer);
                toggleCommentForm(false);
            }
        } catch (e) {}

        // Listen for live Firebase Auth state changes
        auth.onAuthStateChanged(async function (user) {
            if (user) {
                currentFirebaseUser = user;
                var profile = {
                    id: user.uid,
                    uid: user.uid,
                    email: user.email,
                    username: user.displayName || user.email.split('@')[0],
                    full_name: user.displayName || '',
                    avatar_url: user.photoURL
                };

                // Try to get latest firestore profile
                try {
                    var doc = await db.collection('users').doc(user.uid).get();
                    if (doc.exists) {
                        profile = Object.assign({}, profile, doc.data());
                    }
                } catch (e) {
                    console.warn('Profile fetch notice:', e);
                }

                currentProfile = profile;
                localStorage.setItem('active_user_session', JSON.stringify(profile));

                if (authContainer) renderUserMenu(profile, authContainer);
                toggleCommentForm(true);
            } else {
                currentFirebaseUser = null;
                currentProfile = null;
                localStorage.removeItem('active_user_session');

                if (authContainer) renderLoginButton(authContainer);
                toggleCommentForm(false);
            }
        });

        fetchComments();
        initModalAndForms();
    }

    // ==================== EVENT HANDLERS ====================
    var eventsInitialized = false;
    function initModalAndForms() {
        if (eventsInitialized) return;
        eventsInitialized = true;

        var modal        = document.getElementById('contact-modal');
        var startChatBtn = document.getElementById('start-chat-btn');
        var closeModalBtn= document.getElementById('close-modal-btn');
        var contactForm  = document.getElementById('contact-modal-form');

        if (startChatBtn && modal) {
            startChatBtn.addEventListener('click', function () {
                modal.classList.add('show');
            });
        }

        if (closeModalBtn && modal) {
            closeModalBtn.addEventListener('click', function () {
                modal.classList.remove('show');
            });
        }

        if (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === modal) modal.classList.remove('show');
            });
        }

        // Contact Modal Form (Saves to Firestore collection 'contact_messages' + Web3Forms email)
        if (contactForm) {
            contactForm.addEventListener('submit', async function (e) {
                e.preventDefault();

                var nameEl  = document.getElementById('modal-name');
                var phoneEl = document.getElementById('modal-phone');
                var emailEl = document.getElementById('modal-email');
                var ideaEl  = document.getElementById('modal-idea');

                var name  = nameEl  ? nameEl.value.trim()  : '';
                var phone = phoneEl ? phoneEl.value.trim() : '';
                var email = emailEl ? emailEl.value.trim() : '';
                var idea  = ideaEl  ? ideaEl.value.trim()  : '';

                if (!name || !idea) {
                    alert('Please fill in your name and message.');
                    return;
                }

                var submitBtn = document.getElementById('modal-submit-btn');
                var btnSpan   = submitBtn ? submitBtn.querySelector('span') : null;
                var origText  = btnSpan ? btnSpan.textContent : 'Send Message';

                if (submitBtn) submitBtn.disabled = true;
                if (btnSpan)   btnSpan.textContent = 'Sending...';

                try {
                    // 1. Save directly into Firestore
                    await db.collection('contact_messages').add({
                        name: name,
                        phone: phone,
                        email: email,
                        project_idea: idea,
                        recipient_email: 'assioutytech@gmail.com',
                        created_at: firebase.firestore.FieldValue.serverTimestamp()
                    });

                    // 2. Also send notification email via Web3Forms if online
                    try {
                        await fetch('https://api.web3forms.com/submit', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                            body: JSON.stringify({
                                access_key: '7fec361c-f8d1-4a40-afef-510df8701b30',
                                name: name,
                                phone: phone,
                                email: email || 'assioutytech@gmail.com',
                                message: idea,
                                from_name: 'Abdelrahman Portfolio Contact',
                                subject: 'New Project Inquiry from ' + name + ' (' + phone + ')'
                            })
                        });
                    } catch (e) {}

                    alert('Message sent successfully! Thank you. ✅');
                    contactForm.reset();
                    if (modal) modal.classList.remove('show');

                } catch (err) {
                    console.error('Contact message error:', err);
                    alert('Failed to send message: ' + (err.message || err));
                } finally {
                    if (submitBtn) submitBtn.disabled = false;
                    if (btnSpan)   btnSpan.textContent = origText;
                }
            });
        }

        // Comment Form (Saves to Firestore collection 'comments')
        var commentForm = document.getElementById('comment-form');
        if (commentForm) {
            commentForm.addEventListener('submit', async function (e) {
                e.preventDefault();

                if (!auth.currentUser && !currentProfile) {
                    alert('Please login to leave a comment.');
                    window.location.href = 'login.html';
                    return;
                }

                var commentInput = document.getElementById('comment-text-input');
                var commentText  = commentInput ? commentInput.value.trim() : '';
                if (!commentText) return;

                var submitBtn = document.getElementById('submit-comment-btn');
                if (submitBtn) submitBtn.disabled = true;

                try {
                    var user = auth.currentUser;
                    var displayName = (currentProfile && currentProfile.username) || (user && user.displayName) || 'User';
                    var avatarUrl = (currentProfile && currentProfile.avatar_url) || (user && user.photoURL) || '';

                    await db.collection('comments').add({
                        user_id: user ? user.uid : (currentProfile ? currentProfile.id : 'anon'),
                        username: displayName,
                        comment_text: commentText,
                        avatar_url: avatarUrl,
                        created_at: firebase.firestore.FieldValue.serverTimestamp()
                    });

                    if (commentInput) commentInput.value = '';
                    await fetchComments();
                    alert('Your comment was posted! 🎉');

                } catch (err) {
                    console.error('Comment error:', err);
                    alert('Failed to post comment: ' + (err.message || err));
                } finally {
                    if (submitBtn) submitBtn.disabled = false;
                }
            });
        }
    }

    // Start on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuth);
    } else {
        initAuth();
    }

})();
