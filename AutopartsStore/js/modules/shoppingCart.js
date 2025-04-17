//ES module for implementing the shopping cart logic

export function renderCart(message){
    console.log("Loading the products...");
    console.log(message);
}

export function initCart(){
    const btnCart = document.getElementById("link-show-cart");
    btnCart.addEventListener('click', 
        function () {
            renderCart("01...");
        });
}