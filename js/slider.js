class UnderSlider extends HTMLElement {
    constructor() {
        super();
        this.render();
    }
    
    render() {
        const sidebar = document.getElementById('sidebar-work');
        if (!sidebar) {
            this.innerHTML = '';
            return;
        }

        // Get all project images to find their actual paths
        const projectImages = document.querySelectorAll('.sidebar-project-image');
        const imageMap = {};
        
        projectImages.forEach(img => {
            if (img.id && img.src) {
                const match = img.src.match(/\/work\/([^\/]+)\/([^\/]+\.(png|svg))$/);
                if (match) {
                    imageMap[match[1]] = match[2];
                }
            }
        });

        const projects = Array.from(sidebar.querySelectorAll('a.sidebar-project-link')).map(link => {
            const id = link.id.split('-')[0];
            const imagePath = imageMap[id] || '0.png';
            return `<a href="${link.href}" class="view row project-link">
                <img src="https://weareunder.design/work/${id}/${imagePath}" class="project-image">
            </a>`;
        }).join('');

        this.innerHTML = `<div class="view column">${projects}</div>`;
    }
}

if (!customElements.get('under-slider')) {
    customElements.define("under-slider", UnderSlider);
}

// Re-render when sidebar is available
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const sliders = document.querySelectorAll('under-slider');
        sliders.forEach(slider => slider.render());
    }, 1000);
});