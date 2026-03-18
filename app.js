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
        memories.push({
            type: 'image',
            data: event.target.result,
            timestamp: new Date().toISOString()
        });
        renderGallery();
        this.value = ''; // Reset input
    };
    reader.readAsDataURL(file);
});

// Add custom text memory
function addCustomMemory() {
    const text = document.getElementById('customText').value.trim();
    if (!text) return;

    memories.push({
        type: 'text',
        data: text,
        timestamp: new Date().toISOString()
    });

    document.getElementById('customText').value = '';
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
            const img = document.createElement('img');
            img.src = memory.data;
            img.onclick = () => previewImage(memory.data);
            item.appendChild(img);
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
function generateLink() {
    if (memories.length === 0) {
        alert('Please add at least one memory first!');
        return;
    }

    try {
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
            return;
        }

        // Compress with LZ-String
        if (typeof LZString === 'undefined') {
            alert('Compression library failed to load. Please refresh the page.');
            return;
        }

        const compressed = LZString.compressToEncodedURIComponent(jsonString);
        if (!compressed) {
            throw new Error('Compression failed');
        }

        // Create share link
        const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');
        const shareLink = `${baseUrl}viewer.html?d=${compressed}`;

        // Show in modal
        document.getElementById('shareLink').value = shareLink;
        document.getElementById('linkModal').classList.remove('hidden');

        // Log for debugging
        console.log('✅ Link generated');
        console.log('Original size:', (jsonString.length / 1024).toFixed(2), 'KB');
        console.log('Compressed size:', (compressed.length / 1024).toFixed(2), 'KB');
        console.log('Link length:', shareLink.length, 'characters');

    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error('Error:', error);
    }
}

// Copy link to clipboard
function copyLink() {
    const shareLink = document.getElementById('shareLink');
    shareLink.select();
    document.execCommand('copy');
    alert('✅ Link copied to clipboard!');
}

// Close modal
function closeModal() {
    document.getElementById('linkModal').classList.add('hidden');
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

// Initialize gallery on page load
document.addEventListener('DOMContentLoaded', renderGallery);
