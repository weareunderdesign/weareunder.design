window.addEventListener('DOMContentLoaded', (event) => {
    function updateUrl(id) {
      window.history.replaceState({}, '', window.location.pathname + '#' + id);
    }

    window.addEventListener('scroll', function() {
      var articles = document.querySelectorAll('.gap-xl.view');
      var currentArticleId = '';

      articles.forEach(function(article) {
        var rect = article.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight) {
          currentArticleId = article.id;
        }
      });

      if (currentArticleId !== '') {
        updateUrl(currentArticleId);
      }
    });

    if (window.location.hash) {
      var initialId = window.location.hash.substring(1);
      updateUrl(initialId);
    }
  });