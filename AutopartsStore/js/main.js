import { fetchData } from "./modules/fetchWrapper";
import { initCart } from "./modules/cart.js";


document.addEventListener('DOMContentLoaded', initApp);



function initApp() {
    console.log("Initializing the app...");

    const linkProductsButton = document.querySelector("#link-show-cart");
    linkProductsButton.addEventListener('click', )

    btnFetchShows.addEventListener('click', fetchshows);
}

async function fetchproducts() {
    console.log("Fetching products...");
    const uri = "https://api.tvmaze.com/shows";
    const products = await fetchData(uri);
    parsheProducts(shows);
}

async function parsheProducts(products) {
    // Iterate over the shows and build a dynamic HTML table
    //1) Select the table placeholder
    const tblShows = document.getElementsByClassName("product-list");
    //loop through the list of shows
    shows.forEach(product => {

        const tr = document.createElement('div',"class = product-card")
        
        //Add a td for the show id
        createNewElement(a, 'a', show.id);
        //Add a td for the name of the show
        createNewElement(tr, 'td', show.name);
        //Add a td for the type of show
        createNewElement(tr, 'td', show.type);
        //Add a td for the language of the show
        createNewElement(tr, 'td', show.language);
        //Add a td for the genre of the show
        createNewElement(tr, 'td', show.genres);
        //Add a td for the status of the show
        createNewElement(tr, 'td', show.status);
        createNewElement(tr, 'td', show.premiered);
        const tdsite = createNewElement(tr,'td', "")
        const siteLink = createNewElement(tdsite, 'a', "Site")
        siteLink.href = show.officialSite
        const tdImage = createNewElement(tr, 'td', "")
        const siteImg = createNewElement(tdImage, 'img', "");
        siteImg.src = show.image.medium;
        siteImg.width = 50;
        siteImg.height = 50;
        //Add the new <tr> to the table body
        tblShows.appendChild(tr);
    });
}
function createNewElement(parent, elemName, content) {
    const newElem = document.createElement(elemName);
    newElem.textContent = content;
    parent.appendChild(newElem);
    return newElem;
}

//for filtering the items
const categoryFilter = document.getElementById("category");
const sortSelect = document.getElementById("sort");