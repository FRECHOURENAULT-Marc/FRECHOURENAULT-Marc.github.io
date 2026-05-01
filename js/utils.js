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

export class Box
{
  link_div;
  main_div;
  title_div;
  content_div;
  about_p;

  constructor(title, img, link = null)
  {
    if(link != null)
    {
      this.link_div = document.createElement("a");
      this.link_div.href = link;
    }

    this.main_div = document.createElement("div");
    this.main_div.classList.add("container-center-col");

    this.title_div = document.createElement("div");
    let title_p = document.createElement("p");
    title_p.innerHTML = `<strong>${title}</strong>`;
    this.title_div.appendChild(title_p);
    if(img != null)
    {
      let title_img = document.createElement("img");
      title_img.src = img;
      this.title_div.appendChild(title_img);
    }

    this.content_div = document.createElement("div");
    this.content_div.classList.add("container-center-col-independant");
    this.content_div.style = "align-items: start;";

    this.about_p = document.createElement("p");

    this.content_div.appendChild(this.about_p);
    this.main_div.appendChild(this.title_div);
    this.main_div.appendChild(this.content_div);

    if(link != null)
      this.link_div.appendChild(this.main_div);

    this.#AddToPage();
  }

  #AddToPage()
  {
    let bg = document.getElementsByClassName("page-background")[0];
    let content = bg.getElementsByClassName("page-content")[0];
    let div_found = null;
    for (let i = 0; i < content.children.length; i++) 
    {
      if (div_found != null)
        break;
      let element = content.children[i];
      let is_container_center = element.classList.contains("double-container-center");
      if (is_container_center == false)
        continue;
      let div_count = 0;
      for (let j = 0; j < element.children.length; j++)
      {
        let div = element.children[j];
        let is_container_center_col = div.classList.contains("container-center-col");
        let is_container_center_row = div.classList.contains("container-center-row");
        let is_a_container = div.href != null;
        let is_a_container_has_child_container = false;
        if( is_a_container == true)
        {
          for (let k = 0; k < div.children.length; k++)
          {
            let child = div.children[k];
            if (child.classList.contains("container-center-col") || child.classList.contains("container-center-row"))
            {
              is_a_container_has_child_container = true;
              break;
            }
          }
        }
        if (is_container_center_col == false && is_container_center_row == false && is_a_container_has_child_container == false)
          continue;
        div_count++;
      }
      if (div_count > 1)
        continue;
      div_found = element;
    }
    if (div_found == null)
    {
      let n_div = document.createElement("div");
      n_div.classList.add("double-container-center");
      n_div.style = "align-items: start;"
      content.appendChild(n_div);
      div_found = n_div;
    }
    if(this.link_div != null)
      div_found.appendChild(this.link_div);
    else
      div_found.appendChild(this.main_div);
  }

  SetID(id)
  {
    let title_p = this.title_div.getElementsByTagName("p")[0];
    title_p.id = id;
  }
  Title(title, date, image)
  {
    let title_p = this.title_div.getElementsByTagName("p")[0];
    title_p.innerHTML = `<strong>${title}</strong> ${date}`;
    let title_img = this.title_div.getElementsByTagName("img")[0];
    title_img.src = image;
  }
  AddDesc(content, endline = true)
  {
    this.about_p.innerHTML += content;
    if (endline == false)
      return;
    this.about_p.innerHTML += '<br>';
  }
  AddDescLink(link, display, exit = true, endline = true)
  {
    let n_a = document.createElement("a");
    if (exit == false)
      n_a.classList.add("no_exit");
    n_a.href = link;
    n_a.style = "text-decoration: underline;"
    n_a.innerHTML = display;
    this.about_p.appendChild(n_a);
    if (endline == false)
      return;
    this.about_p.innerHTML += '<br>';
  }
  ClearTitle()
  {
    let title_p = this.title_div.getElementsByTagName("p")[0];
    title_p.innerHTML = null;
  }
  ClearDesc()
  {
    this.about_p.innerHTML = null;
  }
  Clear()
  {
    this.ClearTitle();
    this.ClearDesc();
  }
}

export class Project extends Box
{
  lang;
  skills_p;
  links_p;

  constructor(title, date, img, lang = 'fr')
  {
    super(title, img);
    this.lang = lang;

    if(date != null)
      this.title_div.getElementsByTagName("p")[0].innerHTML = `<strong>${title}</strong> ${date}`;

    this.skills_p = document.createElement("p");
    switch(this.lang)
    {
      case 'fr':
        this.skills_p.innerHTML = '<strong>Compétences travaillées</strong> :<br>'
        break;
      case 'en':
        this.skills_p.innerHTML = '<strong>Skills</strong> :<br>'
        break;
      default:
        this.skills_p.innerHTML = '<strong>Error with language</strong> :<br>'
        break;
    }

    this.links_p = document.createElement("p");
    switch(this.lang)
    {
      case 'fr':
        this.links_p.innerHTML = '<strong>Liens</strong> :<br>'
        break;
      case 'en':
        this.links_p.innerHTML = '<strong>Links</strong> :<br>'
        break;
      default:
        this.links_p.innerHTML = '<strong>Error with language</strong> :<br>'
        break;
    }

    this.content_div.appendChild(this.skills_p);
    this.content_div.appendChild(this.links_p)            
  }

  AddSkill(skill)
  {
    this.skills_p.innerHTML += `- ${skill}<br>`;
  }
  AddLink(link, display, exit = true)
  {
    let n_a = document.createElement("a");
    if(exit == false)
      n_a.classList.add("no_exit");
    n_a.href = link;
    n_a.style = "text-decoration: underline;"
    n_a.innerHTML = display;
    this.links_p.innerHTML += '- ';
    this.links_p.appendChild(n_a);
    this.links_p.innerHTML += '<br>';
  }

  ClearSkills()
  {
    switch(this.lang)
    {
      case 'fr':
        this.skills_p.innerHTML = '<strong>Compétences travaillées</strong> :<br>'
        break;
      case 'en':
        this.skills_p.innerHTML = '<strong>Skills</strong> :<br>'
        break;
      default:
        this.skills_p.innerHTML = '<strong>Error with language</strong> :<br>'
        break;
    }
  }
  ClearLinks()
  {
    switch(this.lang)
    {
      case 'fr':
        this.links_p.innerHTML = '<strong>Liens</strong> :<br>'
        break;
      case 'en':
        this.links_p.innerHTML = '<strong>Links</strong> :<br>'
        break;
      default:
        this.links_p.innerHTML = '<strong>Error with language</strong> :<br>'
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