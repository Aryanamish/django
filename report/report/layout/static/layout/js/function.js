////////////////////////// GLOBAL VARIABLE //////////////////////////////////
let key_pressed = [];   //stores the ascii code of keys which are pressed
let lable_count = 1;    //keeps track of label element created
let button_count = 1;   //keeps track of button element created
let textbox_count = 1;  //keeps track of textbox element created
let dropdown_count = 1; //keeps track of drop_down element created
let widget_count = 1;   //keeps track of widget element created
let property;       //stores all the property of all element
let ProxyProperty = {};
let loadingTemplate = false; //stores if the page is loading templates
let TempData={
  property:property,
  css:'',
  js: '',
  html: '',
  temp_name: ''};
/////////////////////////////////////////////////////////////////////////////


/////////////////////////////////// CONSTANT VARIABLE ///////////////////////
const KeyBinding = {};
const KeyBoard = {
  "backspace" :	8,
  "tab" :	9,
  "enter" :	13,
  "shift" :	16,
  "ctrl" :	17,
  "alt" :	18,
  "pause/break" :	19,
  "caps lock" :	20,
  "esc" :	27,
  "page up" :	33,
  "Space" :	32,
  "page down" :	34,
  "end" :	35,
  "home" :	36,
  "left arrow" :	37,
  "up arrow" :	38,
  "right arrow" :	39,
  "prt sc" :	44,
  "down arrow" :	40,
  "insert" :	45,
  "del" :	46,
  "left window key" :	91,
  "right window key" :	92,
  "select key" :	93,
  "numpad 0" :	96,
  "numpad 1" :	97,
  "numpad 2" :	98,
  "numpad 3" :	99,
  "numpad 4" :	100,
  "numpad 5" :	101,
  "numpad 6" :	102,
  "numpad 7" :	103,
  "numpad 8" :	104,
  "numpad 9" :	105,
  "f1" :	112,
  "f2" :	113,
  "f3" :	114,
  "f4" :	115,
  "f5" :	116,
  "f6" :	117,
  "f7" :	118,
  "f8" :	119,
  "f9" :	120,
  "f10" :	121,
  "f11" :	122,
  "f12" :	123,
  "num lock" :	144,
  "scroll lock" :	145,
  "My Computer" : 	182,
  "My Calculator" : 183,
};
const sideMenu = [];
const objectChangeHandler = {
  set: function(target, prop, value){
    if(typeof Storage == 'function'){
      localStorage.setItem('property', JSON.stringify(property));
    }
    target[prop] = value;
    return true;
  },

  get(target, key) {
    if (typeof target[key] === 'object' && target[key] !== null) {
      return new Proxy(target[key], objectChangeHandler);
    } else {
      return target[key];
    }
  },
  };
