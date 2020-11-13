     appstatusarr.forEach( (el, i, array) => {
            
                        statarr[i] = JSON.parse(array[i]); 
                        return statarr
                
                            })
        
                         //преобразование формата даты и времени

                            statarr.forEach( (el, i, array) => {

                                array[i].start_date = new Date (array[i].start_date)
                                array[i].start_date.addHours(3);

                                array[i].start_date = array[i].start_date.toISOString().replace('T', ' ').replace('Z', '');


                                if (array[i].end_date !== null) {

                                array[i].end_date = new Date (array[i].end_date)
                                array[i].end_date.addHours(3);
                                array[i].end_date = array[i].end_date.toString().replace('T', ' ').replace('Z', '');
                                }

                            })



         jarr3.forEach( (el, i, array) => {

                    if (array[i].date_sign !== null) {

                    array[i].date_sign = new Date (array[i].date_sign)
                    array[i].date_sign = array[i].date_sign.split('T')
                    array[i].date_sign = array[i].date_sign[0]
                    array[i].date_sign.setDate(daysign.getDate()+1)
                    array[i].date_sign = array[i].date_sign.toISOString().replace('T', ' ').replace('Z', '').split(' ');
                    array[i].date_sign = array[i].date_sign[0]
                    }


                })








                 integrationarrayjson.forEach( (el, i, array) => {

                        int_local_time[i] = new Date (array[i].interaction_ts)
                        int_local_time[i].addHours(3);
                        array[i].interaction_ts = int_local_time[i].toISOString().replace('T', ' ').replace('Z', '');


                       // array[i].interaction_ts = array[i].interaction_ts.toString().replace('T', ' ').replace('Z', '');


                    })




 <% if (params[i].date_sign !== null) { %>
 <% var sign_date = params[i].date_sign.toString(); var signstrdate = sign_date.replace('T', ' ').replace('Z', '') %>
 <% var tmp = signstrdate.split(' ');   %> 
 <% var tmp2 = tmp[1].split(':');   %> 

 <% var dateToTimezone = tmp[0] + " " + tmp2[0]+":00" + "+3 h MSK";   %> 

 <% var daysign = new Date(tmp[0]); daysign.setDate(daysign.getDate()+1); %>

 <% var day = daysign.toISOString().replace('T', ' ').replace('Z', '').split(' '); %>

 <td><%=day[0]%></td>
 <% } else { %>


 <td><%= params[i].date_sign %></td>

<% }; %>





 <% var create_date = obj2[i].creation_date.toString(); var strdate = create_date.replace('T', ' ').replace('Z', '') %>
 <% var strdate2 = create_date.replace('Z', ''); var datetime = strdate; var tmp = datetime.split(' ');   %> 
 <% var date = tmp[0].split['-']; var time = tmp[1].split[':']; var mil = tmp[1].split['.'];%> 

 <% var cd = obj2[i].date_status.toString(); var cdparsed = cd.replace('T', ' ').replace('Z', '') %>

 <% var new_date = new Date(obj2[i].creation_date); new_date.setHours(new_date.getHours + 3) %>


<%  Date.prototype.addHours = function(h) {             %>
 <% this.setTime(this.getTime() + (h*60*60*1000));%>
 <% return this; %>
<%}                                           %>

 <% var new_date2 = new Date(obj2[i].creation_date); new_date2.addHours(3); %>

 <% var new_date3 = new Date(obj2[i].date_status); new_date3.addHours(3); %>

<td><%= new_date2.toISOString().replace('T', ' ').replace('Z', '')%></td>
<th><%= new_date3.toISOString().replace('T', ' ').replace('Z', '')%></th>




    //преобразование формата даты и времени

                            statarr.forEach( (el, i, array) => {

                                array[i].start_date = new Date (array[i].start_date)
                                array[i].start_date.addHours(3);

                                array[i].start_date = array[i].start_date.toISOString().replace('T', ' ').replace('Z', '');  //корректно выводит


                                if (array[i].end_date !== null) {

                                array[i].end_date = new Date (array[i].end_date)
                                array[i].end_date.addHours(3);
                                array[i].end_date = array[i].end_date.toISOString().replace('T', ' ').replace('Z', '');
                                } 

                            })