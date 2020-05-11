Element.prototype.appendAfter = function(el) { // метод для вставки элемента после переданного el
  el.parentNode.insertBefore(this, el.nextSibling);
}

function _createModal(options) { // создаем разметку и вставляем в DOM
  const modal = document.createElement('div');
  modal.classList.add('vmodal');
  modal.insertAdjacentHTML('afterbegin', `
    <div class="modal-overlay" data-close="true">
      <div class="modal-window">
        <div class="modal-header">
          <span class="modal-title">${options.title || 'Window'}</span>
          ${options.closable ? `<span class="modal-close" data-close="true">&times;</span>` : ``}
        </div>
        <div class="modal-body" data-content>${options.content || ''}</div>
      </div>
    </div>
  `);
  document.body.appendChild(modal);
  modal.querySelector(".modal-window").style.width = `${options.width}`;
  return modal;
}

function noop() {}

function _createModalFooter(buttons = []) { // создаем отдельно кнопки в футере модалки
  if (buttons.length === 0) {
    return document.createElement("div");
  }

  const wrap = document.createElement("div");
  wrap.classList.add("modal-footer");

  buttons.forEach((item, i) => {
    const $btn = document.createElement("button");
    $btn.textContent = item.text;
    $btn.classList.add(`btn`);
    $btn.classList.add(`btn-${item.type || "secondary"}`);
    $btn.onclick = item.handler || noop;

    wrap.appendChild($btn);
  });
  return wrap;
}

$.modal = function (options) {
  const $modal = _createModal(options);
  const ANIMATION_DURATION = 200;
  let closing = false;
  let destroyed = false;
  const onClose = options.onClose;  // lifecycle hook
  
  const modal = {
    open() {
      if (destroyed) { // если был вызван destriy то не вызываем open
        return;
      }
      !closing && $modal.classList.add('open'); // если окно не в процесс closing то можем вызывать open
    },
    close() {
      closing = true;
      $modal.classList.remove('open');
      $modal.classList.add('hide'); // вешаем класс hide чтобы добавить анимацию при закрытии окна
      setTimeout(()=> {
        $modal.classList.remove('hide');
        closing = false; // window closed
        if (typeof options.onClose === "function") { // lifecycle hook
          options.onClose();
        }
      }, ANIMATION_DURATION);
    }
  };

  const footerBtn = _createModalFooter(options.footerBtns);
  footerBtn.appendAfter($modal.querySelector("[data-content]"));

  function onCloseHandler(e) {
    if (e.target.dataset.close) {
      modal.close();
    }
  }

  $modal.addEventListener("click", onCloseHandler);

  function setContent(content) {
    $modal.querySelector(".modal-body").innerHTML = content;
  }

  return Object.assign(modal, {
    destroy() {
      $modal.remove();
      $modal.removeEventListener("click", onCloseHandler);
      destroyed = true;
    },
    setContent(content) {
      $modal.querySelector("[data-content]").innerHTML = content;
    }
  });
}
