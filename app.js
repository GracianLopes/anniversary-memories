// Store memories in array with 4 sample memories
let memories = [
    {
        type: 'text',
        data: '💕 Our First Meeting - A moment that changed everything',
        timestamp: new Date().toISOString()
    },
    {
        type: 'text',
        data: '🌹 The Day You Said Yes - The happiest moment of my life',
        timestamp: new Date().toISOString()
    },
    {
        type: 'text',
        data: '🎂 Celebrating Together - Every moment with you is special',
        timestamp: new Date().toISOString()
    },
    {
        type: 'text',
        data: '❤️ Forever With You - Our love story continues',
        timestamp: new Date().toISOString()
    }
];

// Image input handler
document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        // Store image data temporarily
        sessionStorage.setItem('tempImageData', event.target.result);
        // Show caption dialog
        showImageCaptionDialog();
        this.value = ''; // Reset input
    };
    reader.readAsDataURL(file);
});

// Show image caption dialog
function showImageCaptionDialog() {
    const modal = document.getElementById('imageCaptionModal');
    document.getElementById('imageCaption').value = '';
    modal.classList.remove('hidden');
    modal.classList.add('show');
}

// Close image caption dialog
function closeImageCaptionDialog() {
    const modal = document.getElementById('imageCaptionModal');
    modal.classList.add('hidden');
    modal.classList.remove('show');
    sessionStorage.removeItem('tempImageData');
}

// Save image with caption
function saveImageWithCaption() {
    const caption = document.getElementById('imageCaption').value.trim();
    const imageData = sessionStorage.getItem('tempImageData');
    
    if (!imageData) {
        alert('Error: Image data lost. Please try again.');
        return;
    }

    memories.push({
        type: 'image',
        data: imageData,
        caption: caption || '',
        timestamp: new Date().toISOString()
    });

    closeImageCaptionDialog();
    renderGallery();
}

// Show dialog to choose memory type
function showAddMemoryDialog() {
    const modal = document.getElementById('addMemoryModal');
    modal.classList.remove('hidden');
    modal.classList.add('show');
}

// Close add memory dialog
function closeAddMemoryDialog() {
    const modal = document.getElementById('addMemoryModal');
    modal.classList.add('hidden');
    modal.classList.remove('show');
}

// Add image memory
function addImageMemory() {
    closeAddMemoryDialog();
    document.getElementById('imageInput').click();
}

// Show text memory input
function showTextMemoryInput() {
    closeAddMemoryDialog();
    const modal = document.getElementById('textMemoryModal');
    document.getElementById('newMemoryText').value = '';
    modal.classList.remove('hidden');
    modal.classList.add('show');
}

// Close text memory modal
function closeTextMemoryModal() {
    const modal = document.getElementById('textMemoryModal');
    modal.classList.add('hidden');
    modal.classList.remove('show');
}

// Save new text memory
function saveNewMemory() {
    const text = document.getElementById('newMemoryText').value.trim();
    if (!text) {
        alert('Please write something!');
        return;
    }

    memories.push({
        type: 'text',
        data: text,
        timestamp: new Date().toISOString()
    });

    closeTextMemoryModal();
    renderGallery();
}

// Render gallery
function renderGallery() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    memories.forEach((memory, index) => {
        const item = document.createElement('div');
        item.className = `memory-item ${memory.type}`;

        if (memory.type === 'image') {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'image-container';
            
            const img = document.createElement('img');
            img.src = memory.data;
            img.onclick = () => previewImage(memory.data, memory.caption);
            imgContainer.appendChild(img);
            
            // Add caption if it exists
            if (memory.caption) {
                const caption = document.createElement('div');
                caption.className = 'image-caption';
                caption.textContent = memory.caption;
                caption.onclick = (e) => {
                    e.stopPropagation();
                    showEditImageCaptionModal(memory, index);
                };
                imgContainer.appendChild(caption);
            } else {
                const emptyCaption = document.createElement('div');
                emptyCaption.className = 'image-caption empty-caption';
                emptyCaption.textContent = 'Click to add caption...';
                emptyCaption.onclick = (e) => {
                    e.stopPropagation();
                    showEditImageCaptionModal(memory, index);
                };
                imgContainer.appendChild(emptyCaption);
            }
            
            item.appendChild(imgContainer);
        } else {
            const textContent = document.createElement('div');
            textContent.className = 'memory-text-content';
            textContent.textContent = memory.data;
            textContent.onclick = (e) => {
                e.stopPropagation();
                showMemoryModal(memory, index);
            };
            item.appendChild(textContent);
        }

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '✕';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            memories.splice(index, 1);
            renderGallery();
        };
        item.appendChild(deleteBtn);

        gallery.appendChild(item);
    });
}

