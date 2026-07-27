class UnderSlider extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `<div class="view column">${PROJECTS.map((p) => `
            <a href="/work/${p.slug}/" class="view row project-link">
                <img src="${p.cover}" class="project-image">
            </a>`).join("")}</div>`;
    }
}

customElements.define("under-slider", UnderSlider);
