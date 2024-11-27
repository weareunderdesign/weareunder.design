const fontFace = new FontFace('VcNudge', 'url(../fonts/VCNudgeBoldItalicTrial.otf)');
fontFace.load().then(function(loadedFace) {
    document.fonts.add(loadedFace);
});

const createStyles = () => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .nudge_font {
            font-family: 'VcNudge';
            font-size: 17.35vw;
            line-height: 89%;
        }

        .tickerimages {
            position: relative;
            width: 100%;
            overflow: hidden;
            flex-wrap: nowrap;
        }

        .under-logo-footer {
            width: 140px;
            height: 140px;
        }

        .tickertext {
            position: relative;
            width: 2000vw;
            overflow: hidden;
            flex-wrap: nowrap;
        }

        .tickerblock {
            position: absolute;
            left: -1900vw;
            animation: tickerblock 1020s linear infinite;
        }

        .tickerblockimages {
            position: absolute;
            right: -500vw;
            animation: tickerblockimages 340s linear infinite;
            flex-wrap: nowrap;
            width: 600vw;
        }

        @keyframes tickerblock {
            0% { left: -1900vw; }
            50% { left: 20vw; }
            100% { left: -1900vw; }
        }

        @keyframes tickerblockimages {
            0% { right: -500vw; opacity: 1; }
            50% { right: 0vw; opacity: 1; }
            100% { right: -500vw; opacity: 1; }
        }

        .tickerblock:hover,
        .tickerblockimages:hover {
            animation-play-state: paused;
        }

        @media (max-width: 768px) {
            .nocolumn {
                flex-direction: row !important;
            }

            .nudge_font {
                font-size: 28vw;
            }

            .tickerblockimages {
                right: -510vw;
                width: 600vw;
                animation: tickerblockimages-mobile 340s linear infinite;
            }

            .tickertext {
                width: 5000vw;
            }

            .tickerblock {
                left: -4900vw;
                animation: tickerblock-mobile 1020s linear infinite;
            }

            @keyframes tickerblock-mobile {
                0% { left: -4900vw; }
                50% { left: -20vw; }
                100% { left: -4900vw; }
            }

            @keyframes tickerblockimages-mobile {
                0% { right: -510vw; opacity: 1; }
                50% { right: 510vw; opacity: 1; }
                100% { right: -510vw; opacity: 1; }
            }
        }

        @media (min-width: 768px) and (max-width: 1366px) {
            .nudge_font {
                font-size: 25vw;
            }

            .tickerblockimages {
                right: -455vw;
                width: 550vw;
                animation: tickerblockimages-tablet 340s linear infinite;
            }

            @keyframes tickerblockimages-tablet {
                0% { right: -455vw; opacity: 1; }
                50% { right: 455vw; opacity: 1; }
                100% { right: -455vw; opacity: 1; }
            }
        }
    `;
    document.head.appendChild(styleSheet);
};

const initAnimations = () => {
    const tickerText = document.querySelector('.tickertext');
    const tickerImages = document.querySelector('.tickerimages');

    if (tickerText) {
        const tickerBlock = tickerText.querySelector('.tickerblock');
        if (tickerBlock) {
            tickerBlock.addEventListener('mouseover', () => {
                tickerBlock.style.animationPlayState = 'paused';
            });
            tickerBlock.addEventListener('mouseout', () => {
                tickerBlock.style.animationPlayState = 'running';
            });
        }
    }

    if (tickerImages) {
        const tickerBlockImages = tickerImages.querySelector('.tickerblockimages');
        if (tickerBlockImages) {
            tickerBlockImages.addEventListener('mouseover', () => {
                tickerBlockImages.style.animationPlayState = 'paused';
            });
            tickerBlockImages.addEventListener('mouseout', () => {
                tickerBlockImages.style.animationPlayState = 'running';
            });
        }
    }
};

const updateStyles = () => {
    const width = window.innerWidth;
    const tickerBlocks = document.querySelectorAll('.tickerblock, .tickerblockimages');
    
    tickerBlocks.forEach(block => {
        if (width <= 768) {
            if (block.classList.contains('tickerblock')) {
                block.style.left = '-4900vw';
            } else {
                block.style.right = '-510vw';
                block.style.width = '600vw';
            }
        } else if (width <= 1366) {
            if (block.classList.contains('tickerblockimages')) {
                block.style.right = '-455vw';
                block.style.width = '550vw';
            }
        } else {
            if (block.classList.contains('tickerblock')) {
                block.style.left = '-1900vw';
            } else {
                block.style.right = '-500vw';
                block.style.width = '600vw';
            }
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    createStyles();
    initAnimations();
    updateStyles();
    window.addEventListener('resize', updateStyles);
});