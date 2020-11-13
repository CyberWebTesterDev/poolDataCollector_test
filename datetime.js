
// function getCurrentDateTime() {
// var date = new Date()
// var currentTime = {
// 	day: date.getDate(),
// 	month: date.getMonth(),
// 	year: date.getFullYear(),
// 	hh: date.getHours(),
// 	mm: date.getMinutes(),
// 	ss: date.getSeconds()
//  	}
// if (currentTime.ss < 10) {currentTime.ss='0'+currentTime.ss}
// console.log(currentTime.day+"."+(currentTime.month+1)+"."+currentTime.year+" "+currentTime.hh+":"+currentTime.mm+":"+currentTime.ss)
// }


Date.prototype.addHours = function(h) {        
    this.setTime(this.getTime() + (h*60*60*1000));
    return this; 
    }


const getCurrentDateTime = () => {

	console.log(new Date().addHours(3).toISOString().replace('T', ' ').replace('Z', ''))

}




exports.getCurrentDateTime = getCurrentDateTime;