// Wait for the document to be ready
$(document).ready(function() {
  try {
    let app = firebase.app(); // Create Firebase app

var database = firebase.database();
		// Listen to the value of description
		database.ref('/description').on('value', snapshot => {

			let description = snapshot.val(); // Store the response in a variable

			$('#version').text(description.version); // Display the version in the page
      $('#author').text(description.author); // Display the version in the page
      $('#name').text(description.name); // Display the version in the page


		});


    $("form[name='issue-tracker']").on("submit", function(event) {
       event.preventDefault();

         // Form data
       var description = $("[name='description']", this).val();
       var severity = $("[name='severity']", this).val();
       var responsible = $("[name='responsible']", this).val();

       console.log("Form submit", description, severity, responsible);

       database.ref("/issues").push({
         'description':description,
         'severity': severity,
         'responsible': responsible,
         'status' : 'open'

       });

     });



     // Listen to the value of issues
             firebase.database().ref('/issues').on('value', snapshot => {
                 let issues = snapshot.val(); // Store the response in a variable

          $('#responses li').not('.template').remove();

          $.each(issues, function(id, issue){

          var $template = $(".template").clone(false, false).removeClass("template hidden");

          // Fill the template with the form data
          $("[data-id='id']", $template).text(id);
            $("[data-id='description']", $template).text(issue.description);
          $("[data-id='severity']", $template).text(issue.severity);
          $("[data-id='status']", $template).text(issue.status);
          $("[data-id='person']", $template).text(issue.responsible);


          if (issue.status == 'open') {
            $('[data-id="open"]', $template).addClass('hidden');
            $('[data-id="close"]', $template).removeClass('hidden');
          } else {
            $('[data-id="open"]', $template).removeClass('hidden');
            $('[data-id="close"]', $template).addClass('hidden');
          }

          $('[data-id="close"]', $template).on('click', function() {
            firebase.database().ref('/issues/' + id).update({
              'status': 'close'
            });
          });

          $('[data-id="open"]', $template).on('click', function() {
            firebase.database().ref('/issues/' + id).update({
              'status': 'open'
            });
          });

          $('[data-id="delete"]', $template).on('click', function() {
       firebase.database().ref('/issues/' + id).remove();
     });


            // Append the template to the list
          $("#responses").append($template);

        });
         });




  //icite



  } catch (e) {
    console.error(e); // If there is an error log the error
  }

});
