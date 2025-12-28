// Tab functionality for gallery section
document.addEventListener('DOMContentLoaded', function() {
    // Video functionality
    const videoItems = document.querySelectorAll('.video-item');
    
    videoItems.forEach(item => {
        const video = item.querySelector('video');
        const playButton = item.querySelector('.play-button');
        
        // Play video when clicking the play button or the video container
        [playButton, item].forEach(el => {
            el?.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Pause all other videos
                document.querySelectorAll('.video-item video').forEach(v => {
                    if (v !== video) {
                        v.pause();
                        v.parentElement.classList.remove('playing');
                    }
                });
                
                // Toggle play/pause for clicked video
                if (video.paused) {
                    video.play();
                    item.classList.add('playing');
                } else {
                    video.pause();
                    item.classList.remove('playing');
                }
            });
        });
        
        // Show controls when video is playing
        video.addEventListener('play', () => {
            item.classList.add('playing');
        });
        
        // Hide controls when video is paused
        video.addEventListener('pause', () => {
            // Only remove playing class if video ended or manually paused
            if (video.ended || video.paused) {
                item.classList.remove('playing');
            }
        });
        
        // Handle video end
        video.addEventListener('ended', () => {
            item.classList.remove('playing');
            video.currentTime = 0;
        });
        
        // Pause video when clicking outside
        document.addEventListener('click', (e) => {
            if (!item.contains(e.target) && !video.paused) {
                video.pause();
                item.classList.remove('playing');
            }
        });
    });
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Add click event to each tab button
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding content
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Update social media links
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        if (link.querySelector('.fa-facebook-f')) {
            link.href = 'https://www.facebook.com/profile.php?id=61585722420812';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
    });
});
// Lightbox functionality
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxContent = document.querySelector('.lightbox-content');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    let currentIndex = 0;
    let items = [];
    let currentGallery = '';
    let isMaximized = false;

    // Get all gallery items (images and videos)
    function getAllGalleryItems() {
        const activeTab = document.querySelector('.tab-content.active');
        if (!activeTab) return [];
        
        return Array.from(activeTab.querySelectorAll('.gallery-item:not(.video-item) img, .gallery-item.video-item video'));
    }

    // Open lightbox
    function openLightbox(index, galleryId = '') {
        if (galleryId) {
            currentGallery = galleryId;
            const tab = document.getElementById(galleryId);
            items = Array.from(tab.querySelectorAll('.gallery-item:not(.video-item) img, .gallery-item.video-item video'));
        }
        
        if (items.length === 0) return;
        
        currentIndex = index;
        // Reset maximize state when opening a new item
        isMaximized = false;
        document.querySelector('.lightbox-content')?.classList.remove('maximized');
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
    }

    // Update lightbox content
    function updateLightbox() {
        if (items.length === 0) return;
        
        const item = items[currentIndex];
        const isVideo = item.tagName.toLowerCase() === 'video';
        
        // Clear previous content
        lightboxContent.innerHTML = '';
        
        if (isVideo) {
            lightboxImg.style.display = 'none';
            
            // Create new video element
            const video = document.createElement('video');
            video.src = item.querySelector('source').src;
            video.controls = true;
            video.autoplay = true;
            video.style.maxWidth = '100%';
            video.style.maxHeight = '80vh';
            video.style.display = 'block';
            
            // Create a container for the video
            const videoContainer = document.createElement('div');
            videoContainer.style.position = 'relative';
            videoContainer.style.width = '100%';
            videoContainer.style.height = '100%';
            videoContainer.style.display = 'flex';
            videoContainer.style.justifyContent = 'center';
            videoContainer.style.alignItems = 'center';
            
            videoContainer.appendChild(video);

            // Add a maximize/minimize button for videos
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'lightbox-toggle-size';
            toggleBtn.innerHTML = '⤢';
            toggleBtn.title = 'Maximize';
            toggleBtn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                toggleMaximize();
                if (isMaximized) {
                    toggleBtn.innerHTML = '⤡';
                    toggleBtn.title = 'Restore';
                } else {
                    toggleBtn.innerHTML = '⤢';
                    toggleBtn.title = 'Maximize';
                }
            });
            // Reflect current maximize state when showing item
            if (isMaximized) {
                lightboxContent.classList.add('maximized');
                toggleBtn.innerHTML = '⤡';
                toggleBtn.title = 'Restore';
            } else {
                lightboxContent.classList.remove('maximized');
                toggleBtn.innerHTML = '⤢';
                toggleBtn.title = 'Maximize';
            }
            videoContainer.appendChild(toggleBtn);

            lightboxContent.appendChild(videoContainer);
        } else {
            // For images
            lightboxImg.src = item.src || item.getAttribute('src');
            lightboxImg.style.display = 'block';
            lightboxContent.appendChild(lightboxImg);
        }
        
        // Update caption
        const caption = item.parentElement.querySelector('h3')?.textContent || '';
        lightboxCaption.textContent = caption;
        
        // Update navigation buttons
        prevBtn.style.display = currentIndex === 0 ? 'none' : 'flex';
        nextBtn.style.display = currentIndex === items.length - 1 ? 'none' : 'flex';
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        // Reset maximize state
        isMaximized = false;
        document.querySelector('.lightbox-content')?.classList.remove('maximized');

        // Pause and remove any playing video
        const videos = document.querySelectorAll('.lightbox-content video');
        videos.forEach(video => {
            video.pause();
            video.remove();
        });
        
        // Clear the lightbox content
        lightboxContent.innerHTML = '';
        lightboxContent.appendChild(lightboxImg);
        lightboxContent.appendChild(lightboxCaption);
    }

    // Event listeners for gallery items
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.addEventListener('click', (e) => {
            // Don't open lightbox if clicking on play button or video controls
            if (e.target.closest('.play-button') || e.target.closest('video')) {
                return;
            }
            
            const galleryId = item.closest('.tab-content')?.id;
            if (!galleryId) return;
            
            // Get all clickable items in the current gallery
            const items = Array.from(document.querySelectorAll(`#${galleryId} .gallery-item:not(.video-item) img, #${galleryId} .gallery-item.video-item video`));
            const itemIndex = items.findIndex(img => img === item.querySelector('img, video'));
            
            if (itemIndex !== -1) {
                openLightbox(itemIndex, galleryId);
            }
        });
    });

    // Close lightbox when clicking the overlay or close button
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === closeBtn) {
            closeLightbox();
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'm' && lightbox.classList.contains('active')) {
            toggleMaximize();
        } else if (e.key === 'ArrowLeft' && lightbox.classList.contains('active')) {
            navigate(-1);
        } else if (e.key === 'ArrowRight' && lightbox.classList.contains('active')) {
            navigate(1);
        }
    });

    // Toggle maximize/restore for the lightbox content (used by button and keyboard)
    function toggleMaximize() {
        isMaximized = !isMaximized;
        if (isMaximized) {
            document.querySelector('.lightbox-content')?.classList.add('maximized');
        } else {
            document.querySelector('.lightbox-content')?.classList.remove('maximized');
        }
    }

    // Navigation functions
    function navigate(direction) {
        currentIndex += direction;
        
        if (currentIndex < 0) {
            currentIndex = items.length - 1;
        } else if (currentIndex >= items.length) {
            currentIndex = 0;
        }
        
        updateLightbox();
    }

    // Button event listeners
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(-1);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(1);
    });

    // Prevent clicks on lightbox content from closing it
    document.querySelector('.lightbox-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });
});