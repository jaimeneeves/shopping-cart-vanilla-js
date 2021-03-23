// Repositório original do código [https://github.com/diamile/shopping-cart-vanilla-js]
// Criando um carrinho de compras com JavaScript, CSS e HTML
//
// Dados que serão estudados no curso básico
// * browser localStorage
// * Eventos
// * Inserindo novo código HTML no DOM
// * Usando os métodos forEach and filter
// * Arrow functions
// * Usando códigos JavaScript dentro de string com template strings
// * Métodos querySelector e querySelectorAll

(function(){
  'use strict';


  const cartDOM = document.querySelector('.cart');
  const addToCartButtons = document.querySelectorAll('#add-to-cart');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  initialize();

  function initialize() {

    // Listar dados do carrinho
    listCartData();
  }

  addToCartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const productBOX = button.parentNode;

      const product = {
        image: productBOX.querySelector('.product__image').getAttribute('src'),
        name: productBOX.querySelector('.product__name').innerText,
        price: productBOX.querySelector('.product__price').innerText,
        quantity: 1
      };

      const isInCart = cart.filter(cartItem => cartItem.name === product.name).length > 0;

      if (!isInCart) {
      	insertItemToDOM(product);
      	cart.push(product);
      	saveCart();
      	handleActionButtons(button, product);
      }
    });
  });

  /**
   * Listar dados do carrinho
   */
  function listCartData() {
    if (cart.length > 0) {
      cart.forEach(product => {
        insertItemToDOM(product);
        countCartTotal();

        addToCartButtons.forEach(addToCartButtonDOM => {
          const productDOM = addToCartButtonDOM.parentNode;

          if (productDOM.querySelector('.product__name').innerText === product.name) {
            handleActionButtons(addToCartButtonDOM, product);
          }
        });
      });
    }
  }

  // Funtion to Handle Buttons in the cart
  function handleActionButtons(addToCartButtonDOM, product) {
    addToCartButtonDOM.innerText = 'No carrinho';
    addToCartButtonDOM.disabled = true;

    const cartItemsDOM = cartDOM.querySelectorAll('.cart__item');
    cartItemsDOM.forEach(cartItemDOM => {
      if (cartItemDOM.querySelector('.cart__item__name').innerText === product.name) {
        cartItemDOM.querySelector('[data-action="INCREASE_ITEM"]').addEventListener('click', () => increaseItem(product, cartItemDOM));
        cartItemDOM
          .querySelector('[data-action="DECREASE_ITEM"]')
          .addEventListener('click', () => decreaseItem(product, cartItemDOM, addToCartButtonDOM));
        cartItemDOM.querySelector('[data-action="REMOVE_ITEM"]').addEventListener('click', () => removeItem(product, cartItemDOM, addToCartButtonDOM));
      }
    });
  }

  // Function to increase item in cart
  function increaseItem(product, cartItemDOM) {
    cart.forEach(cartItem => {
      if (cartItem.name === product.name) {
        cartItemDOM.querySelector('.cart__item__quantity').innerText = ++cartItem.quantity;
        cartItemDOM.querySelector('[data-action="DECREASE_ITEM"]').classList.remove('btn--danger');
        saveCart();
      }
    });
  }

  // Function to decrease item in cart
  function decreaseItem(product, cartItemDOM, addToCartButtonDOM) {
    cart.forEach(cartItem => {
      if (cartItem.name === product.name) {
        if (cartItem.quantity > 1) {
          cartItemDOM.querySelector('.cart__item__quantity').innerText = --cartItem.quantity;
          saveCart();
        } else {
          removeItem(product, cartItemDOM, addToCartButtonDOM);
        }

        if (cartItem.quantity === 1) {
          cartItemDOM.querySelector('[data-action="DECREASE_ITEM"]').classList.add('btn--danger');
        }
      }
    });
  }

  // Function to remove item from cart
  function removeItem(product, cartItemDOM, addToCartButtonDOM) {
    cartItemDOM.classList.add('cart__item--removed');
    setTimeout(() => cartItemDOM.remove(), 250);
    cart = cart.filter(cartItem => cartItem.name !== product.name);
    saveCart();
    addToCartButtonDOM.innerText = 'Comprar';
    addToCartButtonDOM.disabled = false;

    if (cart.length < 1) {
      document.querySelector('.cart-footer').remove();
    }
  }

  function clearCart() {
    document.querySelectorAll('.cart__item').forEach(cartItemDOM => {
      cartItemDOM.classList.add('cart__item--removed');
      setTimeout(() => cartItemDOM.remove(), 250);
    });

    cart = [];
    localStorage.removeItem('cart');
    countCartTotal();
    document.querySelector('.cart-footer').remove();

    addToCartButtons.forEach(addToCartButtonDOM => {
      addToCartButtonDOM.innerText = 'Comprar';
      addToCartButtonDOM.disabled = false;
    });
  }

  // Function to add cart footer
  function addCartFooter() {
    if (document.querySelector('.cart-footer') === null) {
      cartDOM.insertAdjacentHTML(
        'afterend',
        `
        <div class="cart-footer">
          <button class="btn btn--danger" data-action="CLEAR_CART">Limpar Carrinho</button>
          <button class="btn btn--primary" data-action="CHECKOUT">Pay</button>
        </div>
      `
      );

      document.querySelector('[data-action="CLEAR_CART"]').addEventListener('click', () => clearCart());
      // document.querySelector('[data-action="CHECKOUT"]').addEventListener('click', () => checkout());
    }
  }

  // Function to Insert Item to DOM
  function insertItemToDOM(product) {
    cartDOM.insertAdjacentHTML(
      'beforeend',
      `
      <div class="cart__item">
        <img class="cart__item__image" src="${product.image}" alt="${product.name}" >
        <h3 class="cart__item__name">${product.name}</h3>
        <h3 class="cart__item__price">${product.price}</h3>
        <button class="btn btn--primary btn--small${product.quantity === 1 ? ' btn--danger' : ''}" data-action="DECREASE_ITEM">&minus;</button>
        <h3 class="cart__item__quantity">${product.quantity}</h3>
        <button class="btn btn--primary btn--small" data-action="INCREASE_ITEM">&plus;</button>
        <button class="btn btn--danger btn--small" data-action="REMOVE_ITEM">&times;</button>
      </div>
    `
    );

    addCartFooter();
  }

  // Function to calculate total amount
  function countCartTotal() {
    let itemTotal = 0;
    let cartTotal = 0;

    // Realize a multiplicação do valor do produto e sua quantidade
    cart.forEach(cartItem => itemTotal += cartItem.quantity * parseFloat(cartItem.price));

    // Valor total
    cartTotal = itemTotal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

    document.querySelector('[data-action="CHECKOUT"]').innerText = `Total ${cartTotal}`;
  }

  // Function to save cart on changes
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    countCartTotal();
  }

})();
