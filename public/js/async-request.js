(async () => {
  console.log("Async function has been called");

  const spinnerBPM = `<div class="dimmer">
      <div class='container'>
        <div class='loader'>
          <font size="5px">Ожидание выполнения: Получение данных BPM процесса...</font>
          <font size="3px">Сбор данных о процессе может занять большее время</font>
          <div class='spinner-simple'>
          </div>
        </div>
      </div>
    </div>`;

  const appnum = window.location.href.split("/")[4];
  try {
    const result = await fetch(`http://localhost:3000/frontrequest/aggregatedatafromdblight/${appnum}`);
    const html = await result.text();
    document.body.innerHTML = html;
    //const direction = document.querySelector('#mainDataTable > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > font:nth-child(1)').innerText;
    //const status = document.querySelector('#mainDataTable > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(8) > font:nth-child(1)').innerText;
    const bpmBlock = document.getElementById("bpmDataContainer");
    bpmBlock.innerHTML = spinnerBPM;
    //document.body.insertBefore(div, divTarget);
    console.log("Sending request for BPM data");
    const resultBPM = await fetch(`http://localhost:3000/frontrequest/bpmdata/${appnum}`);
    const html2 = await result.text();
    bpmBlock.innerHTML = html2;
  } catch (e) {
    console.error(e);
    document.body.innerHTML = e;
  }
})();
