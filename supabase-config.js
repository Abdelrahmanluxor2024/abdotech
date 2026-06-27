// ==================== SUPABASE CONFIGURATION FILE ====================
// ملف إعدادات Supabase المركزي
// استخدم هذا الملف لتغيير بيانات الاتصال بسهولة
// ==================== 

/**
 * كيف تحصل على الـ API Keys الصحيحة:
 * 
 * 1. اذهب إلى Supabase Dashboard:
 *    https://supabase.com/dashboard/project/firiwczwbakobadvrrom/settings/api
 * 
 * 2. في قسم "Configuration":
 *    - انسخ "Project URL"
 *    - ضعه في SUPABASE_URL أدناه
 * 
 * 3. في قسم "Project API keys":
 *    - انسخ "anon public" key (المفتاح الطويل)
 *    - ضعه في SUPABASE_ANON_KEY أدناه
 * 
 * ملاحظة: الـ anon key يجب أن يكون JWT طويل جداً يبدأ بـ eyJ
 */

const SUPABASE_CONFIG = {
    // Project URL - عنوان المشروع
    url: 'https://bebudhdiylpxrmddrhyp.supabase.co',

    // Anon Public Key - المفتاح العام (آمن للاستخدام في المتصفح)
    // ⚠️ استبدل هذا بالمفتاح الحقيقي من Dashboard
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlYnVkaGRpeWxweHJtZGRyaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODI4NTksImV4cCI6MjA5ODA1ODg1OX0.LB6-Tg7QdOertHK3eEue966iblIgVzO7982-WAg2bVM',

    // Optional: Additional options
    options: {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    }
};

// ==================== EXPORT CONFIGURATION ====================
// تصدير الإعدادات للاستخدام في الملفات الأخرى

if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = SUPABASE_CONFIG;
} else {
    // Browser environment - make it globally available
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
}

/**
 * ==================== USAGE EXAMPLES ====================
 * 
 * في ملف auth.js أو أي ملف آخر:
 * 
 * // Import Supabase client
 * const { createClient } = supabase;
 * 
 * // Create client using config
 * const supabaseClient = createClient(
 *     SUPABASE_CONFIG.url,
 *     SUPABASE_CONFIG.anonKey,
 *     SUPABASE_CONFIG.options
 * );
 * 
 * // Use the client
 * const { data, error } = await supabaseClient.auth.signUp({
 *     email: 'user@example.com',
 *     password: 'password123'
 * });
 */

/**
 * ==================== TROUBLESHOOTING ====================
 * 
 * خطأ "Invalid API key":
 * - تأكد أن الـ anonKey صحيح من Dashboard
 * - الـ key يجب أن يكون JWT طويل (200+ characters)
 * - يبدأ بـ eyJ ولا يحتوي على مسافات
 * 
 * خطأ "Failed to fetch":
 * - تأكد من الـ URL صحيح
 * - تأكد من اتصال الإنترنت
 * 
 * خطأ "CORS":
 * - أضف domain موقعك في Supabase Dashboard
 * - Settings → API → URL Configuration
 */
