// Get URL parameter
function getUrlParameter(name) {
    const url = new URL(window.location);
    return url.searchParams.get(name);
}

// Load and display memories
async function loadMemories() {
    const shareId = getUrlParameter('id');
    const legacyData = getUrlParameter('d');
    let compressedData = null;

    if (shareId) {
        if (typeof supabaseClient === 'undefined') {
            const content = document.getElementById('content');
            content.innerHTML = '<div class="error-message">❌ Storage not configured. Supabase client failed to load.</div>';
            return;
        }

        const { data, error } = await supabaseClient
            .from('shares')
            .select('data')
            .eq('id', shareId)
            .maybeSingle();

        if (error) {
            const content = document.getElementById('content');
            content.innerHTML = `<div class="error-message">❌ Unable to load memories: ${escapeHtml(error.message)}</div>`;
            return;
        }

        if (!data || !data.data) {
            const content = document.getElementById('content');
            content.innerHTML = '<div class="error-message">❌ This link is invalid or expired.</div>';
            return;
        }

        compressedData = data.data;
    } else {
        compressedData = legacyData;
    }

    const normalizedData = compressedData ? compressedData.replace(/ /g, '+') : null;
    const content = document.getElementById('content');

    if (!compressedData) {
        content.innerHTML = '<div class="error-message">❌ No data found. Invalid or expired link.</div>';
        return;
    }

    try {
        // Check if LZ-String is loaded
        if (typeof LZString === 'undefined') {
            throw new Error('Compression library failed to load');
        }

        // Decompress data - try multiple methods for compatibility
        let jsonString = null;

        // Primary: EncodedURIComponent (current method)
        jsonString = LZString.decompressFromEncodedURIComponent(normalizedData);

        // Fallback: Base64 (legacy)
        if (!jsonString) {
            jsonString = LZString.decompressFromBase64(normalizedData);
        }

        // Last resort: plain base64 (uncompressed JSON fallback)
        if (!jsonString) {
            try {
                jsonString = decodeURIComponent(escape(atob(normalizedData)));
                console.log('Using base64 JSON fallback');
            } catch (e) {
                console.log('All decompress methods failed');
            }
        }

        if (!jsonString) {
            throw new Error('Failed to decompress data');
        }

        // Parse JSON
        const dataPackage = JSON.parse(jsonString);
        const memories = dataPackage.memories || [];
        if (memories.length === 0) {
            content.innerHTML = '<div class="error-message">❌ No memories found in this link.</div>';
            return;
        }

        let html = '<div class="gallery">';

        // Render each memory
        memories.forEach((memory, index) => {
            if (memory.type === 'image') {
                let captionHtml = '';
                let captionParam = '';
                if (memory.caption) {
                    captionHtml = `<div class="image-caption">${escapeHtml(memory.caption)}</div>`;
                    captionParam = `, '${escapeSingleQuotes(memory.caption)}'`;
                }
                html += `
                    <div class="memory-item image" onclick="previewImage('${escapeSingleQuotes(memory.data)}'${captionParam})">
                        <div class="image-container">
                            <img src="${memory.data}" alt="Memory ${index + 1}">
                            ${captionHtml}
                        </div>
                    </div>
                `;
            } else if (memory.type === 'text') {
                html += `
                    <div class="memory-item text">
                        ${escapeHtml(memory.data)}
                    </div>
                `;
            }
        });

        html += '</div>';
        content.innerHTML = html;

        console.log(`✅ Loaded ${memories.length} memories`);

    } catch (error) {
        console.error('Error:', error);
        content.innerHTML = `<div class="error-message">❌ Error loading memories: ${escapeHtml(error.message)}</div>`;
    }
}

// Preview image
function previewImage(src, caption = '') {
    const modal = document.getElementById('previewModal');
    const img = document.getElementById('previewImage');
    const content = modal.querySelector('.preview-content') || modal;
    img.src = src;
    
    // Update or create caption element
    let captionElement = document.getElementById('previewCaption');
    if (!captionElement) {
        captionElement = document.createElement('div');
        captionElement.id = 'previewCaption';
        captionElement.className = 'preview-caption';
        content.appendChild(captionElement);
    } else if (captionElement.parentElement !== content) {
        content.appendChild(captionElement);
    }
    
    // Set caption content
    if (caption) {
        captionElement.textContent = caption;
        captionElement.style.display = 'block';
    } else {
        captionElement.style.display = 'none';
    }
    
    modal.classList.add('active');
}

// Close preview when clicking outside
document.getElementById('previewModal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('active');
    }
});

// Escape HTML special characters
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Escape single quotes in data URLs
function escapeSingleQuotes(text) {
    return text.replace(/'/g, "\\'");
}

// Load on page load
window.addEventListener('DOMContentLoaded', loadMemories);
