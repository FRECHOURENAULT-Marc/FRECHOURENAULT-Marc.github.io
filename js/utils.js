export class Popup {
  #popup;
  #p;
  #bar;
  constructor(text) {
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
  #destructor() {
    this.#popup.remove();
    this.#p.remove();
    this.#bar.remove();
    delete (this);
  }
  #ShowText(text) {
    this.#popup.classList.remove("hide");
    this.#popup.classList.add("show");

    this.#bar.style.transform = 'scaleX(1)';
    this.#bar.classList.add("unscale-x");

    this.#p.textContent = text;

    setTimeout(() => {
      this.#popup.classList.add("hide");
      this.#popup.classList.remove("show");
      setTimeout(() => {
        this.#bar.classList.remove("unscale-x");
        this.#destructor();
      }, 1000);
    }, 2000);
  }
}

// COPY TO CLIPBOARD
document.addEventListener('DOMContentLoaded', () => {
  const copyButtonFR = document.getElementsByClassName("to-clipboard-fr");
  Array.from(copyButtonFR).forEach(element => {
    element.addEventListener("click", function () {
      navigator.clipboard.writeText(element.textContent)
      new Popup(`"${element.textContent}" copié dans le presse papier !`);
    });
  })

  const copyButtonEN = document.getElementsByClassName("to-clipboard-en");
  Array.from(copyButtonEN).forEach(element => {
    element.addEventListener("click", function () {
      navigator.clipboard.writeText(element.textContent)
      new Popup(`"${element.textContent}" copy to clipboard !`);
    });
  })
});


// Download a file (path) and name the downloaded file
function Download(file, name) {
  const link = document.createElement("a");
  link.href = file;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  link.remove();
}



export class Project
{
  #lang;
  #main_div;
  #title_div;
  #content_div;
  #about_p;
  #skills_p;
  #links_p;

  constructor(title, date, img, lang = 'fr')
  {
    this.#lang = lang;
    this.#main_div = document.createElement("div");
    this.#main_div.classList.add("container-center-col");

    this.#title_div = document.createElement("div");
    let title_p = document.createElement("p");
    title_p.innerHTML = `<strong>${title}</strong> ${date}`;
    let title_img = document.createElement("img");
    title_img.src = img;

    this.#title_div.appendChild(title_p);
    this.#title_div.appendChild(title_img);

    this.#content_div = document.createElement("div");
    this.#content_div.classList.add("container-center-col-independant");
    this.#content_div.style = "align-items: start;";

    this.#about_p = document.createElement("p");

    this.#skills_p = document.createElement("p");
    switch(this.#lang)
    {
      case 'fr':
        this.#skills_p.innerHTML = '<strong>Compétences travaillées</strong> :<br>'
        break;
      case 'en':
        this.#skills_p.innerHTML = '<strong>Skills</strong> :<br>'
        break;
      default:
        this.#skills_p.innerHTML = '<strong>Error with language</strong> :<br>'
        break;
    }

    this.#links_p = document.createElement("p");
    switch(this.#lang)
    {
      case 'fr':
        this.#links_p.innerHTML = '<strong>Liens</strong> :<br>'
        break;
      case 'en':
        this.#links_p.innerHTML = '<strong>Links</strong> :<br>'
        break;
      default:
        this.#links_p.innerHTML = '<strong>Error with language</strong> :<br>'
        break;
    }

    this.#content_div.appendChild(this.#about_p);
    this.#content_div.appendChild(this.#skills_p);
    this.#content_div.appendChild(this.#links_p);

    this.#main_div.appendChild(this.#title_div);
    this.#main_div.appendChild(this.#content_div);

    // Add in page
    let bg = document.getElementsByClassName("page-background")[0];
    let content = bg.getElementsByClassName("page-content")[0];
    let div_found = null;
    for (let i = 0; i < content.children.length; i++) 
      {
        if(div_found != null)
          break;

        let element = content.children[i];
        if(element.classList.contains("double-container-center") == false)
          continue;

        let div_count = 0;
        for (let j = 0; j < element.children.length; j++)
        {
          let div = element.children[j];
          if(div.classList.contains("container-center-col") == false && div.classList.contains("container-center-row") == false)
            continue;
          div_count++;
        }
        if(div_count > 1)
          continue;
        div_found = element;
    }
    if(div_found == null)
    {
      let n_div = document.createElement("div");
      n_div.classList.add("double-container-center");
      n_div.style = "align-items: start;"
      content.appendChild(n_div);
      div_found = n_div;
    }
    div_found.appendChild(this.#main_div);
  }

  SetID(id)
  {
    let title_p = this.#title_div.getElementsByTagName("p")[0];
    title_p.id = id;
  }
  Title(title, date, image)
  {
    let title_p = this.#title_div.getElementsByTagName("p")[0];
    title_p.innerHTML = `<strong>${title}</strong> ${date}`;
    let title_img = this.#title_div.getElementsByTagName("img")[0];
    title_img.src = image;
  }
  AddDesc(content, endline = true)
  {
    this.#about_p.innerHTML += content;
    if(endline == false)
      return;
    this.#about_p.innerHTML += '<br>';
  }
  AddDescLink(link, display, exit = true, endline = true)
  {
    let n_a = document.createElement("a");
    if(exit == false)
      n_a.classList.add("no_exit");
    n_a.href = link;
    n_a.style = "text-decoration: underline;"
    n_a.innerHTML = display;
    this.#about_p.appendChild(n_a);
    if(endline == false)
      return;
    this.#about_p.innerHTML += '<br>';
  }
  AddSkill(skill)
  {
    this.#skills_p.innerHTML += `- ${skill}<br>`;
  }
  Addlink(link, display, exit = true)
  {
    let n_a = document.createElement("a");
    if(exit == false)
      n_a.classList.add("no_exit");
    n_a.href = link;
    n_a.style = "text-decoration: underline;"
    n_a.innerHTML = display;
    this.#links_p.innerHTML += '- ';
    this.#links_p.appendChild(n_a);
    this.#links_p.innerHTML += '<br>';
  }

  ClearTitle()
  {
    let title_p = this.#title_div.getElementsByTagName("p")[0];
    title_p.innerHTML = null;
  }
  ClearDesc()
  {
    this.#about_p.innerHTML = null;
  }
  ClearSkills()
  {
    switch(this.#lang)
    {
      case 'fr':
        this.#skills_p.innerHTML = '<strong>Compétences travaillées</strong> :<br>'
        break;
      case 'en':
        this.#skills_p.innerHTML = '<strong>Skills</strong> :<br>'
        break;
      default:
        this.#skills_p.innerHTML = '<strong>Error with language</strong> :<br>'
        break;
    }
  }
  ClearLinks()
  {
    switch(this.#lang)
    {
      case 'fr':
        this.#links_p.innerHTML = '<strong>Liens</strong> :<br>'
        break;
      case 'en':
        this.#links_p.innerHTML = '<strong>Links</strong> :<br>'
        break;
      default:
        this.#links_p.innerHTML = '<strong>Error with language</strong> :<br>'
        break;
    }

  }
  Clear()
  {
    this.ClearTitle();
    this.ClearDesc();
    this.ClearSkills();
    this.ClearLinks();
  }

}