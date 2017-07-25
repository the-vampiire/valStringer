Created by Vampiire on 7/24/17.
Concept Inspiration: @agathalynn from the Chingu Voyage Cohort 
 
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
  continuously store the values obtained during an IM interaction can be passed into the value field by stringifying it
 
  A single object filled with multiple values obtained through multiple user interactions with
  an interactive message is passed back just like an HTML form. By labeling each value obtained the same as that of the
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
 
       function populateOptions:
 
           purpose:
               accepts an array of IM menu text values to populate the menu automatically while still preserving
               the functionality of valStringer. The array can be hardcoded, passed, or fed from an external source
 
           parameters:
 
               dataArray -> the array of text values. these will represent what the user sees in the IM menu
 
               key -> this is the key associated with the selected item. this should be the same field name expected
                      during database inserts / updates
 
               valueObject -> see above
 
  *********************************************************************************************************************
 
       function valAttacher: see detailed description below
 
  *********************************************************************************************************************
      
