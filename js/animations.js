document.addEventListener('DOMContentLoaded', () => 
{
  window.addEventListener('pageshow', () => 
  { 
    const page_back = document.getElementsByClassName('page-background')[0];
    const footer = document.getElementsByClassName('footer')[0];

    const elements = [page_back, footer];

    elements.forEach(element => {
      element.classList.add('appear');
    });

    document.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function(e) 
      {
        e.preventDefault();

        elements.forEach(element => {
          element.classList.remove('appear');
          element.classList.add('disappear');
        });
        setTimeout(() => 
        { 
          window.location.href = this.href; 
        }, 250);
      });
    })
  });                                
});
  
  
  
  
  