//this is the right click menu function
const RightClickFunction = {

  "delete_element": function(){
    var a = document.querySelectorAll('.selected');
    a.forEach(function(e){
      e.remove();
      delete property[e.id]
    });
  },
  "del" : function(){
    //pass
  },
  "code_model": function(){
      if(document.getElementById('code_model').style.display == "none" || document.getElementById('code_model').style.display == ""){
          document.getElementById('code_model').style.display="block";
      }else{
          document.getElementById('code_model').style.display="none"
      }

  },

  'property':function(){
    var a = document.getElementById('wrapper');
    if(a){
      if(a.style.width == '0%'){
        document.getElementById('menu-toggle').click();
      }
    }
    document.getElementById('nav_property').click();
  },

  menu: function(){
    var a = document.getElementById('wrapper');
    if(a){
      if(a.style.width == '0%'){
        document.getElementById('menu-toggle').click();
      }
    }
    document.getElementById('tool_box').click();
  }
};
// triggers when property table is clicked
const propertyElementFunction = {
  "selected":undefined,
  "setProperty":function(e){property[propertyElementFunction.selected.id][propertyElementFunction['propertyName'](e)][1] = e.value;},
  /* "function name": function(){//code event element is "this"} */
  "propertyName": function (e){return e.parentElement.parentElement.attributes.property.value;},
  "changeText" : function(){

    selected = propertyElementFunction['selected'];
    var element = selected.querySelector(':first-child');
    if(element.nodeName.toLowerCase() == 'input'){
      element.value = this.value;
    }else if(element.nodeName.toLowerCase() == 'p' ||'div'||'span'){
      element.innerHTML = this.value;
    }
    propertyElementFunction.setProperty(this);
  },
  'disableElement' : function(){
    selected = propertyElementFunction['selected'];
    if(this.value.toLowerCase() == "true"){
      selected.querySelector(':first-child').disabled = true;
    }else if(this.value.toLowerCase() == "false"){
      selected.querySelector(':first-child').disabled = false;
    }

    propertyElementFunction.setProperty(this);
  },
  'defaultProperty' : function(){

    propertyElementFunction.setProperty(this);
  },
  'setTop' : function(){

    var top = this.value.trim();
    var unit = top[top.length-2]+top[top.length-1];
    if(unit.toLowerCase() == "px"){
      propertyElementFunction.selected.style.top = top;
      propertyElementFunction.setProperty(this);
    }
  },
  'setLeft' : function(){

    var left = this.value.trim();
    var unit = left[left.length-2]+left[left.length-1];
    if(unit.toLowerCase() == "px"){
      propertyElementFunction.selected.style.left = left;
      propertyElementFunction.setProperty(this);
    }
  },
  'setHeight' : function(){
    var div = propertyElementFunction.selected;
    divFirstChild = div.querySelector(':first:child');
    var height = this.value.trim();
    height = height.substr(0,height.length-2);
    var unit = height[height.length-2]+height[height.length-1];
    if(unit.toLowerCase() == "px"){
      div.style.height = height;
      propertyElementFunction.setProperty(this);
    }
  },
  'setWidth' : function(){

    var div = propertyElementFunction.selected;
    divFirstChild = div.querySelector(':first:child');
    var height = this.value.trim();
    height = height.substr(0,height.length-2);
    var unit = height[height.length-2]+height[height.length-1];
    if(unit.toLowerCase() == "px"){
      div.style.height = height;
      propertyElementFunction.setProperty(this);
    }
  },
  "changeOverflow" : function(){
    property[propertyElementFunction.selected.id][propertyElementFunction['propertyName'](this)][3] = this.value;
  }
};
/////////////////////////////////////////////////////////////////////////////


function setProperty(propertyValue={}){
  ProxyProperty = propertyValue
  property = new Proxy(ProxyProperty, objectChangeHandler);
}
setProperty();



/*
 * stores the pressed key on global var key_pressed and enpty it when key is released
 */
(function(){
  var map = [];
  onkeydown = onkeyup = function(e){

      e = e || event; // to deal with IE
      map[e.keyCode] = e.type == 'keydown';
      key_pressed = [];
      map.every(function(value){
      map.filter(function(value,index){

          if(value == true){
            key_pressed.push(index);


            if(KeyBinding[key_pressed]){
              e.preventDefault();
              if(typeof(RightClickFunction[KeyBinding[key_pressed]]) == 'function'){
                RightClickFunction[KeyBinding[key_pressed]]();
              }else if(DEBUG){
                console.log('Key code : ['+key_pressed+"]\n function '" + KeyBinding[key_pressed] +"' does not exist")
              }
            }
          }
      });
    });
  }
})();


/*
*adds mousedown event listner which:-
*        adds the class 'selected' to the element when mouse is downed
*        selects multiple element when ctrl key is pressed
*        selects only one element when ctrl key is not pressed
*/
function addClass(elmnt){ // called at creation of element
  elmnt.addEventListener('mousedown',function(e){ // e is the element
    var a = document.getElementById('page-content-wrapper');
    var clear = false;

    //if crtl is not pressed all the elements is deselected first then one is selected
    if(JSON.stringify(key_pressed) != JSON.stringify([17])){ //key_pressed is a global var
      // deselecting all div element
      a.querySelectorAll('#prntArea div').forEach(function(div){
        div.classList.remove('selected');
      });
    }

    // one element is selected
    elmnt.classList.add("selected");

    //propertyElementFunction.select is updated with latest selected element
    propertyElementFunction.selected = elmnt;

    e.stopPropagation();
  });
}


