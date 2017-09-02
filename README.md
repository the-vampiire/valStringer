**Created by Vampiire**
I am looking to improve this package in anticipation of Slack's interactive messages v3 [text input]. Once completing the features then the documentation can be written.

The current README is incomplete and deprecated. It is only there to be used as a source for future documentation.

If you are interested in helping email vampiirecodes gmail com or visit the [github page](https://github.com/the-vampiire/valStringer)

 # Notes from the original valStringer function:

 this function allows the value of each interactive message menu item to hold an object storing current and previous selected values

 the function accepts the value object, a key parameter [the item the user sees], and a value associated with that key
 
 when the final value is received you can process the value object and store all of its data in the database in bulk rather
 than doing it piecewise as each value is received at your interactive message request route

 this removes n-1 database queries per user interaction 
 if you set the keys of the valueObject to be the same as those of your database schema you can greatly simplify
 the process of gathering and storing bulk data

<hr>

 # OLD README BELOW:
**Concept Inspiration: @agathalynn from the Chingu Voyage Cohort**
 
  Val Stringer
 
  Currently Slack will make a post request every time an interactive message [IM] button is clicked or menu is changed.
  During this post request only a single value (that of the interacted button / menu) is sent to the server via the
  payload object. In order to update a document designed with multiple fields the server must make a new database
  request and update after each post request is made and payload value extracted.
 
  HTML forms allow for multiple dropdown menus to be viewed and selected before a final submit button is pressed.
  On submit all of the values of the dropdown menus are passed to the server in a single object. This object can be
  easily passed directly into an insert or update method with a single database call.
 
  Val Stringer allows for interactive messages in Slack to provide HTML form benefits with respect to gathering data
  and updating a database. It works by exploiting the value property of the IM menu or button attachment. Currently a
  simple string is inserted as a value. Using valStringer an object is stringified and inserted as the value. This
  makes Slack store the data throughout the user's interactions until it is ready to be processed in bulk.

  During the first interaction the empty object is injected with the value of the first item via the valStringer function.
  On each subsequent menu or button interaction the value object is updated to store all previous and current values.
  When the final "submit" button is interacted by the user an object which stores the bulk data of all values is returned.
  This bulk data object can be easily passed directly into an upsert / update database call.
 
  Code Breakdown:

       function valStringer
 
           purpose:
               First message: accept a blank object and add the initial key and Slack user inputted value
               Subsequent: accept the now populated value object, extracted from the payload, and add all subsequent keys and values per call

           parameters:
               valueObject -> the object which stores the initial and all subsequent values are stored
                              when the interactive messages chain has completed this object can be passed
                              directly into a mongodb / mongoose update method to update all the fields
                              received from the Slack interaction

                              accessed via: "payload.actions[0].selected_options[0].value"
                                  copy / paste : let value = payload.actions[0].selected_options[0].value
 
               key -> the name of the key that will hold the Slack user inputted value
                      this should be the same as the mongodb schema field that the value will be associated with
 
               value -> the value of the Slack interactive message actions object "value" field (the value that
                        is returned to you when the user selects it from the menu)
 
 
  *********************************************************************************************************************
 
       function valOptions:
 
           purpose:
               accepts an array of IM menu text values to populate the menu automatically while still preserving
               the functionality of valStringer. The array can be hardcoded, passed, or fed from an external source
 
           parameters:
 
               dataArray -> the array of text values. these will represent what the user sees in the IM menu
 
               key -> this is the key associated with the selected item. this should be the same field name expected
                      during database inserts / updates
 
               valueObject -> see above
 
  *********************************************************************************************************************
 
       function valAttacher:

            purpose:
                verifies, builds, and returns a Slack interactive message attachment with built in valStringer and valOptions functionality

            parameters:

                valueObject ->

                    initial message: pass an empty object {}
                    subsequent responses: pass the value object from the Slack interactive message payload


                attachmentFields ->

                    this is an object containing all attachment fields besides the options themselves
                        options will be automatically generated from the optionsTextArray parameter
                        using the valOptions function

                    the following is a detailed look at the minimum required fields:
                        {
                             text: instructional text describing the purpose of the dropdown menu,
                             callback_id: the id of the particular message, this is used server side to distinguish the received message,
                             actions: [{

                                 name: pass the same name as the field in the database schema that the value will be associated with,
                                 type: 'select' DO NOT CHANGE THIS,
                                 data_source: 'static' DO NOT CHANGE THIS,
                             }],

                             any additional slack-accepted fields you would like should be added [comma-separated] below
                         }

                optionsTextArray ->

                     this is an array that will provide text and values labels for each menu item
                     it can be hardcoded into the Default variable or passed into the function from an external source

        ************************************************

        for copy and pasting - the minimum required attachment fields object:

        {
            text: replaceMe,
            callback_id: replaceMe,
            actions: [{
                name: replaceMe,
                type: 'select',
                data_source: 'static'
            }]
        }

        ************************************************

  *********************************************************************************************************************

Example Usage:

