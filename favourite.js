/*
 * Favourite Object
 */
let addFav = function (fav,id,url,extension,name,description) {
    let oldItems = JSON.parse(localStorage.getItem('itemfavs')) || [];
    let newItem = {
        'fav': fav,
        'id' : id,
        'url': url,
        'extension': extension,
        'name': name,
        'description': description
    };
    oldItems.push(newItem);
    localStorage.setItem('itemfavs', JSON.stringify(oldItems));  
};