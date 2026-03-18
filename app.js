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
            img.onclick = () => previewImage(memory.data);
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
function previewImage(src) {
    const modal = document.getElementById('previewModal');
    document.getElementById('previewImage').src = src;
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

        const compressed = LZString.compressToEncodedURIComponent(jsonString);
        if (!compressed) {
            throw new Error('Compression failed');
        }

        // Create share link
        const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');
        const longLink = `${baseUrl}viewer.html?d=${compressed}`;

        // Shorten the URL using TinyURL API
        const shortLink = await shortenUrl(longLink);

        // Show in modal
        linkInput.value = shortLink;
        linkInput.select();

        // Log for debugging
        console.log('✅ Link generated');
        console.log('Original size:', (jsonString.length / 1024).toFixed(2), 'KB');
        console.log('Compressed size:', (compressed.length / 1024).toFixed(2), 'KB');
        console.log('Long link length:', longLink.length, 'characters');
        console.log('Short link:', shortLink);

    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error('Error:', error);
        document.getElementById('linkModal').classList.add('hidden');
        document.getElementById('linkModal').classList.remove('show');
    }
}

// Shorten URL using multiple services with fallback
async function shortenUrl(longUrl) {
    try {
        // Try TinyURL first (most reliable)
        const response = await fetch(`https://tinyurl.com/api/create.php?url=${encodeURIComponent(longUrl)}`, {
            method: 'GET'
        });

        if (response.ok) {
            const shortUrl = await response.text();
            if (shortUrl && shortUrl.includes('tinyurl.com')) {
                return shortUrl;
            }
        }
    } catch (error) {
        console.log('TinyURL failed, trying alternative...');
    }

    try {
        // Fallback to is.gd
        const response = await fetch(`https://is.gd/?url=${encodeURIComponent(longUrl)}&format=json`, {
            method: 'GET'
        });

        if (response.ok) {
            const data = await response.json();
            if (data.shorturl) {
                return data.shorturl;
            }
        }
    } catch (error) {
        console.log('is.gd failed, using long URL...');
    }

    // If shortening fails, return the long URL
    // But compress it further by removing the base URL for local handling
    return longUrl;
}

// Copy link to clipboard
function copyLink() {
    const shareLink = document.getElementById('shareLink');
    shareLink.select();
    document.execCommand('copy');
    
    // Show feedback
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✅ Copied!';
    setTimeout(() => {
        btn.textContent = originalText;
    }, 2000);
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

// Allow Enter key to add text memory
document.getElementById('customText').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addCustomMemory();
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
