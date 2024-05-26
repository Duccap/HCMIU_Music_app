const menuOpen = document.getElementById('menu-open');
const menuClose = document.getElementById('menu-close');
const sidebar = document.querySelector('.container .sidebar');

menuOpen.addEventListener('click', () => sidebar.style.left = '0');

menuClose.addEventListener('click', () => sidebar.style.left = '-100%');


const mobileMenuOpen = document.getElementById('mobile-menu-open');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileSidebar = document.querySelector('.container .mobile-sidebar');

mobileMenuOpen.addEventListener('click', () => mobileSidebar.style.left = '0');

mobileMenuClose.addEventListener('click', () => mobileSidebar.style.left = '-100%');