/**
 *
 * @param {HTMLObject} elmnt stores the element whose properties is to be added in the property var
 * @param {String} elmntType element type eg:- text box, drop_down
 * @param {Object} parameter
 * update the property variable when new element is created
 */
function addPropertyToElement(elmnt,elmntType,parameter){

  var ElmntProperty = {

    /* "id" : [<dgtype>, value, {<event> : <function Name>}] */
    'id':["text", elmnt.attributes.id.value, {}],

    //"reaccurence" : ["bool", false, {}],
    "text" : ["text", "", {"keyup":"changeText"}],
    "disable" : ["bool", false, {"change":"disableElement"}],
    "attribute" : ["button",
        (function(){

          var a = {};
          for(i=0; i < elmnt.attributes.length; i++){
            a[elmnt.attributes[i].nodeName] = elmnt.attributes[i].nodeValue;
          }
          return a;
        })()
      , {}],
    "css" : ["button", "", {}],
    "js" : ["button", "", {}],

    "default" : ["text", "", {"blur":"defaultProperty"}],
    // "max_occurence" : ["int", "", {}],
    // "starting_occurence" : ["int", "", {}],
    "tab_index" : ["int", "", {}],
    "z-index" : ["int", "", {}],
    "top" : ["text", elmnt.offsetTop +"px" , {"keyup":"setTop"}],
    "left" : ["text", elmnt.offsetLeft +"px", {"keyup":"setLeft"}],
    "height" : ["text", elmnt.offsetHeight +"px", {"keyup":"setHeight"}],
    "width" : ["text", elmnt.offsetWidth +"px" , {"keyup":"setWidth"}],

    /* For dropdown
    "overflow" : [<dgtype>, value, {<event> : <function Name>}, <Set value>]
    */
    "overflow-x" : ["drop_down", ["auto","hidden","inherit","initial","overlay","scroll","unset","visible"], {'change':"changeOverflow"},'auto'],
    "overflow-y" : ["drop_down", ["auto","hidden","inherit","initial","overlay","scroll","unset","visible"], {'change':"changeOverflow"},'auto'],
    "onclick" : ['drop_down', [], {}],
    "hover" : ['drop_down', [], {}],
    "contextmenu" : ['drop_down', [], {}],
    "onfocus" : ['drop_down', [], {}],
    "onmousedown" : ['drop_down', [], {}],
    "onmouseup" : ['drop_down', [], {}],
    "lostfocus" : ['drop_down', [], {}],
  }

  if(elmntType=='text'){
    //pass

  }else if(elmntType == 'dropdown'){
    ElmntProperty['list_attachment'] = ["drop_down", ["/* database list goes here */"],{'change':'changeOverflow'}];

  }else if(elmntType == 'label'){
    delete ElmntProperty.disable;
    delete ElmntProperty.onfocus;
    delete ElmntProperty.lostfocus;
    ElmntProperty.text[1] = elmnt.innerText;

  }else if(elmntType == 'button'){
    //pass

  }else if(elmntType=='widget'){
    ElmntProperty = widgetElement(elmnt,ElmntProperty);

  }
  property[elmnt.attributes.id.value] = ElmntProperty;
  if(DEBUG) console.log(property);


}


/**
 *
 * @param {HTMLDOMObject} elmnt newely created element
 * called upon new element creation to add rightclick event listner
 */
function rightClickMenu(elmnt){
    elmnt.addEventListener('contextmenu',function(e){
        var a = document.getElementById('rightClickMenu');
        e.preventDefault();     // prevent the default action of right click
        loadElementProperty(elmnt.id);
        a.style.top =  e.clientY +"px" ;
        a.style.left = e.clientX+"px";
        a.style.display = "block";
    })
}




/**
 *
 * @param {strinjg} searchStr   parent string
 * @param {string} str          search string
 * @param {bool} caseSensitive  wheather to do case sensetive search
 * return index of substring
 */
function getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}


/**
 *
 * @param {string} string shortcut string
 * return ascii code of key board key
 *    for eg: CTRL+A will be converted [17,65]
 */
