

  function hideReqResp(e) {
    
    const idTarget = e.target.id.split('_')[0] + '_long';
    console.log(`idTarget: ${id}`);
    const elem = document.getElementById(id);
    elem.style.display === 'block' ? elem.style.display = 'none' : elem.style.display = 'block';
  };


  function hideElement(elementID) {

    const elem = document.getElementById(elementID);

    elem.style.display === 'block' ? elem.style.display = 'none' : elem.style.display = 'block';


  }


  function showLongtext(className) {

    var elem = document.getElementsByClassName(className);

    for (let i=0; i < elem.length; i++) {

      elem[i].style.display === 'block' ? elem[i].style.display = 'none' : elem[i].style.display = 'block';

    }

}

    const htmlModal = 
    `<div class="modal-parent dimmer-modal" id="modalElement">
      <div class="modal-large">
        <span class="modal-label">Adminkey</span>
        <p>Adminkey приложение для агрегации данных из БД микросервисов РКК 2.0 для целей оперативного технического сопровождения. </p>
        <button class="modal-btn" id="btnModal" onclick="closeModal()">Закрыть</button>
      </div>
    </div>`;

    function showModal() {
      console.log('showModal');
      const divTarget = document.getElementById('modalContainer');
      const div = document.createElement('div');
      div.innerHTML = htmlModal;
      document.body.insertBefore(div, divTarget);

    }

    const closeModal = () => {
      console.log('closeModal');
      const modal = document.getElementById('modalElement');
      modal.parentNode.removeChild(modal);

    }
