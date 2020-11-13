        console.log('Ready to run scripts')

        $('#bhide').click(function() {

          console.log('Button pressed');

          if ($(this).prop('checked')) {$('#cdiv').hide() 
              $('#bhide').attr("checked", false)
        }

            else {
                $('#cdiv').show()
                $('#bhide').attr("checked", true)
            }

  
            
          });

       

    console.log( "ready!" );