document.addEventListener('DOMContentLoaded', () => 
{
  const popup = document.createElement('p');
  popup.className = 'pop-up';
  const popupBack = document.createElement('div');
  popupBack.className = 'pop-up-back';
  popupBack.appendChild(popup);
  document.body.appendChild(popupBack);

  popupBack.style.opacity = '0';
  popup.style.opacity = '0';

  ShowPopup("Test");
});
function ShowPopup(text) 
{
  const popupBack = document.getElementsByClassName('pop-up-back')[0];
  const popup = document.getElementsByClassName('pop-up')[0];

  popup.classList.add("show");
  popupBack.classList.add("show");

  popup.textContent = text;

  setTimeout(() => 
  { 
    popupBack.classList.add("hide"); 
    popup.classList.add("hide"); 
    popupBack.classList.remove("show"); 
    popup.classList.remove("show"); 
  }, 2000);
}

// COPY TO CLIPBOARDs
document.addEventListener('DOMContentLoaded', () => 
{
  const copyButton = document.getElementsByClassName("to-clipboard");
  Array.from(copyButton).forEach(element => 
  {
   element.addEventListener("click", function () 
   {
      navigator.clipboard.writeText(element.textContent)
      alert("Copié !");
   });
  })                                                    
});





