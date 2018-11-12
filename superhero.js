'use strict'
/*
 * SuperHero Class
 */
class SuperHero {
    constructor(path,extension,name,parent,id,favourited,description){
        Object.assign(this, {path, extension, name, parent,id,favourited,description});
        this.createDiv();
    }
    createDiv(){
        // Creating a main container
        let mainContainer = document.createElement('div');
        mainContainer.classList.add('mainCont','col-xl-3','col-lg-6','col-md-6','col-sm-12');
        this.parent.appendChild(mainContainer);

        // Appending image div to main container
        let imgPlaceHolder = document.createElement('div');
        imgPlaceHolder.classList.add('imgHolder','text-center');
        imgPlaceHolder.innerHTML = `<img src="${this.path}.${this.extension}"><p class="name">${this.name}</p>`;
        mainContainer.appendChild(imgPlaceHolder);

        // Creating favourite option
        let favouriteDiv = document.createElement('div');
        favouriteDiv.classList.add('favourite');
        favouriteDiv.setAttribute('data-id',this.id);
        favouriteDiv.setAttribute('data-url',this.path);
        favouriteDiv.setAttribute('data-path',this.extension);
        favouriteDiv.setAttribute('data-name',this.name);
        favouriteDiv.setAttribute('data-description',this.description);
        imgPlaceHolder.appendChild(favouriteDiv);

        if(this.favourited == true){
            favouriteDiv.classList.add('favourited');
        }
    }
}
