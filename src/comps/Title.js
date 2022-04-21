import React from 'react';

const Title = () => {
  const title = document.querySelector('.title');
  const banner = document.querySelector('.banner');
  const foreground = document.querySelector('.foreground');

  window.addEventListener('scroll', function() {
  
    var scrolled = window.scrollY;
  
    title.style.transform = "translate(0px," + scrolled/2 +"%)";
    // blurredBird.style.transform = "translate(0px," + scrolled/5 +"%)";
    foreground.style.transform = "translate(0px,-" + scrolled/80 +"%)";
 
});


  return (
    <div style={{overflow: "hidden"}}>
    <div className="banner">
      <h1 className='title'>TreeWoman</h1>
    </div>
    <div className='foreground'></div>
    </div>
  )
}

export default Title;