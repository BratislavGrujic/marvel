window.onload = function(){
    'use strict'
    /*
     * Global variables
     */
    const container         = document.querySelector('.js-contentWrapper'),
          search            = document.getElementById('search'),
          next              = document.getElementById('next'),
          paginationWrapper = document.getElementById('js-pagination'),
          loader            = document.getElementById('loader'),
          listWrapper       = document.querySelector('.js-listWrapper'),
          prev              = document.getElementById('prev');
    let counter  = 0, 
        localRes = JSON.parse(localStorage.getItem('itemfavs')),
        activePageNumber;

    // Checking if localStorage is empty
    if (localRes != null) {
        
        // Making a new SuperHero for every localStorage result
        [].forEach.call(localRes,(eres,ekey)=> {
            let superHero = new SuperHero(eres.url,eres.extension,eres.name,container,eres.id,true,eres.description);

            // Querying all images and making modals
            let heroes = document.querySelectorAll('.imgHolder > img');
            [].forEach.call(heroes,(e,key)=> {  
                e.addEventListener('click',()=> {
                    if (ekey == key) {
                        let modal = new Modals(true,false,'.js-content',ekey,'.close',eres.url,eres.extension,eres.name,eres.description);
                    }
                });
            });
        });
    
        // Querying all favourited items and looping through them
        let favs = document.querySelectorAll('.favourited');
        [].forEach.call(favs,(e,key)=> {
            e.addEventListener('click',()=> {
                favourite(favs,key);
            });
        });
    }

    /*
     * Main Search function
     */
    search.addEventListener('keyup',debounce(()=> {
        let result = search.value.toLowerCase();
        container.innerHTML = '';
        paginationWrapper.innerHTML = '';
        counter = 0;
        prev.classList.add('notBlock');
        loader.classList.remove('none');

        // If input is empty when users search
        if (result == '') {
            container.innerHTML = '';
            next.classList.add('notBlock');
            let localRes = JSON.parse(localStorage.getItem('itemfavs'));
            activePageNumber = 0;
            loader.classList.add('none');
            container.classList.remove('text-center');

            // Making a new SuperHero for every localStorage result
            if (localRes != null) {
                [].forEach.call(localRes,(eres,ekey)=> {
                    let superHero = new SuperHero(eres.url,eres.extension,eres.name,container,eres.id,true,eres.description);
                    // Querying all images and making modals
                    let heroes = document.querySelectorAll('.imgHolder > img');
                    [].forEach.call(heroes,(e,key)=> {  
                        e.addEventListener('click',()=> {
                            if (ekey == key) {
                                let modal = new Modals(true,false,'.js-content',ekey,'.close',eres.url,eres.extension,eres.name,eres.description);
                            }
                        });
                    });
                });
            }
            // Querying all favourited items and looping through them
            let favs = document.querySelectorAll('.favourited');
            [].forEach.call(favs,(e,key)=> {
                e.addEventListener('click',()=> {
                    favourite(favs,key);
                });
            });
        }
        // If input is not empty fetching API
        else{
            fetch(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${result}&limit=20&offset=${counter}&ts=thesoer&apikey=6c6fa16d5603a4384eef117307193686&hash=21cfcd63d0a1e4ae40943ca385863023`)
            .then(response => response.json())
            .then(json => {
                loader.classList.add('none');
                let dataRes = json.data.results;
                if (json.data.total == 0) {
                    container.innerHTML = `<h1 class="noHero">There is no hero with "${result}" name </h1>`;
                    container.classList.add('text-center');
                }
                else {
                    // Getting number of pages and making list of them
                    container.classList.remove('text-center');
                    activePageNumber = 0;
                    let numberOfPages = Math.ceil(json.data.total / 20);
                    for (let i = 0; i < numberOfPages; i++) {
                        let pagination = document.createElement('ul');
                        pagination.classList.add('pagination');
                        pagination.innerHTML = `<li class="page-item"><a class="page-link" href="#">${i + 1}</a></li>`;
                        paginationWrapper.appendChild(pagination);    
                    }
                    // Setting active class to page and fetching data for that page
                    let pages = document.querySelectorAll('.pagination');
                    pages[0].firstChild.classList.add('active');
                    [].forEach.call(pages,(e,key)=> { 
                        // Hover page for list of names
                        e.addEventListener('mouseover',()=> {
                            let offSet = key * 20;
                            let topPos = pages[key].offsetTop;
                            let leftPos = pages[key].offsetLeft - pages[key].offsetWidth;   
                            listWrapper.classList.remove('notBlock');
                            fetch(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${result}&limit=20&offset=${offSet}&ts=thesoer&apikey=6c6fa16d5603a4384eef117307193686&hash=21cfcd63d0a1e4ae40943ca385863023`)
                            .then(response => response.json())
                            .then(json => {
                                let res = json.data.results;
                                [].forEach.call(res,(element)=> {
                                    let list = document.querySelector('.list');
                                    let listElement = document.createElement('li');
                                    listElement.innerHTML = `${element.name}`;
                                    list.appendChild(listElement);
                                    let width = listWrapper.offsetWidth / 4;
                                    listWrapper.style.top = `${topPos + 50}px`;
                                    listWrapper.style.left = `${leftPos - width}px`;
                                });      
                            });
                        });
                        e.addEventListener('mouseout',()=> {
                            let list = document.querySelector('.list');
                            list.innerHTML = '';
                            listWrapper.classList.add('notBlock');
                        });
                        
                        // Changing page
                        e.addEventListener('click',()=> {
                            container.innerHTML = '';
                            counter = key * 20;
                            const active = document.querySelector('.active');
                            if (active) active.classList.remove('active');
                            activePageNumber = key;
                            pages[key].firstChild.classList.add('active');
                            loader.classList.remove('none');
                            fetch(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${result}&limit=20&offset=${counter}&ts=thesoer&apikey=6c6fa16d5603a4384eef117307193686&hash=21cfcd63d0a1e4ae40943ca385863023`)
                            .then(response => response.json())
                            .then(json => {
                                let res = json.data.results;
                                loader.classList.add('none');
                                [].forEach.call(res,(eres,ekey)=> {
                                    let superHero = new SuperHero(eres.thumbnail.path,eres.thumbnail.extension,eres.name,container,eres.id,false,eres.description);

                                    // Querying all images and making modals
                                    let heroes = document.querySelectorAll('.imgHolder > img');
                                    [].forEach.call(heroes,(e,key)=> {  
                                        e.addEventListener('click',()=> {
                                            if (ekey == key) {
                                                let modal = new Modals(true,false,'.js-content',ekey,'.close',eres.thumbnail.path,eres.thumbnail.extension,eres.name,eres.description);
                                            }
                                        });
                                    });
                                });
                                
                                // Removing and adding next button
                                if (res.length < 20) next.classList.add('notBlock');
                                else next.classList.remove('notBlock');

                                // Removing and adding previous button
                                if (counter == 0) prev.classList.add('notBlock');
                                else prev.classList.remove('notBlock');
                        
                                // Querying all favourited items and looping through them
                                let favs = document.querySelectorAll('.favourite');
                                [].forEach.call(favs,(e,key)=>{
                                    e.addEventListener('click',()=>{
                                        favourite(favs,key);
                                    });
                                });
                            });   
                        });    
                    });
                }
                
                // Checking if there is more items to be shown
                if (dataRes.length < 20) next.classList.add('notBlock');
                else next.classList.remove('notBlock');

                // Making new items
                [].forEach.call(dataRes,(e,ekey)=> {
                   let superHero = new SuperHero(e.thumbnail.path,e.thumbnail.extension,e.name,container,e.id,false,e.description);
                   // Querying all images and making modals
                   let heroes = document.querySelectorAll('.imgHolder > img');
                   [].forEach.call(heroes,(ehero,key)=> {  
                       ehero.addEventListener('click',()=> {
                           if (ekey == key) {
                               let modal = new Modals(true,false,'.js-content',ekey,'.close',e.thumbnail.path,e.thumbnail.extension,e.name,e.description);
                           }
                       });
                   });
                });
                // Querying all favourited items and looping through them
                const favs = document.querySelectorAll('.favourite');
                [].forEach.call(favs,(efav,keyfav)=> {
                    efav.addEventListener('click',()=> {
                        favourite(favs,keyfav); 
                    });
                });
            });  
        }
    },250));  
    
    /*
     * Next page of results
     */
    next.addEventListener('click',()=> {
        // Preventing fast clicks, getting value from input, incrementing counter
        next.setAttribute('disabled',true);
        let result = search.value.toLowerCase();
        counter = counter + 20;
        container.innerHTML = '';
        loader.classList.remove('none');
        // Getting and making active page
        const active = document.querySelector('.active');
        let pages = document.querySelectorAll('.pagination');
        if (active) active.classList.remove('active');
        pages[activePageNumber+1].firstChild.classList.add('active');
        activePageNumber++;  
        prev.classList.remove('notBlock');
        fetch(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${result}&limit=20&offset=${counter}&ts=thesoer&apikey=6c6fa16d5603a4384eef117307193686&hash=21cfcd63d0a1e4ae40943ca385863023`)
        .then(response => response.json())
        .then(json => {
            let dataRes = json.data.results;
            loader.classList.add('none');
            // Checking if there is more items to be shown
            if (dataRes.length < 20) next.classList.add('notBlock');

            // Making new items
            [].forEach.call(dataRes,(e,ekey)=> {
                let superHero = new SuperHero(e.thumbnail.path,e.thumbnail.extension,e.name,container,e.id,false,e.description);
                // Querying all images and making modals
                let heroes = document.querySelectorAll('.imgHolder > img');
                [].forEach.call(heroes,(ehero,key)=> {  
                    ehero.addEventListener('click',()=> {
                        if (ekey == key) {
                            let modal = new Modals(true,false,'.js-content',ekey,'.close',e.thumbnail.path,e.thumbnail.extension,e.name,e.description);
                        }
                    });
                });
            });

            // Querying all favourited items and looping through them
            const favs = document.querySelectorAll('.favourite');
            [].forEach.call(favs,(efav,keyfav)=> {
                efav.addEventListener('click',()=> {
                    favourite(favs,keyfav); 
                });
            });
            // Removing disabled attribute after function is done
            next.removeAttribute('disabled');
        });
    });

    /*
     * Previous page of results
     */
    prev.addEventListener('click',()=> {
        // Preventing fast clicks, getting value from input, decrementing counter
        let result = search.value.toLowerCase();
        prev.setAttribute('disabled',true);
        counter = counter - 20;
        container.innerHTML = '';
        loader.classList.remove('none');
        
        // Getting and making active page
        const active = document.querySelector('.active');
        let pages = document.querySelectorAll('.pagination');
        if (active) active.classList.remove('active');
        pages[activePageNumber-1].firstChild.classList.add('active');
        activePageNumber--;
        
        // Checking if there is not more items to be shown
        if(counter == 0) prev.classList.add('notBlock');
        next.classList.remove('notBlock');
        fetch(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${result}&limit=20&offset=${counter}&ts=thesoer&apikey=6c6fa16d5603a4384eef117307193686&hash=21cfcd63d0a1e4ae40943ca385863023`)
        .then(response => response.json())
        .then(json => {
            let dataRes = json.data.results;
            loader.classList.add('none');
            // Making new items
            [].forEach.call(dataRes,(e,reskey)=> {
                let superHero = new SuperHero(e.thumbnail.path,e.thumbnail.extension,e.name,container,e.id,false,e.description);
                // Querying all images and making modals
                let heroes = document.querySelectorAll('.imgHolder > img');
                [].forEach.call(heroes,(ehero,key)=>{  
                    ehero.addEventListener('click',()=>{
                        if (reskey == key) {
                            let modal = new Modals(true,false,'.js-content',reskey,'.close',e.thumbnail.path,e.thumbnail.extension,e.name,e.description);
                        }
                    });
                });
            });

            // Querying all favourited items and looping through them
            const favs = document.querySelectorAll('.favourite');
            [].forEach.call(favs,(efav,keyfav)=> {
                efav.addEventListener('click',()=> {
                        favourite(favs,keyfav);
                });
            });
            // Removing disabled attribute after function is done
            prev.removeAttribute('disabled');
        });    
    });
/* aa*/
    /*
     * Returns a function, that, as long as it continues to be invoked, will not be triggered. The function will be called after it stops being called for N milliseconds.
     * If `immediate` is passed, trigger the function on theleading edge, instead of the trailing.
     */
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            let context = this, args = arguments;
            let later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    /*
     * Main function for favouriting items
     */
    function favourite(favs,keyfav){
        let containClass = favs[keyfav].classList.contains('favourited'),
            likeIdGet    = favs[keyfav].getAttribute('data-id'),
            url          = favs[keyfav].getAttribute('data-url'),
            path         = favs[keyfav].getAttribute('data-path'),
            name         = favs[keyfav].getAttribute('data-name'),
            description  = favs[keyfav].getAttribute('data-description'),
            localRes     = JSON.parse(localStorage.getItem('itemfavs'));
        // Checking if item is already favourited
        if (containClass == true) {
            favs[keyfav].classList.remove('favourited');	
            if (localStorage.getItem("itemfavs") != null) {
                [].forEach.call(localRes,function(elres){
                    if (likeIdGet == elres.id) {
                        // Filtering localStorage
                        const filteredItems = localRes.filter(efaved => efaved.id != likeIdGet);
                        localStorage.setItem('itemfavs', JSON.stringify(filteredItems));
                    }  
                });
            }	
        }
        else {
            favs[keyfav].classList.add('favourited');
            if (localStorage.getItem("itemfavs") != null) {
                [].forEach.call(localRes,function(elres){
                    if (likeIdGet == elres.id) {
                        // Filtering localStorage
                        const filteredItems = localRes.filter(efaved => efaved.id != likeIdGet);
                        localStorage.setItem('itemfavs', JSON.stringify(filteredItems));
                    }  
                });
            }
            // Adding new item in localStorage
            addFav(true,likeIdGet,url,path,name,description);
        }
    }
}//end of onload function