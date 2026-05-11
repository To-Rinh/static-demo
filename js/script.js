// Mr. Robot CTF Event - Main JavaScript

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', function() {
    updateActiveNavigation();
    initializeInteractivity();
});

// Update active navigation link based on current page
function updateActiveNavigation() {
    const currentPage = getCurrentPageName();
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // Check if link href matches current page
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === 'index.html' && href === 'index.html') || (currentPage.includes('index') && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Get current page filename
function getCurrentPageName() {
    const path = window.location.pathname;
    const fileName = path.substring(path.lastIndexOf('/') + 1);
    return fileName || 'index.html';
}

// Initialize interactivity (smooth animations, etc.)
function initializeInteractivity() {
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // Add animation to cards on scroll
    observeCardAnimations();
}

// Observe card animations on scroll
function observeCardAnimations() {
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }
}

// Sort leaderboard table
function sortTable(columnIndex, order = 'desc') {
    const table = document.querySelector('table tbody');
    if (!table) return;
    
    const rows = Array.from(table.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        
        // Try to parse as number
        const aNum = parseFloat(aValue.replace(/[^0-9.-]/g, ''));
        const bNum = parseFloat(bValue.replace(/[^0-9.-]/g, ''));
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return order === 'desc' ? bNum - aNum : aNum - bNum;
        }
        
        // String comparison
        return order === 'desc' 
            ? bValue.localeCompare(aValue) 
            : aValue.localeCompare(bValue);
    });
    
    rows.forEach(row => table.appendChild(row));
}

// Filter leaderboard by team name or score
function filterLeaderboard(filterValue) {
    if (!filterValue || filterValue.trim() === '') {
        // Show all rows
        document.querySelectorAll('table tbody tr').forEach(row => {
            row.style.display = '';
        });
        return;
    }
    
    const filter = filterValue.toLowerCase();
    document.querySelectorAll('table tbody tr').forEach(row => {
        const teamName = row.cells[1]?.textContent.toLowerCase() || '';
        const score = row.cells[2]?.textContent.toLowerCase() || '';
        
        if (teamName.includes(filter) || score.includes(filter)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Copy to clipboard utility
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard!');
        });
    } else {
        // Fallback for older browsers
        const elem = document.createElement('textarea');
        elem.value = text;
        document.body.appendChild(elem);
        elem.select();
        document.execCommand('copy');
        document.body.removeChild(elem);
        alert('Copied to clipboard!');
    }
}

// Terminal typing animation effect (optional)
function typeTerminalText(element, text, speed = 50) {
    let index = 0;
    element.textContent = '';
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Easter egg: Konami code
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', function(e) {
    const key = e.key === ' ' ? ' ' : e.code || e.key;
    
    if (key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    document.body.style.filter = 'hue-rotate(180deg)';
    setTimeout(() => {
        document.body.style.filter = 'none';
        alert('Fsociety has entered the building...');
    }, 1000);
}

// Export functions for use in HTML
window.sortTable = sortTable;
window.filterLeaderboard = filterLeaderboard;
window.copyToClipboard = copyToClipboard;
window.typeTerminalText = typeTerminalText;
