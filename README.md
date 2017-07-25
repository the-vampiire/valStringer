**Created by Vampiire**

**Concept Inspiration: @agathalynn from the Chingu Voyage Cohort**
 
  Val Stringer
 
  Currently Slack will make a post request every time an interactive message [IM] button is clicked or menu is changed.
  During this post request only a single value (that of the interacted button / menu) is sent to the server via the
  payload object. In order to update a document designed with multiple fields the server must make a new database
  request and update after each post request is made and payload value extracted.
 
  HTML forms allow for multiple dropdown menus to be viewed and selected before a final submit button is pressed.
  On submit all of the values of the dropdown menus are passed to the server in a single object. This object can be
  easily passed directly into an insert or update method with a single database call.
 
  Val Stringer allows for interactive messages in Slack to act more similarly to an HTML form in terms of gathering data
  and updating a database. It works by exploiting the value property of the IM menu items. An object which can
  continuously store the values obtained during an IM interaction can be updated and passed into the value field by stringifying it. By labeling each value obtained the same as that of the
  database schema fields this single object can be passed directly into a mongoose upsert / update database call.
 
  Code:
 
  
 
       function valStringer
 
           purpose:
               First message: accept a blank object and add the initial key and Slack user inputted value
               Subsequent: accept the now populated value object, extracted from the payload, and add all subsequent
                           keys and values per call
 
           parameters:
               valueObject -> the object which stores the initial and all subsequent values are stored
                              when the interactive messages chain has completed this object can be passed
                              directly into a mongodb / mongoose update method to update all the fields
                              received from the Slack interaction
 
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
                automatically builds and returns a Slack interactive message attachment with built in valStringer and valOptions functionality

            parameters:

            valueObject:

                initial message: pass an empty object {}
                subsequent responses: pass the value object from the Slack interactive message payload
                    accessed via: "payload.actions[0].selected_options[0].value"

            attachmentFields:

                this is an object containing all attachment fields besides the options themselves
                    options will be automatically generated from the optionsTextArray parameter
                    using the valOptions function

                the following is a list of the minimum required fields:
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

            optionsTextArray:

                 this is an array that will provide text labels for each value
                 it can be hardcoded into the Default variable or passed into the function

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
