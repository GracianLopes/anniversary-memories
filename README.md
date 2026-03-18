# 💕 Anniversary Memories

A beautiful, shareable photo and memory gallery. Create memories, generate a share link, and share it with anyone - no backend required!

## Features

✨ **Zero Backend**
- All data is compressed and embedded in the share link
- Works completely offline
- No server costs or dependencies

📸 **Rich Media Support**
- Upload images (JPEG, PNG, WebP, etc.)
- Add custom text memories
- Browse as image grid or text cards

🔗 **Easy Sharing**
- One-click link generation
- Share via WhatsApp, email, social media
- Works across all devices and browsers

📱 **Responsive Design**
- Beautiful animations and transitions
- Works perfectly on mobile, tablet, and desktop
- Cross-browser compatible (Chrome, Firefox, Safari, Edge)

## How It Works

1. **Add Memories**: Upload images or write custom text memories
2. **Generate Link**: Click "Generate Share Link" - your data is compressed and embedded in the URL
3. **Share Anywhere**: Copy the link and share via any messaging app
4. **View Anytime**: Anyone can open the link and see all memories without any installation

## Technical Details

**Compression**: Uses [LZ-String](https://github.com/pieroxy/lz-string) to compress data up to 70% smaller

**URL Format**: `viewer.html?d=COMPRESSED_DATA`

**Size Limits**:
- Works best with uncompressed data under 8MB
- URL max length: ~8000 characters (supported by all modern browsers)

**No Tracking**: Your memories stay private - they're only in the link you share

## Setup

1. Clone the repository
2. Open `index.html` in your browser
3. Start adding memories!

## Files

- `index.html` - Main gallery and creation interface
- `style.css` - Responsive styling with animations
- `app.js` - Core application logic
- `viewer.html` - Read-only memory viewer
- `viewer.js` - Link decompression and display

## Browser Support

- Chrome/Chromium ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Mobile browsers ✅

## Hosting

To share links with anyone:

1. Deploy to GitHub Pages or any static hosting
2. Update the base URL in `app.js` if needed
3. Share the `viewer.html` link with compressed data

## License

MIT - Feel free to use and modify!

---

Made with ❤️ for celebrating memories together.
