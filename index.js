let fruits = [
  {id: 1, title: 'Яблоки', price: 20, img: 'https://klike.net/uploads/posts/2019-06/1561279314_5.jpg'},
  {id: 2, title: 'Апельсины', price: 30, img: 'https://m.dom-eda.com/uploads/images/catalog/item/dfc9a3e974/3cbf3bd41c_1000.jpg'},
  {id: 3, title: 'Манго', price: 40, img: 'https://fruktlove.ru/wp-content/uploads/2018/08/mango-avstralijskoe.jpg'}
]

const toHtml = function(fruit) {
  return `
    <div class="col">
      <div class="card">
        <img style="height: 300px;" class="card-img-top" src="${fruit.img}" alt="${fruit.title}">
        <div class="card-body">
          <h5 class="card-title">${fruit.title}</h5>
          <a href="#" class="btn btn-primary" data-btn="price" data-id="${fruit.id}">Посмотреть цену</a>
          <a href="#" class="btn btn-danger" data-btn="remove" data-id="${fruit.id}">Удалить</a>
        </div>
      </div>
    </div>`;
};
const renderCards = function() {
  const html = fruits.length > 0 ? fruits.map(fruit => toHtml(fruit)).join('') : '';
  document.querySelector("#fruits").innerHTML = html;
}
renderCards(fruits);

const priceModal = $.modal({
  title: "Цена на Товар",
  closable: true,
  width: "400px",
  footerBtns: [
    {
      text: "Закрыть",
      type: "primary",
      handler: ()=> {
        priceModal.close();
      }
    }
  ]
  }
);

document.addEventListener("click", (e)=> {
  e.preventDefault();
  const btnType = e.target.dataset.btn;
  const id = +e.target.dataset.id;
  const fruit = fruits.find(item => item.id === id);

  if (btnType === "price") {
    priceModal.setContent(`<p>Цена на ${fruit.title} <strong>${fruit.price}$</strong></p>`)
    priceModal.open();
  } else if (btnType === "remove") {
  //  debugger;
    $.confirm({
      title: "Вы уверены?",
      content: `<p>Вы удаляете товар <strong>${fruit.title}</strong></p>`,
      cb: function() {
        fruits = fruits.filter(fruit => fruit.id !== id);
        renderCards(fruits);
      }
    })
  }
})
