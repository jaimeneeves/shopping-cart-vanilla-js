(function(){
  'use strict';

  // Box do carrinho de compras
  const cartDOM = document.querySelector('.cart');

  // Botão para adicionar produto no carrinho
  const btnAddCartDOM = document.querySelectorAll('#add-to-cart');

  // Dados do carrinho de compras
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  init();

  /**
   * Initialize
   */
  function init() {

    // Função para listar os dados do carrinho
    listCartData();

    // Função para construção dos eventos
    bindEvents();
  }

  /**
   * Função para construção dos eventos
   */
  function bindEvents() {
    btnAddCartDOM.forEach(button => {
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
  }

  /**
   * Listar dados do carrinho
   */
  function listCartData() {
    if (cart.length > 0) {
      cart.forEach(product => {
        insertItemToDOM(product);
        countCartTotal();

        btnAddCartDOM.forEach(addToCartButtonDOM => {
          const productDOM = addToCartButtonDOM.parentNode;

          if (productDOM.querySelector('.product__name').innerText === product.name) {
            handleActionButtons(addToCartButtonDOM, product);
          }
        });
      });
    }
  }

  /**
   * Função para manipular botões no carrinho
   * @param {HTMLElement} addToCartButtonDOM
   * @param {Object} product
   */
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

  /**
   * Função para incrementar item no carrinho
   * @param {Object} product
   * @param {HTMLElement} cartItemDOM
   */
  function increaseItem(product, cartItemDOM) {
    cart.forEach(cartItem => {
      if (cartItem.name === product.name) {
        cartItemDOM.querySelector('.cart__item__quantity').innerText = ++cartItem.quantity;
        cartItemDOM.querySelector('[data-action="DECREASE_ITEM"]').classList.remove('btn--danger');
        saveCart();
      }
    });
  }

  /**
   * Função para decrementar itens do carrinho
   * @param {Object} product
   * @param {HTMLElement} cartItemDOM
   * @param {HTMLElement} addToCartButtonDOM
   */
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

  /**
   * Função para remover item do carrinho
   * @param {Object} product
   * @param {HTMLElement} cartItemDOM
   * @param {HTMLElement} addToCartButtonDOM
   */
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

  /**
   * Função para limpar o carrinho
   */
  function clearCart() {
    document.querySelectorAll('.cart__item').forEach(cartItemDOM => {
      cartItemDOM.classList.add('cart__item--removed');
      setTimeout(() => cartItemDOM.remove(), 250);
    });

    cart = [];
    localStorage.removeItem('cart');
    countCartTotal();
    document.querySelector('.cart-footer').remove();

    btnAddCartDOM.forEach(addToCartButtonDOM => {
      addToCartButtonDOM.innerText = 'Comprar';
      addToCartButtonDOM.disabled = false;
    });
  }

  /**
   * Função para adicionar o rodapé do carrinho
   */
  function addCartFooter() {
    if (document.querySelector('.cart-footer') === null) {
      cartDOM.insertAdjacentHTML(
        'afterend',
        `
        <div class="cart-footer">
          <button class="btn btn--danger" data-action="CLEAR_CART">Limpar Carrinho</button>
          <span class="cart-footer__total" data-action="CHECKOUT"></span>
        </div>
      `
      );

      document.querySelector('[data-action="CLEAR_CART"]').addEventListener('click', () => clearCart());
    }
  }

  /**
   * Função para adicionar item no carrinho
   * @param {Object} product
   */
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

  /**
   * Função para calcular o valor total
   */
  function countCartTotal() {
    let itemTotal = 0;
    let cartTotal = 0;

    // Realize a multiplicação do valor do produto e sua quantidade
    cart.forEach(cartItem => itemTotal += cartItem.quantity * parseFloat(cartItem.price));

    // Valor total
    cartTotal = itemTotal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

    document.querySelector('[data-action="CHECKOUT"]').innerText = `Total da compra ${cartTotal}`;
  }

  /**
   * Função para salvar alterações no carrinho
   */
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    countCartTotal();
  }

})();
