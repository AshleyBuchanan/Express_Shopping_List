const menuItems = document.querySelectorAll('.menu-item');

menuItems.forEach(m => {
    m.addEventListener('click', () => {
        menuItems.forEach(m2 => {
            m2.classList.remove('active');
        });
        m.classList.add('active');
    });
});