function breakKeybinding(string){
    var a = string.split("+");
    var b=[];

    a.forEach(function(e){
      e = e.toLowerCase().replace(' ', "");
      if(KeyBoard[e]){
        b.push(KeyBoard[e]);

      }else{
        if(DEBUG) console.log('wrong key/key does not exist');
        return;
      }
    })
    return b;
}


// it sets the shortcut code on right click menu into KeyBinding var
function loadKeyBinding(){
  var key_binding;var fun;
  document.querySelectorAll("#rightClickMenu ul li").forEach(function(li){
    if(li.querySelector('a').attributes.fun){
      fun = li.querySelector('a').attributes.fun.value;
    }else{
      fun = li.querySelector('a').innerHTML.replace(' ', '_').toLowerCase();
    }

    if(li.querySelector('shortcut')){
      key_binding = li.querySelector('shortcut').innerHTML
      key_binding = Array(breakKeybinding(key_binding));
      KeyBinding[key_binding] = fun;      //cont keyBinding
    }
  });
}


//load all the tabs of sidemenu_nav and store them in const sideMenu
function loadSideMenu(){
  var a=[];

  document.querySelectorAll('#sidemenu_nav button').forEach(function(e,index){
      var c = document.querySelectorAll('#sidemenu_content div')[index];
      if(c.attributes.default){
          if(c.attributes.default.value.toLowerCase()=='true'){
              c.style.display = 'block';
              e.parentElement.style.backgroundColor='#080808a3';
          }

      }else{
          c.style.display = 'none';
          e.parentElement.style.backgroundColor='#272727';
      }
      a = [e,c]
      sideMenu.push(a)
  });
}


/**
 * create property table and append it into property tab of sidenav
 */
function createPropertyTable(){
  var a = document.getElementById('property');
  var tabledata = []
  var prop = {
    /* <property> : <datatype>, */
    'id': "text",
    "reaccurence" : "bool",
    "text" : "text",
    "disable" : "bool",
    "attribute" : "button",
    "css" : "button",
    "js" : "button",
    'list_attachment': "drop_down",
    "default" : "text",
    "max_occurence" : "int",
    "starting_occurence" : "int",
    "tab_index" : "int",
    "z-index" : "int",
    "top" : "text",
    "left" : "text",
    "right": "text",
    "height" : "text",
    "width" : "text",
    "overflow-x" : "drop_down",
    "overflow-y" : "drop_down",
    "onclick" : 'drop_down',
    "hover" : 'drop_down',
    "contextmenu" : 'drop_down',
    "onfocus" : 'drop_down',
    "onmousedown" : 'drop_down',
    "onmouseup" : 'drop_down',
    "lostfocus" : 'drop_down',
  }

  for (i in prop){
    params1 = {
      "element":'td',
      "innerhtml":i,

    }
    params2 = {
      "element" : 'td',
      "attribute":"class=elmntproperty",
    }


    if(prop[i] == 'text'){
      p = {
        "element":'input',

      }
      if(i=="id"){
        p.attribute = "type=text:?:dataType=text:?:disabled";
      }else{
        p.attribute = "type=text:?:dataType=text";
      }


    }else if(prop[i] == 'bool'){

      o1 = {
        "element":"option",
        "attribute" : "value=true",
        "innerhtml":"True"
      }
      o2 = {
        "element":"option",
        "attribute" : "value=false",
        "innerhtml":"False"
      }
      p = {
        "element":"select",
        "attribute":"dataType=bool",
        "htmlObj":[createElement(o1),createElement(o2)]

      }
    }else if(prop[i] == 'button'){
      p = {
        "element":"button",
        "attribute":"dataType=button",
        "innerhtml":"..."
      }
    }else if(prop[i] == 'int'){
      p = {
        "element": "input",
        "attribute":"type=text:?:dataType=int",

      }
    }else if(prop[i] == 'drop_down'){

      p = {
        "element":"select",
        "attribute":"dataType=drop_down",


      }
    }


    params2.htmlObj = [createElement(p)];





    params = {
      'element':'tr',
      "attribute":"property="+i,
      'htmlObj':[createElement(params1),createElement(params2)]
    }


    tabledata.push(createElement(params))
  }


  parameter = {
    "element" : 'table',
    "htmlObj" : tabledata
  }

var c = createElement(parameter);

  var table = a.appendChild(c);
  table.style.display = "none";
  if(DEBUG) console.log(table);
}



