'use strict'
/*
 * Modal class
 */
class Modals{
    constructor(close, open, parent, number, closeclass, path, extension, name, description){
        Object.assign(this, {close, open, number, closeclass, path, extension, name, description});
        this.parent = document.querySelector(`${parent}`);
        this.createDiv();
        this.windowClose();
        this.openModal();
    }
    createDiv(){
        let modalContent = document.createElement('div');
        modalContent.classList.add('modalContent');
        modalContent.innerHTML = `<img class="imgModal" src="${this.path}.${this.extension}"><h1>${this.name}</h1><p>${this.description}</p><span class="close">&times;</span>`;      
        this.parent.appendChild(modalContent);
    }
    windowClose(){
        window.addEventListener('click',event =>{
            if(event.target == this.parent){
                this.parent.innerHTML = '';
                this.parent.classList.remove('block');
            }
        });
    }
    openModal(){
        if(this.open == false){
          this.open = true;
          this.close = false;
          if(this.open){
            this.parent.classList.add('block');

            // Checking if there is x and closing modal on X
            let close = document.querySelector(`${this.closeclass}`);
            close.addEventListener('click',() => this.closeModal());
          }
        }else{
            this.parent.classList.add('block');
        }   
    }
    closeModal(){
        if(this.close == false){
          this.close = true;
          this.open = false;
          if(this.close){
              this.parent.innerHTML = '';
              this.parent.classList.remove('block');
          }
        }      
    }
}