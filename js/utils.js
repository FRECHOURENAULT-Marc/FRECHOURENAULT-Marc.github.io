class Popup
{
  #popup;
  #p;
  #bar;
  constructor(text)
  {
    this.#popup = document.createElement('div');
    this.#popup.className = 'pop-up';
    this.#popup.style.opacity = '0';
    this.#p = document.createElement('p')
    this.#popup.appendChild(this.#p);
    this.#bar = document.createElement('div');
    this.#bar.className = 'pop-up-bar';
    this.#popup.appendChild(this.#bar);
    document.body.appendChild(this.#popup);

    this.#ShowText(text);
  }
  #destructor() 
  {
    this.#popup.remove();
    this.#p.remove();
    this.#bar.remove();
    delete(this);
  }
  #ShowText(text) 
  {
    this.#popup.classList.remove("hide"); 
    this.#popup.classList.add("show");
  
    this.#bar.style.transform = 'scaleX(1)';
    this.#bar.classList.add("unscale-x");

    this.#p.textContent = text;

    setTimeout(() => 
    {
      this.#popup.classList.add("hide"); 
      this.#popup.classList.remove("show"); 
      setTimeout(() => 
      { 
        this.#bar.classList.remove("unscale-x"); 
        this.#destructor();
      }, 1000);
    }, 2000);
  }
}

// COPY TO CLIPBOARD
document.addEventListener('DOMContentLoaded', () => 
{
  const copyButton = document.getElementsByClassName("to-clipboard");
  Array.from(copyButton).forEach(element => 
  {
   element.addEventListener("click", function () 
   {
      navigator.clipboard.writeText(element.textContent)
      new Popup(`"${element.textContent}" copié dans le presse papier !`);
   });
  })                                                    
});

function Download(file, name)
{
  const link = document.createElement("a");
  link.href = file;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  link.remove();
}



