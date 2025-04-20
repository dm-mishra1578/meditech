document.addEventListener('DOMContentLoaded', function() {
    // Accessibility Features
    const fontDecrease = document.getElementById('fontDecrease');
    const fontReset = document.getElementById('fontReset');
    const fontIncrease = document.getElementById('fontIncrease');
    const themeToggle = document.getElementById('themeToggle');
    const languageSelect = document.getElementById('languageSelect');
    const htmlElement = document.documentElement;
    
    // Font size controls
    fontDecrease.addEventListener('click', function() {
        const currentSize = parseFloat(getComputedStyle(htmlElement).fontSize);
        if (currentSize > 12) {
            htmlElement.style.fontSize = (currentSize - 1) + 'px';
        }
    });
    
    fontReset.addEventListener('click', function() {
        htmlElement.style.fontSize = '16px';
    });
    
    fontIncrease.addEventListener('click', function() {
        const currentSize = parseFloat(getComputedStyle(htmlElement).fontSize);
        if (currentSize < 20) {
            htmlElement.style.fontSize = (currentSize + 1) + 'px';
        }
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    
    // Language selector
    languageSelect.addEventListener('change', function() {
        const lang = this.value;
        // In a real implementation, you would load translations here
        console.log('Language changed to:', lang);
        // For demo purposes, we'll just show an alert
        alert(`Language changed to ${lang}. In a real implementation, this would load translations.`);
    });
    
    // Navigation
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Scroll behavior for navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.stat-number, .progress, .skill-bar');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                if (element.classList.contains('stat-number')) {
                    const target = parseInt(element.getAttribute('data-count'));
                    let count = 0;
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    
                    const timer = setInterval(() => {
                        count += increment;
                        if (count >= target) {
                            clearInterval(timer);
                            element.textContent = target;
                        } else {
                            element.textContent = Math.floor(count);
                        }
                    }, 16);
                }
                
                if (element.classList.contains('progress')) {
                    const width = element.getAttribute('data-width');
                    element.style.width = width;
                }
                
                if (element.classList.contains('skill-bar')) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
    
    // 3D Cube Animation
    const cube = document.querySelector('.cube');
    let rotateX = 0;
    let rotateY = 0;
    
    document.addEventListener('mousemove', (e) => {
        rotateX = (e.clientY / window.innerHeight) * 360;
        rotateY = (e.clientX / window.innerWidth) * 360;
        cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    // Floating icons animation with GSAP
    const floatingIcons = document.querySelectorAll('.floating-icons i');
    
    floatingIcons.forEach((icon, index) => {
        gsap.to(icon, {
            y: 20,
            duration: 2 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });
    
    // Skill wheel animation
    const wheelItems = document.querySelectorAll('.wheel-item');
    
    wheelItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.2,
                duration: 0.3,
                ease: "back.out"
            });
        });
        
        item.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: "back.out"
            });
        });
    });
    
    // Form input animations
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');
        
        input.addEventListener('focus', function() {
            gsap.to(label, {
                top: -10,
                left: 10,
                fontSize: '0.8rem',
                color: 'var(--primary-color)',
                duration: 0.3
            });
        });
        
        input.addEventListener('blur', function() {
            if (!input.value) {
                gsap.to(label, {
                    top: 15,
                    left: 15,
                    fontSize: '1rem',
                    color: 'var(--text-light)',
                    duration: 0.3
                });
            }
        });
    });
});