// Preview image
function previewImage(src, caption = '') {
    const modal = document.getElementById('previewModal');
    document.getElementById('previewImage').src = src;
    
    // Update or create caption element
    let captionElement = document.getElementById('previewCaption');
    if (!captionElement) {
        captionElement = document.createElement('div');
        captionElement.id = 'previewCaption';
        captionElement.className = 'preview-caption';
        const previewContent = modal.querySelector('.preview-content');
        previewContent.appendChild(captionElement);
    }
    
    // Set caption content
    if (caption) {
        captionElement.textContent = caption;
        captionElement.style.display = 'block';
    } else {
        captionElement.style.display = 'none';
    }
    
    modal.classList.remove('hidden');
    modal.classList.add('show');
}

// Show memory modal for editing
function showMemoryModal(memory, index) {
    const modal = document.getElementById('memoryModal');
    document.getElementById('memoryText').value = memory.data;
    document.getElementById('memoryText').dataset.index = index;
    modal.classList.remove('hidden');
    modal.classList.add('show');
}

// Show edit image caption modal
function showEditImageCaptionModal(memory, index) {
    const modal = document.getElementById('editImageCaptionModal');
    document.getElementById('editImageCaption').value = memory.caption || '';
    document.getElementById('editImageCaption').dataset.index = index;
    modal.classList.remove('hidden');
    modal.classList.add('show');
}

// Close edit image caption modal
function closeEditImageCaptionModal() {
    const modal = document.getElementById('editImageCaptionModal');
    modal.classList.add('hidden');
    modal.classList.remove('show');
}

// Save edited image caption
function saveImageCaption() {
    const index = parseInt(document.getElementById('editImageCaption').dataset.index);
    const newCaption = document.getElementById('editImageCaption').value.trim();
    
    memories[index].caption = newCaption;
    closeEditImageCaptionModal();
    renderGallery();
}

// Save edited memory
function saveMemory() {
    const index = parseInt(document.getElementById('memoryText').dataset.index);
    const newText = document.getElementById('memoryText').value.trim();
    
    if (!newText) {
        alert('Memory text cannot be empty!');
        return;
    }

    memories[index].data = newText;
    closeMemoryModal();
    renderGallery();
}

// Close memory modal
function closeMemoryModal() {
    const modal = document.getElementById('memoryModal');
    modal.classList.add('hidden');
    modal.classList.remove('show');
}

// Generate shareable link
async function generateLink() {
    if (memories.length === 0) {
        alert('Please add at least one memory first!');
        return;
    }

    try {
        // Show loading state
        const linkInput = document.getElementById('shareLink');
        const linkModal = document.getElementById('linkModal');
        linkInput.value = 'Generating short link...';
        linkModal.classList.remove('hidden');
        linkModal.classList.add('show');

        // Create data package
        const dataPackage = {
            memories: memories,
            created: new Date().toISOString()
        };

        const jsonString = JSON.stringify(dataPackage);
        const sizeInMB = jsonString.length / (1024 * 1024);

        // Check size
        if (sizeInMB > 8) {
            alert(`⚠️ Data is ${sizeInMB.toFixed(2)}MB - too large. Please reduce images or use smaller files.`);
            linkModal.classList.add('hidden');
            linkModal.classList.remove('show');
            return;
        }

        // Compress with LZ-String
        if (typeof LZString === 'undefined') {
            alert('Compression library failed to load. Please refresh the page.');
            linkModal.classList.add('hidden');
            linkModal.classList.remove('show');
            return;
        }

        // Validate JSON string before compression
        if (!jsonString || jsonString.length === 0) {
            throw new Error('No data to compress');
        }

        let compressed;
        try {
            // Use compressToBase64URI instead - more stable than compressToEncodedURIComponent
            compressed = LZString.compressToBase64URI(jsonString);
            if (!compressed || compressed.length === 0) {
                // Fallback to regular compression
                compressed = LZString.compressToEncodedURIComponent(jsonString);
            }
        } catch (lzError) {
            console.error('LZ-String compression error:', lzError);
            // Last resort: use uncompressed base64
            try {
                compressed = btoa(unescape(encodeURIComponent(jsonString)));
                console.log('Using base64 fallback');
            } catch (e) {
                throw new Error('All compression methods failed: ' + lzError.message);
            }
        }

        if (!compressed) {
            throw new Error('Compression failed - empty result');
        }

        // Try to create a short link using both methods
        let shortLink = null;

        // Method 1: Try URL shortening services (for easy sharing on any platform)
        const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');
        const longLink = `${baseUrl}viewer.html?d=${compressed}`;
        
        shortLink = await shortenUrl(longLink);

        // Show in modal
        linkInput.value = shortLink;
        linkInput.select();

        // Generate QR code for easy scanning
        generateQRCode(shortLink);

        // Log for debugging
        console.log('✅ Link generated');
        console.log('Original size:', (jsonString.length / 1024).toFixed(2), 'KB');
        console.log('Compressed size:', (compressed.length / 1024).toFixed(2), 'KB');
        console.log('Long link length:', longLink.length, 'characters');
        console.log('Short link length:', shortLink.length, 'characters');
        console.log('Short link:', shortLink);

    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error('Error:', error);
        document.getElementById('linkModal').classList.add('hidden');
        document.getElementById('linkModal').classList.remove('show');
    }
}

