document.addEventListener('DOMContentLoaded', function () {
    // Find all accordion containers
    const accordionContainers = document.querySelectorAll('.accordion-container');
    
    accordionContainers.forEach(container => {
        const sections = container.querySelectorAll('.accordion-section');
        
        sections.forEach(section => {
            // Set initial styles
            section.style.transition = 'flex-grow 0.3s ease';
            section.style.flexGrow = '0';
            
            // Hide content initially except for first section
            const content = section.querySelector('.accordion-content');
            const text = section.querySelector('.accordion-text');
            const image = section.querySelector('.imageaccordion');
            
            if (content) content.style.display = 'none';
            if (text) text.style.display = 'none';
            if (image) image.style.display = 'none';
            
            // Show first section's content
            if (section === sections[0]) {
                section.style.flexGrow = '1';
                if (content) content.style.display = 'flex';
                if (text) text.style.display = 'flex';
                if (image) image.style.display = 'flex';
            }

            // Add click handler
            section.addEventListener('click', () => {
                sections.forEach(s => {
                    const sContent = s.querySelector('.accordion-content');
                    const sText = s.querySelector('.accordion-text');
                    const sImage = s.querySelector('.imageaccordion');
                    
                    if (s === section) {
                        s.style.flexGrow = '1';
                        if (sContent) sContent.style.display = 'flex';
                        if (sText) sText.style.display = 'flex';
                        if (sImage) sImage.style.display = 'flex';
                    } else {
                        s.style.flexGrow = '0';
                        if (sContent) sContent.style.display = 'none';
                        if (sText) sText.style.display = 'none';
                        if (sImage) sImage.style.display = 'none';
                    }
                });
            });
        });
    });

    // Handle vertical text rotation
    function setHeaderStyles() {
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        if (window.innerWidth <= 768) {
            accordionHeaders.forEach(header => {
                header.style.transform = 'rotate(0deg)';
                header.style.writingMode = 'horizontal-tb';
            });
        } else {
            accordionHeaders.forEach(header => {
                header.style.transform = 'rotate(180deg)';
                header.style.writingMode = 'vertical-lr';
            });
        }
    }

    setHeaderStyles();
    window.addEventListener('resize', setHeaderStyles);
});