/**
 *
 * @param {HTMLDOMObject} elmnt Element which has selected class
 * @param {string} elmntType type of element eg: textbox
 * @param {string} event event name that is to be bind in the table element
 * @param {string} functionName function name that to be executed on event
 * add new event listners to the table element
 */
function bindEventToPropertyElement(elmnt,elmntType,event,functionName){
  var eventname = []
  //removes all previous event listners on the element
  elmnt.removeAllEventListeners();

  //adding event listners accourding to element type and checking if it is legal event name
  if(elmntType == "text"){
    var text_event = [
      "blur",
      "copy",
      "cut",
      "focus",
      "focusin",
      "focusout",
      "input",
      "invalid",
      "select",
      "paste",
      "keypress",
      "keydown",
      "keyup"
    ];


    if(text_event.indexOf(event) != -1){

      elmnt.addEventListener(event, propertyElementFunction[functionName], 'table_text', false);
    }
    }else if(elmntType == "drop_down"){
      var drop_down_event = ['change'];
      if(drop_down_event.indexOf(event)!=-1){
        elmnt.addEventListener(event, propertyElementFunction[functionName], "table_dropdown", false);
      }
    }else if(elmntType == "int"){
      var int_event =
      ["blur", "copy", "cut", "focus", "focusin", "focusout", "input", "invalid", "select", "paste"];

      if(int_event.indexOf(event)!=-1){
        elmnt.addEventListener(event, propertyElementFunction[functionName], "table_int", false);
      }
    }else if(elmntType == "bool"){
      var bool_event = ["change"];
      if(bool_event.indexOf(event)!=-1){
        elmnt.addEventListener(event, propertyElementFunction[functionName], "table_bool", false);
      }

    }else if(elmntType == "button"){
      var button_event = ['click'];
      if(button_event.indexOf(event)!=-1){
        elmnt.addEventListener(event, propertyElementFunction[functionName], "table_button", false);
      }
    }

}


/**
 *
 * @param {string} elmntId id of selected element whose property we have to show on the property tab
 */
function loadElementProperty(elmntId){

  document.querySelector('#property table').style.display = "table";
  elmnt = document.getElementById(elmntId);

  document.querySelectorAll(".elmntproperty").forEach(function(e){

    array = property[elmntId][e.parentElement.attributes.property.value];
    if(array){
      e.parentElement.style.display = "table-row";
      if (array[0] == 'text'){


       var tableElmnt = e.querySelector('input');
       tableElmnt.value = array[1];

      }else if(array[0] == 'bool'){
        var tableElmnt = e.querySelector('select');
        tableElmnt.value = array[1];

      }else if(array[0] == 'drop_down'){
        var tableElmnt = e.querySelector('select');

        tableElmnt.querySelectorAll('option').forEach(function(e){e.remove()});
        for (key in array[1]){
          var val = array[1][key]
          option = {
            "element":"option",
            "attribute":"value="+val,
            "innerhtml":val,
          }
          tableElmnt.appendChild(createElement(option));
          tableElmnt.value = property[elmntId][e.parentElement.attributes.property.value][3];
        }
      }

      for (event in array[2]){
        if(event){
          bindEventToPropertyElement(tableElmnt, array[0], event, array[2][event])

        }
      }

      }else{
        e.parentElement.style.display = "none"
      }
    }
  );
}




/**
 *
 * @param {HTMLDOMObject} elmnt widget element
 * @param {Object} ElementProperty property of the element
 * return the property of element
 */
function widgetElement(elmnt,ElementProperty){
  if(elmnt.firstElementChild.nodeName.toLowerCase() == 'p'){
    ElementProperty.text[1] = elmnt.innerText;
    delete ElementProperty.disable;
  }
  ElementProperty.innerHtml = elmnt.innerHTML;
  return ElementProperty;
}


/**
 *
 * @param {HTMLDOMObject} elmnt element which is to be resizable and dragable
 */
