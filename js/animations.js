
document.addEventListener('DOMContentLoaded', 
function() 
{
  page_back = document.getElementsByClassName('page-background')[0];
  page_back.style.animation = 'appear 1s forwards';

  disappear = (e) => 
  {
    let link = e.target;
    while (link && link.tagName !== 'A') {
    link = link.parentElement;
    }

    if(!link) return;

    handler = () => {
      page_back.style.animation = 'appear 1s forwards';
      window.location.href = link.href; 
    };
    setTimeout(handler, 250);
    e.preventDefault();
    page_back.style.animation = 'disappear 1s ease-out';
  }
  
  document.addEventListener('click', disappear);

}
);
  
  
  
  
  