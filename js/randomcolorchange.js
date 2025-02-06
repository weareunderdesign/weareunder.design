window.onload = function() {
  const elements = document.querySelectorAll('.random-color-change');
  const colors = ['#EC5A29', '#F5CA44', '#F5C2DF', '#7B5BF2', '#014add', '#3F8E45'];
  let currentIndex = 0;
  let nextIndex = 1;
  let progress = 0;
  
  function interpolateColor(color1, color2, factor) {
      const r1 = parseInt(color1.substring(1,3), 16);
      const g1 = parseInt(color1.substring(3,5), 16);
      const b1 = parseInt(color1.substring(5,7), 16);
      
      const r2 = parseInt(color2.substring(1,3), 16);
      const g2 = parseInt(color2.substring(3,5), 16);
      const b2 = parseInt(color2.substring(5,7), 16);
      
      const r = Math.round(r1 + (r2 - r1) * factor);
      const g = Math.round(g1 + (g2 - g1) * factor);
      const b = Math.round(b1 + (b2 - b1) * factor);
      
      return `#${(r < 16 ? '0' : '') + r.toString(16)}${(g < 16 ? '0' : '') + g.toString(16)}${(b < 16 ? '0' : '') + b.toString(16)}`;
  }

  function animate() {
      progress += 0.005;
      
      if (progress >= 1) {
          progress = 0;
          currentIndex = nextIndex;
          nextIndex = (nextIndex + 1) % colors.length;
      }
      
      const interpolatedColor = interpolateColor(colors[currentIndex], colors[nextIndex], progress);
      
      elements.forEach(element => {
          if(element.tagName.toLowerCase() === 'a') {
              const image = element.dataset.desktopImage;
              element.style.background = `${interpolatedColor} url(${image}) no-repeat center/cover`;
          } else if(element.classList.contains('nudge_font') || element.parentElement.classList.contains('nudge_font')) {
              element.style.color = interpolatedColor;
          } else {
              element.style.backgroundColor = interpolatedColor;
          }
      });
      
      requestAnimationFrame(animate);
  }
  
  animate();
}