// Shorten URL using multiple services with better fallbacks
async function shortenUrl(longUrl) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
        // Try multiple shorteners in order of reliability
        const shorteners = [
            {
                name: 'TinyURL',
                url: `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`,
                extract: (response) => response.trim()
            },
            {
                name: 'is.gd',
                url: `https://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`,
                extract: async (response) => {
                    const data = await response.json();
                    return data.shorturl;
                }
            },
            {
                name: 'v.gd',
                url: `https://v.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`,
                extract: async (response) => {
                    const data = await response.json();
                    return data.shorturl;
                }
            }
        ];

        for (const shortener of shorteners) {
            try {
                const response = await fetch(shortener.url, {
                    method: 'GET',
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/json, text/plain'
                    }
                });
                clearTimeout(timeoutId);
                if (response.ok) {
                    const shortUrl = await shortener.extract(response);
                    if (shortUrl && shortUrl.length > 0 && shortUrl.length < longUrl.length) {
                        console.log(`✅ Shortened using ${shortener.name}: ${shortUrl}`);
                        return shortUrl;
                    }
                }
            } catch (e) {
                console.log(`${shortener.name} failed: ${e.message}, trying next...`);
                continue;
            }
        }
    } catch (error) {
        clearTimeout(timeoutId);
        console.log('All shorteners failed:', error.message);
    }

    // If all shorteners fail, return long URL
    // The data is already highly compressed, so it might still be manageable
    console.log('⚠️ URL shortening failed. Returning compressed link.');
    return longUrl;
}

// Copy link to clipboard
function copyLink(btn) {
    const shareLink = document.getElementById('shareLink');
    shareLink.select();
    document.execCommand('copy');

    // Show feedback
    const originalText = btn.textContent;
    btn.textContent = '✅ Copied!';
    setTimeout(() => {
        btn.textContent = originalText;
    }, 2000);
}

// Generate and display QR code
function generateQRCode(url) {
    const qrContainer = document.getElementById('qrCode');
    qrContainer.innerHTML = ''; // Clear previous QR code
    
    new QRCode(qrContainer, {
        text: url,
        width: 200,
        height: 200,
        colorDark: '#ff69b4',
        colorLight: '#fff',
        correctLevel: QRCode.CorrectLevel.H
    });
}

// Download QR code as image
function downloadQR() {
    const qrCanvas = document.querySelector('#qrCode canvas');
    if (!qrCanvas) {
        alert('QR code not generated yet. Please wait a moment and try again.');
        return;
    }
    
    const link = document.createElement('a');
    link.href = qrCanvas.toDataURL('image/png');
    link.download = 'anniversary-memories-qr.png';
    link.click();
}

// Close modal
function closeModal() {
    document.getElementById('linkModal').classList.add('hidden');
    document.getElementById('linkModal').classList.remove('show');
}

// Clear all memories
function clearAll() {
    if (memories.length === 0) return;
    if (!confirm('Are you sure? This will delete all memories.')) return;

    memories = [];
    renderGallery();
}

// Close preview
function closePreview() {
    const modal = document.getElementById('previewModal');
    modal.classList.add('hidden');
    modal.classList.remove('show');
}

// Allow Enter key to add text memory (when text memory modal is open)
document.getElementById('newMemoryText').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        saveNewMemory();
    }
});

// Close preview when clicking outside
document.getElementById('previewModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closePreview();
    }
});

// Close memory modal when clicking outside
document.getElementById('memoryModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeMemoryModal();
    }
});

// Close add memory modal when clicking outside
document.getElementById('addMemoryModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeAddMemoryDialog();
    }
});

// Close text memory modal when clicking outside
document.getElementById('textMemoryModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeTextMemoryModal();
    }
});

// Close image caption modal when clicking outside
document.getElementById('imageCaptionModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeImageCaptionDialog();
    }
});

// Close edit image caption modal when clicking outside
document.getElementById('editImageCaptionModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeEditImageCaptionModal();
    }
});

// Initialize gallery on page load
document.addEventListener('DOMContentLoaded', renderGallery);
