$.confirm = function(options) {

  const modal = $.modal({
    title: options.title,
    content: options.content,
    closable: false,
    width: "400px",
    onClose() {
      modal.destroy();
    },
    footerBtns: [
      {
        text: "Отмена",
        type: "secondary",
        handler: ()=> {
          modal.close();
        }
      },
      {
        text: "Удалить",
        type: "danger",
        handler: (e)=> {
          options.cb();
          modal.close();
        }
      }
    ]
  });
  setTimeout(modal.open, 200); // для того чтобы сработала анимации при открытии попапа
}
