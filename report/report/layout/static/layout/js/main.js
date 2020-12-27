
$(document).ready(function(){

  // executing after document is loaded

  loadKeyBinding();
  loadSideMenu();
  createPropertyTable();


  // hides the right click menu when window is clicked
  window.addEventListener('click',function(){
    var a = document.getElementById('rightClickMenu');
    a.style.display="none";
  });


  // it removes the selected elements when anywhere else is clicked beside the element
  // it hides the property table
  document.getElementById('page-content-wrapper').addEventListener('mousedown',function(){

    //removes the selected property of element
    $("#content div").removeClass('selected')
    $("#property table").css('display','none');
  });

$('#tool_box a').attr({
  'href': function(){
    if($(this).attr('href') == undefined) {
      return "javascript:create" + $(this).html().toLowerCase().capitalize().replace(" ", '') + '()';
    }
  },
});

  /**
   * adds click event listner on li tags on right click menu
   */
  document.querySelectorAll("#rightClickMenu ul li").forEach(function(li_tag){

    //adding click event listner on li tag
    li_tag.addEventListener('click',function(e){
      var anchor_tag = li_tag.querySelector('a');

      //if function attribute is defined then take the value else use the innerhtml
      if(anchor_tag.attributes.fun){    
        var fun = anchor_tag.attributes.fun.value;
      }else{
        var fun = anchor_tag.innerHTML.replace(' ',"_").toLowerCase();
      }
      if(typeof(RightClickFunction[fun]) == 'function'){
        if(propertyElementFunction.selected){
          RightClickFunction[fun]();
        }
      }
    })
  });




  // Creting onclick event on sidebar_nav elements
  sideMenu.forEach(function(e){
    e[0].onclick = function(){
      sideMenu.forEach(function(elmnt){
        elmnt[0].parentElement.style = '#080808a3'
        elmnt[1].style.display='none'
      });
      e[1].style.display='block';
      e[0].parentElement.style.backgroundColor = "#272727";
    }
  });


  /**
   * FOR code_model
   * adds onclick event on tab button
   * hides all tabcontent element and unhides one which is clicked
   */
  document.querySelectorAll('.tablinks').forEach(function(e){
    e.addEventListener('click',function(){

      //hides every content div element
      document.querySelectorAll('.tabcontent').forEach(function(content){
      content.style.display = 'none';
      });

      //removes the class avtive from all tablinks buttons
      document.querySelectorAll('.tablinks').forEach(function(links){
        links.classList.remove('active'); 
      });

      // body attributes of tabs have id of their content div
      document.getElementById(e.attributes.body.value).style.display = 'block';

      //adds active class to the clicked tab button
      e.classList.add('active');

      //if the the tab button is widget then select tags are shown else hidden 
      if(e.attributes.body.value.toUpperCase() =="WIDGET"){
        document.getElementById('widgetOption').style.display="block";
      }else{
      document.getElementById('widgetOption').style.display="none";
      }
    });  //click eventlistner closes here
  });  //forEach loop closes here


  // adding event listner to close the code_model when X is clicked
  document.getElementById('close').addEventListener('click',function(e){
    e.preventDefault();
    document.getElementById('code_model').style.display = 'none'
  });


  //making the default tab button click
  document.querySelector('.default').click();


  /**
    * adding on click method to widgetDeploy button inside code_model widget page to
    *     add widgets into the page-content-wrapper tag
    */
  document.getElementById('widgetDeploy').addEventListener('click',function(){

    //decodeing the html from the div element
    var widget = decodeHtml(document.getElementById('widget').innerHTML.trim());

    //wraping the text into div element
    parameter={
      element:'div',
      attribute:'id=widget' + widget_count + ':?:class=drag',
      innerhtml:widget
    }

    appendElement(parameter, 'content', 'widget');

  });

    
  // MAke code_model dragable with handel as tab button
  $('#code_model').draggable({
    cancel:null,
    handle: '#tab',
    // containment: 'html' ,
  });


  //making the code_model resizable
  $('#code_model').resizable();




  //toggle active state of temp name button in save_load model
  $('#allTemp button').click(function(){
    $('.load_temp_btn_active').removeClass('load_temp_btn_active');
    
    $(this).toggleClass('load_temp_btn_active');
  });



  document.querySelector("#createTemplate input[type=text]").addEventListener('blur',function(){
    for (i in TEMP_NAMES){
      if(this.value.toLowerCase() == TEMP_NAMES[i].toLowerCase()){
        $('.message.red').css('display','block').html("* "+"Template already Exists");
        $('.message.green').css('display','none');
        return;
      }else{
        $('.message.red').css('display','none');
        $('.message.green').css('display','block');
      }
    }
  })

});


