function applyResponsiveStyles() {
    const nudgeFont = document.querySelector('.nudge_font');
    const nowarpSchedule = document.querySelector('.nowarp-schedule');
    const nowarpScheduleDivs = document.querySelectorAll('.nowarp-schedule-div');
    const lines = document.querySelectorAll('.line');
    const line1 = document.querySelector('.line1');
    const scheduleDivs = document.querySelectorAll('.schedule-div');
    const dates = document.querySelectorAll('.date');
    const scheduleCircles = document.querySelectorAll('.schedule-circle');
    const scheduleColorCircles = document.querySelectorAll('.schedule-color-circle');
    const talkTexts = document.querySelectorAll('.schedule-color-circle p');
  
    const windowWidth = window.innerWidth;
  
    if (windowWidth <= 768) {
      if (nudgeFont) {
        nudgeFont.style.fontSize = '28vw';
      }
  
      if (nowarpSchedule) {
        nowarpSchedule.style.flexWrap = 'nowrap';
      }
  
      nowarpScheduleDivs.forEach(div => {
        div.style.flexWrap = 'nowrap';
      });
  
      lines.forEach(line => {
        line.style.display = 'none';
      });
      if (line1) {
        line1.style.display = 'none';
      }
  
      scheduleDivs.forEach(div => {
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'center';
        div.style.padding = '0';
      });
  
      dates.forEach(date => {
        date.style.flexDirection = 'row';
        date.style.justifyContent = 'space-between';
        date.style.alignItems = 'center';
      });
  
      const circleStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vw',
        width: '60vw',
        marginLeft: '0'
      };
  
      scheduleCircles.forEach(circle => {
        Object.assign(circle.style, circleStyles);
      });
  
      scheduleColorCircles.forEach(circle => {
        Object.assign(circle.style, circleStyles);
      });
    }
    else if (windowWidth <= 1366) {
      if (nudgeFont) {
        nudgeFont.style.fontSize = '25vw';
      }
  
      lines.forEach(line => {
        if (line.classList.contains('line1')) {
          line.style.display = 'none';
        } else {
          line.style.display = 'block';
          line.style.border = '0.5px solid black';
          line.style.transform = 'rotate(13deg)';
          line.style.marginLeft = '-4vw';
        }
      });
  
      if (nowarpSchedule) {
        nowarpSchedule.style.flexWrap = 'wrap';
      }
  
      nowarpScheduleDivs.forEach(div => {
        div.style.flexWrap = 'nowrap';
      });
  
      const tabletCircleStyles = {
        height: '15vw',
        width: '15vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      };
  
      scheduleCircles.forEach(circle => {
        Object.assign(circle.style, tabletCircleStyles);
      });
  
      scheduleColorCircles.forEach(circle => {
        Object.assign(circle.style, tabletCircleStyles);
      });
  
      scheduleDivs.forEach(div => {
        div.style.display = '';
        div.style.padding = '';
      });
  
      dates.forEach(date => {
        date.style.flexDirection = '';
        date.style.justifyContent = '';
        date.style.alignItems = '';
      });
    }
    else {
      if (nowarpSchedule) {
        nowarpSchedule.style.flexWrap = 'nowrap';
      }
  
      nowarpScheduleDivs.forEach(div => {
        div.style.flexWrap = 'nowrap';
      });
  
      dates.forEach(date => {
        date.style.flexWrap = 'nowrap';
        date.style.width = '100%';
      });
  
      scheduleCircles.forEach(circle => {
        circle.style.borderRadius = '100%';
        circle.style.height = '15vw';
        circle.style.width = '15vw';
        circle.style.border = '1px solid black';
        circle.style.marginLeft = '-6vw';
      });
  
      scheduleColorCircles.forEach(circle => {
        circle.style.borderRadius = '100%';
        circle.style.height = '15vw';
        circle.style.width = '15vw';
        circle.style.marginLeft = '-6vw';
      });
  
      lines.forEach(line => {
        line.style.border = '0.5px solid black';
        line.style.transform = 'rotate(13deg)';
        line.style.marginLeft = '-4vw';
        line.style.display = 'block';
      });
  
      talkTexts.forEach(text => {
        text.style.color = 'white';
      });
    }
  }
  
  window.addEventListener('resize', applyResponsiveStyles);
  document.addEventListener('DOMContentLoaded', applyResponsiveStyles);