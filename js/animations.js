document.addEventListener('DOMContentLoaded', () => 
{
  window.addEventListener('pageshow', () => 
  { 
    const page_back = document.getElementsByClassName('page-background')[0];
    page_back.classList.add('appear');

    document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) 
    {
      e.preventDefault();
      page_back.classList.remove('appear');
      page_back.classList.add('disappear');
      setTimeout(() => 
      { 
        window.location.href = this.href; 
      }, 500);
    });
  })
});

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

});
  
  
  
  
  