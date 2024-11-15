
export function setupNavigation() {
    const homeSection = document.getElementById('home-section');
    const newsSection = document.getElementById('news-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const homeLink = document.getElementById('stoxnews-logo')
    const newsLink = document.getElementById('news-link');
    const dashboardLink = document.getElementById('dashboard-link');
    

    function switchSection(sectionToShow) {
        // Hide all sections by default
        homeSection.style.display = 'none';
        newsSection.style.display = 'none';
        dashboardSection.style.display = 'none';

        // Show the selected section
        if (sectionToShow === 'home') {
            homeSection.style.display = 'flex';
        } else if (sectionToShow === 'news') {
            newsSection.style.display = 'block';
        } else if (sectionToShow === 'dashboard') {
            dashboardSection.style.display = 'block';
        }
    }

    // Event listeners for navigation links
    homeLink.addEventListener('click', (event) => {
        event.preventDefault();
        switchSection('home'); // Show home section
    });

    newsLink.addEventListener('click', (event) => {
        event.preventDefault();
        switchSection('news'); // Show news section
    });

    dashboardLink.addEventListener('click', (event) => {
        event.preventDefault();
        switchSection('dashboard'); // Show dashboard section
    });


}