function dragResize(elmnt){
  $(elmnt).draggable({
    cancel: null,
    stop : function(e,ui){

      property[elmnt.id]['top'][1] = ui.position.top + "px";
      property[elmnt.id]['left'][1] = ui.position.left + "px";

      loadElementProperty(elmnt.id);
    },
    containment : '#page-content-wrapper',
  });

  $(elmnt).click(function(e){
    loadElementProperty(elmnt.id);
  })
  $(elmnt).resizable({
    alsoResize: $(elmnt).find('*'),
    stop: function(e,ui){
      property[elmnt.id]['height'][1] = ui.size.height + "px";
      property[elmnt.id]['width'][1] = ui.size.width + "px";
      loadElementProperty(elmnt.id);
    }
  });
}


function appendElement(parameter, parentElmntId, elmntType ){
  let elmnt = createElement(parameter)

  document.getElementById(parentElmntId).appendChild(elmnt);

  if(property[elmnt.attributes.id.value] === undefined) {
    /**
     * adding
     *    properties of the element to property var,
     *    making it dragable,
     *    resizable,
     *    adding right click menu event listner and,
     *    adding .select class when it is clicked
     */

    addPropertyToElement(elmnt, elmntType, parameter);
  }
   //make the new element dragable and resizable
  dragResize(elmnt);

  //add right click menu event listner
  rightClickMenu(elmnt);

  //adds mousedown event listner to add the class selected to the element when mouse is down
  addClass(elmnt);
}

function createTextbox(){
  if(loadingTemplate === true){
    var id = 'textbox'+textbox_count;
    var height = property[id]['height'][1];
    var left = property[id]['left'][1];
    var top = property[id]['top'][1];
    var width = property[id]['width'][1];
  }
  let params = {
    element:'input',
    attribute : (function(){
         let att = 'class=dragClickMe:?:type=text';
         if(loadingTemplate){
           att += ":?:style=height:${0}px;width:${1}px".format(parseInt(height)-2,parseInt(width)-2);
         }
         return att

       })(),
  }

  //wrapping around div element
  let parameter = {
    element:"div",
    attribute: (function(){
                  let att = "class=drag:?:id=textbox${0}".format(textbox_count);
                  if(loadingTemplate){
                    att += ":?:style=height:${0};top:${1};left:${2};width:${3}".format(height, top, left, width);
                  }
                  return att;
                })(),

    htmlObj:[createElement(params)]
  }
  textbox_count +=1;
  appendElement(parameter, 'prntArea', 'textbox');

}


function createDropdown(){


   if(loadingTemplate === true){
    var id = 'dropdown'+dropdown_count;
    var height = property[id]['height'][1];
    var left = property[id]['left'][1];
    var top = property[id]['top'][1];
    var width = property[id]['width'][1];
  }

   let option = {
       element:'option',
       attribute: 'value=dropdown',
       innerhtml: "Drop Down"
   };
  let select = {
       element: 'select',
      attribute: (function(){
         let att = 'value=select';
         if(loadingTemplate){
           att += ":?:style=height:${0}px;width:${1}px".format(parseInt(height)-2,parseInt(width)-2);
         }
         return att

       })(),
      htmlObj: [createElement(option)],
  };

   let parameter = {
       element: 'div',
       attribute: (function(){
         let att = 'class=drag clickDragMe:?:id=dropdown${0}'.format(dropdown_count);
         if(loadingTemplate){
           att += ":?:style=height:${0};top:${1};left:${2};width:${3}".format(height, top, left, width);
         }
         return att

       })(),

       htmlObj: [createElement(select)]
   };
  dropdown_count +=1;

  appendElement(parameter, 'prntArea', "dropdown");
}

