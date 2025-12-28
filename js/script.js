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
