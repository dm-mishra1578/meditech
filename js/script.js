document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    window.addEventListener('load', function() {
        document.querySelector('.preloader').style.display = 'none';
    });

    // Mobile Navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navClose = document.querySelector('.nav-close');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', function() {
        navLinks.classList.add('active');
    });

    navClose.addEventListener('click', function() {
        navLinks.classList.remove('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });

    // Sticky Navigation on Scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Initialize Hero Slider
    const heroSlider = new Swiper('.hero-slider', {
        loop: true,
        speed: 1000,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // Product Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Initialize 3D Models
    function init3DModels() {
        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.error('Three.js is not loaded');
            return;
        }

        // Function to create a basic 3D model
        function createBasicModel(containerId, color = 0x2a7fba, shape = 'box') {
            const container = document.getElementById(containerId);
            if (!container) return;

            const width = container.clientWidth;
            const height = container.clientHeight;

            // Scene
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf5f5f5);

            // Camera
            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            camera.position.z = 5;

            // Renderer
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(width, height);
            container.appendChild(renderer.domElement);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(1, 1, 1);
            scene.add(directionalLight);

            // Object
            let geometry;
            switch(shape) {
                case 'sphere':
                    geometry = new THREE.SphereGeometry(1, 32, 32);
                    break;
                case 'cylinder':
                    geometry = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 32);
                    break;
                case 'torus':
                    geometry = new THREE.TorusGeometry(0.8, 0.3, 16, 100);
                    break;
                default: // box
                    geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
            }

            const material = new THREE.MeshPhongMaterial({ 
                color: color,
                shininess: 100,
                flatShading: true
            });

            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            // Animation
            function animate() {
                requestAnimationFrame(animate);
                mesh.rotation.x += 0.005;
                mesh.rotation.y += 0.01;
                renderer.render(scene, camera);
            }

            // Handle resize
            window.addEventListener('resize', function() {
                const newWidth = container.clientWidth;
                const newHeight = container.clientHeight;
                
                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();
                
                renderer.setSize(newWidth, newHeight);
            });

            animate();
        }

        // Create models for different sections
        createBasicModel('slide1-model', 0x2a7fba, 'box');
        createBasicModel('slide2-model', 0x4ac7e9, 'sphere');