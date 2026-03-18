// Get URL parameter
function getUrlParameter(name) {
    const url = new URL(window.location);
    return url.searchParams.get(name);
}

// Load and display memories
function loadMemories() {
    const compressedData = getUrlParameter('d');
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

        // Try Base64URI first (new method)
        try {
            jsonString = LZString.decompressFromBase64URI(compressedData);
        } catch (e) {
            console.log('Base64URI decompress failed, trying EncodedURIComponent');
        }

        // Fallback to EncodedURIComponent (old method)
        if (!jsonString) {
            jsonString = LZString.decompressFromEncodedURIComponent(compressedData);
        }

        // Last resort: try base64 decode
        if (!jsonString) {
            try {
                jsonString = decodeURIComponent(escape(atob(compressedData)));
                console.log('Using base64 decompress fallback');
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
        const created = dataPackage.created;

        if (memories.length === 0) {
            content.innerHTML = '<div class="error-message">❌ No memories found in this link.</div>';
            return;
        }

        // Display creation time
        const createdDate = new Date(created).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let html = `<div class="timestamp">✨ Shared on ${createdDate}</div>`;
        html += '<div class="gallery">';

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
    img.src = src;
    
    // Update or create caption element
    let captionElement = document.getElementById('previewCaption');
    if (!captionElement) {
        captionElement = document.createElement('div');
        captionElement.id = 'previewCaption';
        captionElement.className = 'preview-caption';
        modal.appendChild(captionElement);
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
