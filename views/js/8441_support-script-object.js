

  function hideReqResp(e) {
    
    const idTarget = e.target.id.split('_')[0] + '_long';
    console.log(`idTarget: ${idTarget}`);
    const elem = document.getElementById(idTarget);
    elem.style.display === 'block' ? elem.style.display = 'none' : elem.style.display = 'block';
  };

    function hideReqResp2(e) {
    
    const idTarget = e.target.id.split('_')[0] + '_long_2';
    console.log(`idTarget: ${idTarget}, e_target_id: ${e.target.id}`);
    const elem = document.getElementById(idTarget);
    elem.style.display === 'block' ? elem.style.display = 'none' : elem.style.display = 'block';
  };

    function hideReqResp2_1(e) {
    
    const idTarget = e.target.id.split('_')[0] + '_long_2_1';
    console.log(`idTarget: ${idTarget}, e_target_id: ${e.target.id}`);
    const elem = document.getElementById(idTarget);
    elem.style.display === 'block' ? elem.style.display = 'none' : elem.style.display = 'block';
  };

    function hideReqResp3(e) {
    
    const idTarget = e.target.id.split('_')[0] + '_long_3';
    console.log(`idTarget: ${idTarget}`);
    const elem = document.getElementById(idTarget);
    elem.style.display === 'block' ? elem.style.display = 'none' : elem.style.display = 'block';
  };

    function hideReqResp3_1(e) {
    
    const idTarget = e.target.id.split('_')[0] + '_long_3_1';
    console.log(`idTarget: ${idTarget}, e_target_id: ${e.target.id}`);
    const elem = document.getElementById(idTarget);
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

Date.prototype.addHours = function(h) {        
  this.setTime(this.getTime() + (h*60*60*1000));
  return this; 
  }

SupportPageController = {



    htmlModal: 
    `<div class="modal-parent dimmer-modal" id="modalElement">
      <div class="modal-large">
        <span class="modal-label">Adminkey</span>
        <p>Adminkey приложение для агрегации данных из БД микросервисов РКК 2.0 для целей оперативного технического сопровождения. </p>
        <button class="modal-btn" id="btnModal" onclick="closeModal()">Закрыть</button>
      </div>
    </div>`,

    makeLargeModal: (label, text) => {
      return `<div class="modal-parent dimmer-modal" id="modalElement">
               <div class="modal-large-wide">
                <span class="modal-label">${label}</span>
                <p>${text}</p>
                <button class="modal-btn-large" id="btnModal" onclick="closeModal()">Закрыть</button>
               </div>
              </div>`;
  },


    showModal: () => {
      console.log('showModal');
      const divTarget = document.getElementById('modalContainer');
      const div = document.createElement('div');
      div.innerHTML = SupportPageController.htmlModal;
      document.body.insertBefore(div, divTarget);

    },

    closeModal: () => {
      console.log('closeModal');
      const modal = document.getElementById('modalElement');
      modal.parentNode.removeChild(modal);

    },


     showLoader: (placeId, spinnerHTML) => {

      if (placeId && spinnerHTML) {

        const loaderHolder = document.getElementById(placeId);
        loaderHolder.innerHTML = spinnerHTML;

      }
      
    },

    closeLoader: (targetId) => {

      if (targetId) {

        const loaderHolder = document.getElementById(targetId);
        loaderHolder.innerHTML = ``;

      }
      
    },

    BPMRequest: async () => {


      const appnum = window.location.href.split('/')[4];
      document.removeEventListener("mousemove", this.BPMRequest);
      SupportPageController.showLoaderBPM('mainBPMdataContainer');
      let appStatus = document.getElementById('appStatusSearch').innerText;
      if (appStatus === 'Ошибка') {
        appStatus = 'ERR';
      } else {
        appStatus = 'notERR';
      }
      result = await fetch(`http://localhost:3000/frontrequest/bpmdata/${appnum}/${appStatus}`, {
        method: 'GET',
        credentials: 'include'
      });
      await result;
      if (result.redirected) {
        window.location.href = result.url
      } else {
          html = await result.text();
          const parser = new DOMParser();
          doc = parser.parseFromString(html, "text/html");
          const headerBlock = doc.getElementById('headerBlock').innerHTML;
          const bpmDataContainer = doc.getElementById('bpmDataContainer').innerHTML;
          const errorContainer = doc.getElementById('errorContainer').innerHTML;
          document.getElementById('errorContainer').innerHTML = errorContainer;
          document.getElementById('headWithBPMdata').innerHTML = headerBlock;
          document.getElementById('mainBPMdataContainer').innerHTML = bpmDataContainer;
          document.getElementById('getBPMBtn').style.display = 'none';
       }
  },


    dateTimeInputValidator: () => {

      if (document.querySelector('#start').value && document.querySelector('#end').value) {

        if (document.querySelector('#additional').value || document.querySelector('#additional2').value) {


          SupportPageController.getELKlogs(
            document.querySelector('#start').value, 
            document.querySelector('#end').value, 
            document.querySelector('#additional').value,
            document.querySelector('#additional2').value);
        } else {

          SupportPageController.getELKlogs(
            document.querySelector('#start').value, 
            document.querySelector('#end').value);
        }

      } else {
        alert(`Необходимо задать период!`);
      }

    },

    dateTimeInputBlocker: () => {

      if (document.querySelector('#start').value && document.querySelector('#end').value) {

        document.querySelector('#getELKlogsWithRange').disabled = false;
        
      } else {
        document.querySelector('#getELKlogsWithRange').disabled = true;
      }

    },


     getELKlogs: async (start = 0, end = 0, additional = null, additional2 = null) => {



        (document.getElementById('getELKlogs')).removeEventListener('click', this.getELKlogs);
        (document.getElementById('getELKlogs')).style.display = 'none';
        const spinner = SupportPageController.makeSpinner('Запрос в ELK', 'Получение данных из хранилища логов');
        SupportPageController.showLoader('modalContainer', spinner);
        let params = [];
        params = (document.getElementById('elk-search-params').innerText).split(',');
        if (start && end) {
          console.log(`Period: from ${start} to ${end}`);
          start = new Date(start).toISOString();
          end = new Date(end).toISOString();
          params[2] = start;
          params[3] = end;
        }
        if (additional) {
          params.push(additional);
        }
        if (additional2) {
          params.push(additional2);
        }
        let parameters = {};
        params.forEach( (param, i) => {

          parameters = {...parameters, ['parameter'+i]: param};

        })
        console.log(`Request for ELK search with params:`+'\n');
        console.log(parameters);
        const urlELK = `http://localhost:3000/elksearch`;
        const result = await fetch(urlELK, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(parameters)
        });


        if (result.ok) {
        await result;

        if (result.redirected) {
            window.location.href = result.url
        } else {
            let response = await result.text();
            //console.log(response);
            const parser = new DOMParser();
            let doc = parser.parseFromString(response, "text/html");
            document.getElementById('elk-block-container').innerHTML = doc.getElementById('part-container').innerHTML;
            SupportPageController.closeLoader('modalContainer');

        }
        } else {
        alert(`Сетевая ошибка при получении логов , статус ответа: ${result.status}`);
        }

    },

    
    fillTimeRangeFields: () => {
    
      let hangStartTime = document.querySelector('#processData > tbody > tr:nth-child(2) > td:nth-child(8)').innerHTML ;
      
      hangStartTime = hangStartTime.split('.')[0].replace(' ', 'T');

      let StartHang = SupportPageController.timeOffsetMinutes(hangStartTime, 3, 'decrement').split('.')[0]; 
      let EndHang = SupportPageController.timeOffsetMinutes(hangStartTime, 3, 'increment').split('.')[0]; 

      document.querySelector('#start').value = StartHang;
      document.querySelector('#end').value = EndHang;

    },


    timeOffsetMinutes: (dateTime, minutes, key) => {



      dateTime = new Date(dateTime);
      dateTime = key == 'increment' ? dateTime.setMinutes(dateTime.getMinutes() + minutes) : dateTime.setMinutes(dateTime.getMinutes() - minutes);
      console.log(`timeOffsetMinutes: ${key} result date: ${new Date(dateTime).toISOString()}`);
      return new Date(dateTime).addHours(3).toISOString();


    },


spinnerMain:
  `<div class="dimmer">
    <div class='container'>
      <div class='loader'>
        <font size="5px">Ожидание выполнения: получение данных по заявке...</font>
        <font size="3px">Просьба не перезагружать страницу это увеличит время сбора данных</font>
        <div class='spinner-simple'>
        </div>
      </div>
    </div>
  </div>`,

  spinnerBPM: 
    `<div class="dimmer-bpm-loader">
    <div class='container'>
      <div class='loader-bpm'>
        <font size="5px">Ожидание выполнения: Получение данных BPM процесса...</font>
        <font size="3px">Сбор данных о процессе в среднем занимает около 2-5 секунд</font>
        <div class='spinner-simple'>
        </div>
      </div>
    </div>
  </div>`,


  makeSpinner: (text1, text2) => {
    return `<div class="dimmer-bpm-loader">
    <div class='container'>
      <div class='loader-bpm'>
        <font size="5px">Ожидание выполнения: ${text1}...</font><br>
        <font size="3px">${text2}</font>
        <div class='spinner-simple'>
        </div>
      </div>
    </div>
  </div>`;
  },


  showLoaderBPM: (id) => {

      if (id) {

        const loaderHolder = document.getElementById(id);
        loaderHolder.innerHTML = SupportPageController.spinnerBPM;

      }
    
  }

}

  
