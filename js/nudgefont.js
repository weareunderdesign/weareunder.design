const fontFace = new FontFace('VcNudge', 'url(../fonts/VCNudgeBoldItalicTrial.otf)');

fontFace.load().then(function(loadedFace) {
    document.fonts.add(loadedFace);
    
    const elements = document.getElementsByClassName('nudge_font');
    for (let element of elements) {
        element.style.fontFamily = 'VcNudge';
        element.style.fontSize = '17.35vw';
        element.style.lineHeight = '89%';
    }
}).catch(function(error) {
    console.error('Font error:', error);
});