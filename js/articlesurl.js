function slugify(text) {

  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu;
  text = text.replace(/\s*[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]+\s*$/gu, '');

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function updateURL() {
  const articles = document.querySelectorAll('.gap-xl.box-s.row.padding-xl');
  const windowHeight = window.innerHeight;
  let closestArticle = null;
  let closestDistance = Infinity;

  articles.forEach((article) => {
    const rect = article.getBoundingClientRect();
    const distanceToCenter = Math.abs(rect.top + rect.height / 2 - windowHeight / 2);
    
    if (distanceToCenter < closestDistance) {
      closestDistance = distanceToCenter;
      closestArticle = article;
    }
  });

  if (closestArticle) {
    const h4 = closestArticle.querySelector('h4');
    if (h4) {
      const slug = slugify(h4.textContent);
      const newURL = window.location.pathname + '#' + slug;
      if (window.location.hash !== '#' + slug) {
        history.replaceState(null, '', newURL);
      }
    }
  }
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

window.addEventListener('scroll', throttle(updateURL, 100));
window.addEventListener('load', updateURL);