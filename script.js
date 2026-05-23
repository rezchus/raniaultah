document.addEventListener('DOMContentLoaded', () => {
    
    // --- Slider Logic ---
    const navBtns = document.querySelectorAll('.nav-btn');
    const actionBtns = document.querySelectorAll('.action-btn[data-target]');
    const sliderTrack = document.querySelector('.slider-track');
    let currentSlide = 0;

    function goToSlide(index) {
        currentSlide = index;
        
        // Update slider position
        sliderTrack.style.transform = `translateX(-${index * 100}vw)`;
        
        // Update Nav active state
        navBtns.forEach(btn => btn.classList.remove('active'));
        if (navBtns[index]) {
            navBtns[index].classList.add('active');
        }

        // Update arrows visibility
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        if (prevBtn) prevBtn.style.display = index === 0 ? 'none' : 'flex';
        if (nextBtn) nextBtn.style.display = index === navBtns.length - 1 ? 'none' : 'flex';

        // Trigger animations for the active slide
        triggerAnimations(index);
    }

    // Add click listeners to arrows
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) goToSlide(currentSlide - 1);
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
        if (currentSlide < navBtns.length - 1) goToSlide(currentSlide + 1);
    });

    // Add click listeners to navigation buttons
    navBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    // Add click listeners to action buttons (e.g. Start Journey)
    actionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = parseInt(btn.getAttribute('data-target'));
            goToSlide(target);
        });
    });

    // --- Animations Trigger ---
    function triggerAnimations(slideIndex) {
        // Reset animations on all slides
        document.querySelectorAll('.slide .fade-in-up').forEach(el => {
            el.style.animation = 'none';
            // Trigger reflow
            el.offsetHeight; 
            el.style.animation = null; 
            el.classList.remove('fade-in-up');
        });

        // Add animation class to elements in current slide
        const currentSlideEl = document.querySelectorAll('.slide')[slideIndex];
        if (currentSlideEl) {
            const elementsToAnimate = currentSlideEl.querySelectorAll('h1, h2, .sticky-note, .timeline-item, .polaroid, .hanging-polaroid, .envelope-container');
            elementsToAnimate.forEach((el, i) => {
                el.classList.add('fade-in-up');
                el.style.animationDelay = `${i * 0.2}s`;
            });
        }
    }

    // Initial animation trigger
    triggerAnimations(0);

    // --- Floating Hearts Background ---
    function createHearts() {
        const container = document.querySelector('.floating-hearts-container');
        const heartCount = 15;

        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            
            // Random properties
            const leftPos = Math.random() * 100;
            const size = Math.random() * 0.8 + 0.5;
            const delay = Math.random() * 10;
            const duration = Math.random() * 5 + 8;

            heart.style.left = `${leftPos}vw`;
            heart.style.transform = `scale(${size}) rotate(45deg)`;
            heart.style.animationDelay = `${delay}s`;
            heart.style.animationDuration = `${duration}s`;

            container.appendChild(heart);
        }
    }

    createHearts();

    const envelope = document.querySelector('.envelope-container');
    const openLetterBtn = document.getElementById('open-letter-btn');
    const backHomeBtn = document.getElementById('back-home-btn');
    
    // Typing animation setup
    const paperContent = document.querySelector('.paper-content');
    const paragraphs = paperContent.querySelectorAll('p');
    const originalTexts = Array.from(paragraphs).map(p => p.textContent);
    
    // Clear texts initially
    paragraphs.forEach(p => p.textContent = '');
    let isTyping = false;

    function typeLetter() {
        if (isTyping) return;
        isTyping = true;
        
        let pIndex = 0;
        let charIndex = 0;
        
        function typeChar() {
            if (pIndex < paragraphs.length) {
                if (charIndex === 0) {
                    paragraphs.forEach(p => p.classList.remove('typing-cursor'));
                    paragraphs[pIndex].classList.add('typing-cursor');
                }
                
                if (charIndex < originalTexts[pIndex].length) {
                    paragraphs[pIndex].textContent += originalTexts[pIndex].charAt(charIndex);
                    charIndex++;
                    
                    // Auto-scroll to bottom of the paper as text is typed
                    const letterPaper = document.querySelector('.letter-paper');
                    if (letterPaper) {
                        letterPaper.scrollTop = letterPaper.scrollHeight;
                    }
                    
                    setTimeout(typeChar, 25); // Speed of typing
                } else {
                    paragraphs[pIndex].classList.remove('typing-cursor');
                    pIndex++;
                    charIndex = 0;
                    setTimeout(typeChar, 300); // Pause between paragraphs
                }
            }
        }
        setTimeout(typeChar, 800); // Wait for envelope to open before typing
    }

    function openEnvelope() {
        envelope.classList.add('is-open');
        
        // Let CSS handle the 3D flip animation. 
        // Just wait for it to finish then type.
        typeLetter();
        
        openLetterBtn.style.display = 'none';
        backHomeBtn.style.display = 'block';
    }

    envelope.addEventListener('click', () => {
        if (!envelope.classList.contains('is-open')) {
            openEnvelope();
        }
    });

    openLetterBtn.addEventListener('click', openEnvelope);

    // --- Music Logic (Local Audio) ---
    const musicBtn = document.querySelector('.music-btn');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;
    let hasInteracted = false;

    function playAudio() {
        bgMusic.play().then(() => {
            isPlaying = true;
            musicBtn.innerHTML = "<span>You're On Your Own, Kid &#10074;&#10074;</span>";
        }).catch(err => {
            console.log("Autoplay blocked until user interacts.");
        });
    }

    // Try to play immediately (might be blocked by browser)
    playAudio();

    // Play on first interaction if autoplay was blocked
    document.body.addEventListener('click', () => {
        if (!hasInteracted && !isPlaying) {
            playAudio();
            hasInteracted = true;
        }
    });

    // Player click logic
    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent triggering the body click
        hasInteracted = true;
        
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.innerHTML = "<span>You're On Your Own, Kid &#9658;</span>";
        } else {
            bgMusic.play();
            musicBtn.innerHTML = "<span>You're On Your Own, Kid &#10074;&#10074;</span>";
        }
        isPlaying = !isPlaying;
    });
});
