var mysql = require('./mysql')
var dateTime = require('./datetime')
const readline = require('readline')
const request = require('request-promise')
const {Pool, Client} = require('pg')
const openurl = require('openurl')
var query = "select * from test_instances;"
var query2 = "select * from waiting_instances;"
var ifParse = false

main = () => {


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

var appnum



var pgcon = false
var needParse = false

const clientCam = new Client({
  user: 'userName',
  host: 'localhost',
  database: 'camunda_db',
  password: 'password',
  port: 5432,
})

connectionExec = () => {clientCam.connect( (err) => {if (err) throw err;
    dateTime.getCurrentDateTime()
    console.log('Connection to DB established...\n')
    pgcon = true
    readInput();
  })
}

connectionExec();

httpReqExecutor = (p1) => {

  clientCam.query(p1, (err, res) => { if (err) throw err;
    let rstr =  JSON.stringify(res.rows[0])
    let rjson = JSON.parse(rstr) 

    res.rows.forEach( (el, i, array) => 
    {
      let rstr2 = JSON.stringify(res.rows[i])
      let rjsn2 = JSON.parse(rstr2)
      return rjson2 = rjsn2
    })

      let reqconf = {
        method: 'GET',
        uri: `http://localhost:3000/process/${rjson2.scheme_name}/${rjson2.id_}`
    
      }
          dateTime.getCurrentDateTime()
          console.log(`Calling GET-request ${reqconf.uri}...`+'\n')
    
      request(reqconf)
        .then(res => {
          dateTime.getCurrentDateTime()
          console.log('GET-request has been successfully completed...\n')
          openurl.open(reqconf.uri)
        })
        .catch(err => {
          dateTime.getCurrentDateTime()
          console.log('Unexpected error '+err+'\n')
         })
    
         setTimeout(() => {
          readInput();
        

      })
})
}



externalQueryExecutor = (input) => {

  dateTime.getCurrentDateTime()
  console.log('External request has been received...\n')
  sqlext.values[0] = input
  client.query(input, (err, res) => { if (err) throw err;
  
  let str =  JSON.stringify(res.rows[0]) //парсим массив данных в строку
  let json = JSON.parse(str) 
  res.rows.forEach( (el, i, array) => 
    {
    let str2 = JSON.stringify(res.rows[i])
    let jsn2 = JSON.parse(str2)
    return jsonlev1 = jsn2

})
 return jsonlev2 = jsonlev1
})

return jsonlev3 = jsonlev2
}





function QueryExecutorP(input){
        
  dateTime.getCurrentDateTime()
  console.log(`Request is processing for the appnum ${input}`+'\n')
  sql2.values[0] = input
  //sqltest.values[0] = input
  return new Promise ((resolve, reject) => {
  clientCam.query(sql2, (err, res) => { 
      
      if (err) {throw err;}
   
      let arrstr2 = new Array();
      let extjsonarr = new Array();  
      res.rows.forEach( (el, i, array) => 
        {
        arrstr2[i] = JSON.stringify(array[i])
        extjsonarr[i] = JSON.parse(arrstr2[i])
       // console.log(arrstr2[i]+'\n')  
        
        return arrstr2
        
        }); 
        //console.log(extjsonarr[0].scheme_name);
       /* setTimeout(() => {
          console.log('\n'+`The scheme is: ${jsonarr[jsonarr.length-1].proc_def_key_} and version is ${jsonarr[jsonarr.length-1].ver}`+'\n')
          console.log(`And the executionID is: ${jsonarr[jsonarr.length-1].execution_id_} and actual state is ${jsonarr[jsonarr.length-1].act_inst_state_}`+'\n')
        }, 300);
        */
        resolve(arrstr2)
    });

  
    
  })
 //return output


}




queryExecutor = (queryparam, response) => {


  dateTime.getCurrentDateTime()
  console.log('Processing query...\n')

  clientCam.query(queryparam, (err, res) => { if (err) throw err;
  let str =  JSON.stringify(res.rows[0]) //парсим массив данных в строку
  let json = JSON.parse(str) //парсим строку в объект json
  //console.log(resultparsed.rows.id_)
  //console.log(res)
  //console.log(res.rows[0]) //вывод определенной строки
  let arrstr2 = new Array();
  let jsonarr = new Array();  
  res.rows.forEach( (el, i, array) => 
    {
    //arrstr2[i] = JSON.stringify(array[i])
    //jsonarr[i] = JSON.parse(arrstr2[i])
    //console.log(arrstr2[i] + '\n') //выводим строку
    console.log(res.rows[i] + '\n')
    //console.log(jsonarr[i]); //выводим json
   // console.log('\n')
   
    return jsonarr
  
    }) //вывод массива данных

    /*
    setTimeout(() => {
      console.log('\n'+`The final id is: ${jsonarr[jsonarr.length-1].id_} and created in ${jsonarr[jsonarr.length-1].create_date}`+'\n')
      console.log(`And the previous id is: ${jsonarr[jsonarr.length-2].id_} and created in ${jsonarr[jsonarr.length-2].create_date}`+'\n')
    }, 300);
*/
  //console.log(json)
  setTimeout(() => {  
  readInput();
}, 3000);

return jsonarr

})

//return extjson = jsonarr

}

connectionClose = () => {

    clientCam.end( (err) => {if (err) throw err; 
          dateTime.getCurrentDateTime()
          console.log('Connection to DB closed...\n')
          process.exit(0) 

      })
}

queryRouter = (command) => {

  dateTime.getCurrentDateTime()
  console.log('Inbound command has been catched\n')
 

switch (command) {

case 'stop': connectionClose(); break;

case 'sql': dateTime.getCurrentDateTime(); 
console.log('SQL query executing...\n'); 
queryExecutor(sql); 
break;

case 'sql2':  rl.question("Enter the AppNum: ", (appnum) => {


  QueryExecutorP(appnum).then((arrstr2) => { 

    dateTime.getCurrentDateTime()
    console.log(`Result for ${appnum}`+'\n')
    let jarr = [];
    arrstr2.forEach( (el, i, array) => {
        
        jarr[i] = JSON.parse(arrstr2[i]); 
        console.log(arrstr2[i] + '\n') //выводим строку
        return jarr
    })
    //let jarrjs = JSON.parse(jarr);
    //let jsonres = JSON.parse(arrstr2);
    //let keysobj = [];
    //console.log(`keys is ${keysobj}`+'\n')
    
    console.log('\n'+`The scheme is: ${jarr[jarr.length-1].proc_def_key_} and version is ${jarr[jarr.length-1].ver}`+'\n')
    console.log(`And the executionID is: ${jarr[jarr.length-1].execution_id_} and actual state is ${jarr[jarr.length-1].act_inst_state_}`+'\n')
    setTimeout(() => {
      readInput();
    }, 3000);
    //res.json(arrstr2)
}).catch((err) => {throw err;})

/*
dateTime.getCurrentDateTime(); 
console.log('SQL query executing...\n'); 
sql2.values[0] = appnum;

queryExecutor(sql2); 
*/
})
break;

case 'send': rl.question("Enter the AppNum: ", (appnum) => {

  dateTime.getCurrentDateTime(); 
  console.log('Collecting data to make HTTP request...\n'); 
  sql3.values[0] = appnum;
  httpReqExecutor(sql3) 

  })
  break;

default: console.log('You have entered an unknown command, please reenter'); 
readInput();
      }

    }



readInput = () => { rl.question("Enter command: ", (answer) => {

  queryRouter(answer); 

})
}
}

main();














exports.main = main;

exports.pgdb = connectionExec;

exports.pgdb = externalQueryExecutor;
