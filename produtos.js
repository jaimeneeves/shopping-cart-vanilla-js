const Produtos = {

  // Listar todos os produtos
  listarTodosProdutos: () => {
    const items = [
      {
        "_id": 1,
        "name": "CHATEAU DE SAINT COSME",
        "year": "2009",
        "grapes": "Grenache / Syrah",
        "country": "France",
        "region": "Southern Rhone",
        "description": "The aromas of fruit and spice give one a hint of the light drinkability of this lovely wine, which makes an excellent complement to fish dishes.",
        "picture": "saint_cosme.jpg"
      },
      {
        "_id": 2,
        "name": "LAN RIOJA CRIANZA",
        "year": "2006",
        "grapes": "Tempranillo",
        "country": "Spain",
        "region": "Rioja",
        "description": "A resurgence of interest in boutique vineyards has opened the door for this excellent foray into the dessert wine market. Light and bouncy, with a hint of black truffle, this wine will not fail to tickle the taste buds.",
        "picture": "lan_rioja.jpg"
      },
      {
        "_id": 3,
        "name": "MARGERUM SYBARITE",
        "year": "2010",
        "grapes": "Sauvignon Blanc",
        "country": "USA",
        "region": "California Central Cosat",
        "description": "The cache of a fine Cabernet in ones wine cellar can now be replaced with a childishly playful wine bubbling over with tempting tastes of black cherry and licorice. This is a taste sure to transport you back in time.",
        "picture": "margerum.jpg"
      }
    ];
    return items;
  }
};
