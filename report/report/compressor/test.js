
const DEBUG = true;


document.getElementById('line').onclick=function(){
    
  var x = document.getElementById('sidebar').style;
  var y = document.getElementsByClassName('container');
  y = y[0].style;
  if(x.width != "0%") {
      x.width = "0%";
      y.width = "100%";

  }else if(x.width != "18%"){
      x.width = "18%";
      y.width = "82%";
  }else if(x.width == ""){
      x.width = "0%";
      y.width = "100%";
  }
  
}

//Make the DIV element draggagle:
function dragable(elmnt){

prnt = document.getElementsByClassName('container')[0];
var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
if (document.getElementById(elmnt.id + "dragClickMe")) {
  // if present, the header is where you move the DIV from:
  document.getElementById(elmnt.id + "dragClickMe").onmousedown = dragMouseDown;
} else {
  // otherwise, move the DIV from anywhere inside the DIV:
  elmnt.onmousedown = dragMouseDown;
}

function dragMouseDown(e) {
  e = e || window.event;
  e.preventDefault();
  // get the mouse cursor position at startup:
  pos3 = e.clientX;
  pos4 = e.clientY;
  document.onmouseup = closeDragElement;
  // call a function whenever the cursor moves:
  document.onmousemove = elementDrag;
}

function elementDrag(e) {
  e = e || window.event;
  e.preventDefault();
  // calculate the new cursor position:
  pos1 = pos3 - e.clientX;
  pos2 = pos4 - e.clientY;
  pos3 = e.clientX;
  pos4 = e.clientY;
  // set the element's new position:

  var em = elmnt.style;
  var top = parseInt(em.top.replace(/-[^0-9]/g,''));
  if(top >= 0 || isNaN(top) ){
      em.top = (elmnt.offsetTop - pos2) + "px";
  }
  if(parseInt(em.top.replace(/-[^0-9]/g,'')) <0){
      em.top = "0px";
  }
  
  var left = parseInt(em.left.replace(/-[^0-9]/g,''));
  
  if(left >= 1 || isNaN(left) || left ==0){
      em.left = (elmnt.offsetLeft - pos1) + "px";
  }
  if(parseInt(em.left.replace(/-[^0-9]/g,'')) <0){
      em.left = "0px";
  }
  
  if (elmnt.offsetWidth +  parseInt(em.left.replace(/-[^0-9]/g,'')) >= prnt.offsetWidth){
      em.left = (prnt.offsetWidth - elmnt.offsetWidth) + "px";
  }
  
  }

function restrict(){
  var em = elmnt.style;
  var top = parseInt(em.top.replace(/-[^0-9]/g,''));
  if(top >= 0 || isNaN(top) ){
      em.top = (elmnt.offsetTop - pos2) + "px";
  }
  if(parseInt(em.top.replace(/-[^0-9]/g,'')) <0){
      em.top = "0px";
  }
  
  var left = parseInt(em.left.replace(/-[^0-9]/g,''));
  
  if(left >= 1 || isNaN(left) || left ==0){
      em.left = (elmnt.offsetLeft - pos1) + "px";
  }
  if(parseInt(em.left.replace(/-[^0-9]/g,'')) <0){
      em.left = "0px";
  }
  
  if (elmnt.offsetWidth +  parseInt(em.left.replace(/-[^0-9]/g,'')) >= prnt.offsetWidth){
      em.left = (prnt.offsetWidth - elmnt.offsetWidth) + "px";
  }

  
}

function closeDragElement() {
  // stop moving when mouse button is released:
  document.onmouseup = null;
  document.onmousemove = null;
}

}


// create DOM element

function rightClickMenu(elmnt){
  elmnt.addEventListener('contextmenu',function(e){
    var a = document.getElementById('rightClickMenu');
    e.preventDefault();

    a.style.top =  e.clientY +"px" ;
    a.style.left = e.clientX+"px";
    a.style.display = "block"
  })
}

window.addEventListener('click',function(){
  var a = document.getElementById('rightClickMenu');
  a.style.display="none";

  var a = document.getElementsByClassName('container')[0];
  a.querySelectorAll('*').forEach(function(e){
    e.classList.remove('selected');
  });
});





document.getElementById('sidebar').querySelectorAll('a').forEach(function(e){
e.addEventListener('click',function (a){

  var anchor = a.target;
  parentElement = document.getElementsByClassName('content')[0]
  if(anchor.innerHTML.toUpperCase().replace(" ","") == "TEXTBOX"){
    params = {
      element:'input',
      attribute : 'class=dragClickMe:type=text'
    }

    parameter = {
      element:"div",
      attribute:"class=drag",
      htmlObj:[createElement(params)]
    }
    parentElement.appendChild(createElement(parameter));
  }else if(anchor.innerHTML.toUpperCase().replace(" ","") == "DROPDOWN"){

    params1 = {
      element:'input',
      attribute : 'class=dragClickMe:type=text',
    }

    params2={
      element:'div',
      attribute:'class=caret down'
    }
    params3 = {
      element:'button',
      htmlObj:[createElement(params2)]
    }


    parameter = {
      element:"div",
      attribute:"class=drag",
      htmlObj:[createElement(params1),createElement(params3)],
    }

  }else if(anchor.innerHTML.toUpperCase().replace(" ","") == "LABEL"){

    params = {
      element:'p',
      attribute : 'class=dragClickMe',
      innerhtml : "something",
    }

    parameter = {
      element:"div",
      attribute:"class=drag",
      htmlObj:[createElement(params)]
    }
  
  }else if(anchor.innerHTML.toUpperCase().replace(" ","") == "BUTTON"){

    params = {
      element:'input',
      attribute : 'class=dragClickMe:type=button:value=buton',
    }

    parameter = {
      element:"div",
      attribute:"class=drag",
      htmlObj:[createElement(params)]
    }

  }else if(anchor.innerHTML.toUpperCase().replace(" ","") == "WIDGET"){

  }

  var elmnt = parentElement.appendChild(createElement(parameter));

  dragable(elmnt);
  rightClickMenu(elmnt);
  addClass(elmnt);

  
})
});


function addClass(elmnt){
  elmnt.addEventListener('click',function(e){
    
    var a = document.getElementsByClassName('container')[0];
    a.querySelectorAll('*').forEach(function(e){
      
      if(JSON.stringify(key_pressed) != JSON.stringify([17])){
        
        e.classList.remove('selected');
      }
    });
    
    
    elmnt.classList.add("selected");
    e.stopPropagation();
  })
  
}

function createElement(obj){
if(obj.element){
  elmnt = document.createElement(obj.element);
}else{
  if(DEBUG){
    console.log("obj.element is not defined"+obj);
    return;
  }else{
    return;
  }
}
if(obj.attribute){
  if(obj.attribute.charAt(obj.attribute.length-1) == ":"){
    obj.attribute = obj.attribute.substr(0,attribute.length-1);
  }

  

  var b = obj.attribute.split(":");
  b.forEach(function(e){
  var c = e.split("=");
    var att = document.createAttribute(c[0]);
    att.value = c[1];
    elmnt.setAttributeNode(att);
  })
}

if(obj.innerhtml){
  elmnt.innerHTML = obj.innerhtml;
}

if(obj.htmlObj){
  obj.htmlObj.forEach(function(e){
    elmnt.appendChild(e);
  })
  
}
return elmnt;
}



function executeShortcut(anchor_tag){
  if(anchor_tag.attributes.fun){
    var fun = anchor_tag.attributes.fun.value;
  }else{
    var fun = anchor_tag.innerHTML.replace(' ',"_").toLowerCase();
  }
  if(typeof(RightClickFunction[fun]) == 'function'){
    RightClickFunction[fun]();
  }
  
}

const RightClickFunction = {
  "delete_element": function(){
    console.log('delete_element');
  },
  "del" : function(){
    console.log('del');
  },
}



document.querySelectorAll("#rightClickMenu ul li a").forEach(function(anchor_tag){
  anchor_tag.addEventListener('click',function(e){
    executeShortcut(anchor_tag);
  })
})




var key_shortcuts = [[],]
var key_pressed = [];
var map = []; // You could also use an array
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

function breakKeybinding(string){
  var a = string.split("+");
  var b=[];
  
  a.forEach(function(e){
    e = e.toLowerCase().replace(' ', "");
    if(KeyBoard[e]){
      b.push(KeyBoard[e]);

    }else{
      if(DEBUG){
        console.log('wrong key/key does not exist');
        }
      b = [];
      return;
    }
  })
  return b;
}

function executekeyBinding(){
  if(JSON.stringify(key_pressed) != JSON.stringify([17])){
        
    e.classList.remove('selected');
  }

}


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
  "0" :	48,
  "1" :	49,
  "2" :	50,
  "3" :	51,
  "4" :	52,
  "5" :	53,
  "6" :	54,
  "7" :	55,
  "8" :	56,
  "9" :	57,
  "a" :	65,
  "b" :	66,
  "c" :	67,
  "d" :	68,
  "e" :	69,
  "f" :	70,
  "g" :	71,
  "h" :	72,
  "i" :	73,
  "j" :	74,
  "k" :	75,
  "l" :	76,
  "m" :	77,
  "n" :	78,
  "o" :	79,
  "p" :	80,
  "q" :	81,
  "r" :	82,
  "s" :	83,
  "t" :	84,
  "u" :	85,
  "v" :	86,
  "w" :	87,
  "x" :	88,
  "y" :	89,
  "z" :	90,
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
  "*" :	106,
  "+" :	107,
  "-" :	109,
  "." :	110,
  "/" :	111,
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
  ";" :	186,
  "=" :	187,
  "," :	188,
  "dash" :	189,
  "period" :	190,
  "\\" :	191,
  "[" :	219,
  "/" :	220,
  "]" :	221,
  "'" :	222,
}

const KeyBinding = {};
window.domc
loadKeyBinding();
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
      KeyBinding[key_binding] = fun;
    }
      
    
  });
  
}