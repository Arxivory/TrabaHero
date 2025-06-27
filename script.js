// Add some subtle animations and interactions
        document.addEventListener('DOMContentLoaded', function() {
            // Animate cards on hover
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px)';
                });
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });

            // Animate navigation items
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    navItems.forEach(nav => nav.classList.remove('active'));
                    this.classList.add('active');
                });
            });

            // Animate buttons
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 150);
                });
            });

            // Simulate real-time updates
            setInterval(() => {
                const percentage = document.querySelector('.chart-percentage');
                const currentValue = parseInt(percentage.textContent);
                const newValue = Math.max(70, Math.min(80, currentValue + (Math.random() - 0.5) * 2));
                percentage.textContent = Math.round(newValue) + '%';
            }, 5000);
        });