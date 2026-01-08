// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll to Top Button
const scrollToTopBtn = document.getElementById('scrollToTop');

// Add scroll event for navbar styling and scroll to top button
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }

    // Show/hide scroll to top button at 2000px
    if (window.scrollY > 2000) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

scrollToTopBtn?.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Portfolio Filter
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const filter = this.getAttribute('data-filter');

        // Update active button
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Filter portfolio items
        document.querySelectorAll('.portfolio-item').forEach(item => {
            if (filter === 'all') {
                item.classList.remove('hidden');
            } else {
                if (item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            }
        });
    });
});

// Contact Form Submission
document.querySelector('.contact-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const phone = this.querySelector('input[type="tel"]').value;
    const message = this.querySelector('textarea').value;

    // Simple validation
    if (!name || !email || !message) {
        alert('Please fill in all required fields!');
        return;
    }

    // Here you would typically send the form data to a server
    console.log('Form submitted:', { name, email, phone, message });
    alert('Thank you for your message! I will get back to you soon.');

    // Reset form
    this.reset();
});

// Back to Top functionality
document.querySelector('.back-to-top')?.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Read More / Hide functionality
function toggleContent() {
    const content = document.getElementById('moreContent');
    const btn = document.getElementById('readMoreBtn');

    if (content.style.display === 'none') {
        content.style.display = 'block';
        btn.textContent = 'HIDE';
    } else {
        content.style.display = 'none';
        btn.textContent = 'READ MORE';
    }
}