$(document).on("click", ".saver", function() {
    var newsData = $(this).attr('data-button');
    console.log(newsData);
    if(newsData) {
    var data = $.parseJSON(newsData);

    var selected = $(this).parent();
    console.log(data);
    $.ajax({
            method: "POST",
            url: "/articles/",
            data: {
                title: data.title,
                link: data.link
            }
        })
        .done(function(data) {
          //  console.log(data);
            selected.remove();

        });
    }
});

$(document).on("click", "#scrapArticles", function() {
    $.ajax({
            method: "GET",
            url: "/scrape"
        })
        // With that done, add the note information to the page
        .done(function(data) {

            $("#articles").empty();
            for (var i = 0; i < data.length; i++) {
                var newData= JSON.stringify(data[i]).replace(/\'/g, '');
                // Display the apropos information on the page
                $("#articles").append("<p class=well>" + data[i].title +
                    // "<input type=hidden class=title value=" + data[i].link + ">" +
                    "<button class='saver btn btn-success btn-sm pull-right' data-button='" +
                    newData + "'>Save Article</button><br />" +
                    data[i].link + "</p>");

            }
        });
});


$(document).on("click", "#savedArticle", function() {
    $("#articles").empty();
    $.ajax({
            method: "GET",
            url: "/articles"
        })
        // With that done, add the note information to the page
        .done(function(data) {
            $("#articles").empty();
            for (var i = 0; i < data.length; i++) {
                $("#articles").append("<p class=well>" + data[i].title +
                    "<button class='articleNotes btn btn-info btn-sm pull-right' data-id='" +
                    data[i]._id + "'>Article Notes</button>" +
                    "<button class='deleteFromSaved btn btn-danger btn-sm pull-right' data-id='" +
                    data[i]._id + "'>Delete From Saved</button><br />" +
                    data[i].link + "</p>");
            }
        });

});
$(document).on("click", ".deleteFromSaved", function() {
    var selected = $(this).parent();
    // Make an AJAX GET request to delete the specific note
    // this uses the data-id of the p-tag, which is linked to the specific note

    $.ajax({
        type: "GET",
        url: "/delete/" + selected.attr("data-id"),
        success: function(response) {
            selected.remove();
        }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
        // With that done
        .done(function(data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});


$(document).on("click", ".deleteNote", function() {

    // Make an AJAX GET request to delete the specific note
    // this uses the data-id of the p-tag, which is linked to the specific note
    var thisId = $(this).attr("data-id");

    $.ajax({
        type: "GET",
        url: "/notes/delete/" + thisId,
        success: function(response) {
            $("#oldNote").remove();
        }
    });
});

$(document).on("click", ".articleNotes", function() {

    $("#notes").empty();

    var thisId = $(this).attr("data-id");
    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        // With that done, add the note information to the page
        .done(function(data) {
            // console.log(data);
            $("#notes").append("<p>" + data.title + "</p>");
            // An input to enter a new title
            $("#notes").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
            $("#notes").append("<div id='oldNote'></div>");
            // If there's a note in the article
            if (data.note) {
                // console.log(data.note);
                // Place the title of the note in the title input
                $("#oldNote").append("<h2>" + data.note.title +
                    "<button class='deleteNote btn btn-info btn-sm pull-right' data-id='" +
                    data.note._id + "''>Delete</button></<h2>");
                $("#oldNote").append("<p>" + data.note.body + "</<p>");
            }
        });
});