function createLabel(){

  if(loadingTemplate === true){
    var id = 'label'+lable_count;
    var height = property[id]['height'][1];
    var left = property[id]['left'][1];
    var top = property[id]['top'][1];
    var width = property[id]['width'][1];
  }

  let params = {
        element:'p',
        attribute : (function(){
         let att = 'class=dragClickMe';
         if(loadingTemplate){
           att += ":?:style=height:${0}px;width:${1}px".format(parseInt(height)-2,parseInt(width)-2);
         }
         return att

       })(),
        innerhtml : "something",
      }

      //wrapping around div element
  let parameter = {
        element:"div",
        attribute: (function(){
                  let att = "class=drag:?:id=label${0}".format(lable_count);
                  if(loadingTemplate){
                    att += ":?:style=height:${0};top:${1};left:${2};width:${3}".format(height, top, left, width);
                  }
                  return att;
                })(),
        htmlObj:[createElement(params)]
      }
      lable_count +=1;

  appendElement(parameter, 'prntArea', "label");
}

function createButton(){

  if(loadingTemplate === true){
    var id = 'button'+button_count;
    var height = property[id]['height'][1];
    var left = property[id]['left'][1];
    var top = property[id]['top'][1];
    var width = property[id]['width'][1];
  }

  let params = {
    element:'input',
    attribute : (function(){
         let att = 'class=dragClickMe:?:type=button:?:value=buton';
         if(loadingTemplate){
           att += ":?:style=height:${0}px;width:${1}px".format(parseInt(height)-2,parseInt(width)-2);
         }
         return att

       })(),
  }

  //wrapping around div element
  let parameter = {
    element:"div",
    attribute: (function(){
                  let att = "class=drag:?:id=button${0}".format(button_count);
                  if(loadingTemplate){
                    att += ":?:style=height:${0};top:${1};left:${2};width:${3}".format(height, top, left, width);
                  }
                  return att;
                })(),
    htmlObj:[createElement(params)]
  }
  button_count +=1;

  appendElement(parameter, 'prntArea', "button");

}


function createWidget(){

      //shows the code_model widget tab
      document.getElementById('code_model').style.display = 'block';
      document.querySelector('.widget').click();
}


function editingMode(){

  document.getElementById('save_load').classList.remove('animatezoomin');
  document.getElementById('save_load').classList.add('animatezoomout');

  setTimeout(function(){  document.getElementsByClassName('scrn')[0].style.display = 'block';
},300);
  
}




/**
 *
 * @param {Object} loadedProperty   property object with all the properties of the templates
 * @param {String} css              css of the templates
 * @param {String} js               js of the templates
 * @param {String} name             name of the templates
 *
 * loads the templates from the server and display all its elements
 */
function loadSavedElement(loadedProperty, css, js, name){
    document.getElementById('prntArea').removeAllListeners();
    loadingTemplate = true;
    setProperty(JSON.parse(loadedProperty));
    //Empty the prntArea div
    document.getElementById('prntArea').innerHTML='';

    document.getElementById('js').innerText = js;
    document.getElementById('css').innerText = css;

    for(let i in property){

        let reverse = i.split('').reverse().join('');
        if(i.toLowerCase().search('textbox') != -1){
            textbox_count = parseInt(reverse);
            eval(document.querySelector('a[dtype=textbox').attributes.href.value);
        }else if(i.toLowerCase().search('dropdown') != -1){
            dropdown_count = parseInt(reverse);
            eval(document.querySelector('a[dtype=dropdown').attributes.href.value);
        }else if(i.toLowerCase().search('label') != -1){
            lable_count = parseInt(reverse);
            eval(document.querySelector('a[dtype=label').attributes.href.value);
        }else if(i.toLowerCase().search('button') != -1){
            button_count = parseInt(reverse);
            eval(document.querySelector('a[dtype=button').attributes.href.value);
        }

    }
    document.querySelector('#property table').style.display='none';
    RightClickFunction['menu']();
    loadingTemplate = false
}

  // loading the templates when user clicks the load button at beginning

function loadTemplate(){
let template_name = $('.load_temp_btn_active').html();
  loadTemplateAjax(template_name);



  function ajaxState(){

    if((performance.now()-t_start)>timeout+500){
      return;
    }
    if(ajaxCallState === true){
      editingMode();
      TemplateName = template_name;
      ajaxCallState = false;
    }else if(ajaxCallState === false){
      setTimeout(ajaxState,500);
    }

  }
  let t_start = performance.now();
  ajaxState();
  return false;
}


function loadingScreen(){
    $('#loading').toggle();
}


