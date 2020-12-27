////////////////////GLOBAL DECLARATION//////////////////////////
let LISTENERS = [];      //keep track of all event listners

/**
 * Defining the prototype
 *
 * String.captilise to captilise the first string
 *
 * addEventListener to update global var LISTENERS
 * for all the event listeners added to any element
 */
(function(){

  if(typeof String.prototype.capitalize == "undefined"){
    String.prototype.capitalize = function(){
    return this.charAt(0).toUpperCase() + this.slice(1);
    }
  }else{
     console.log("String.capitalize already exist");
  }


  if(!String.prototype.format){
    String.prototype.format = function () {
    "use strict";
    let str = this.toString();
    if (arguments.length) {
        let t = typeof arguments[0];
        let key;
        let args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\$\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
    }
  }

  if(!Element.prototype.removeAllListeners){
    Element.prototype.removeAllListeners = function(){
      this.querySelectorAll('*').forEach(function (e) {
        e.removeAllEventListeners();
      });
    }
  }

  //making copy of addEventListener funciton
  Element.prototype.secondEventListner = Element.prototype.addEventListener;


  //redefining addEventListener
  Element.prototype.addEventListener = function(event, listener, name = undefined, callback){
    this.secondEventListner(event, listener, callback)
    LISTENERS.push({'element':this, 'event':event, 'listener':listener, 'name':name});
  }


  // defining new function to remove all event listners of the given element
  if(typeof Element.prototype.removeAllEventListeners == 'undefined') {
    Element.prototype.removeAllEventListeners = function (callback = false) {
      //looping through the LISTENERS to remove the event of specifinc element
      for (i in LISTENERS) {
        if (LISTENERS[i]['element'] == this) {
          this.removeEventListener(LISTENERS[i]['event'], LISTENERS[i]['listener'], callback);
          LISTENERS[i] = undefined;
        }
      }
      LISTENERS = LISTENERS.filter(function (e) {
        return e != undefined;
      }); //filtering the undefined objects

    }
  }else{
    console.log("element.prototype.removeAllEventListeners already exists");
  }
})();


/*
creates Dom element and return the element
    takes parameter as object
    eg:     parameter = {
            element:"div", //element name
            attribute:"class=drag:id=dragme",  //its attributes seprated with colon
            innerhtml: "hi the is inner html",  //sets the innerhtml of the element
            htmlObj:[createElement(params)] //takes array as value
            }
*/
function createElement(obj){
        //if element parameter is defined
        if(obj.element){
          var elmnt = document.createElement(obj.element);
        }else{
          if(DEBUG) console.log("obj.element is not defined"+obj);
          return undefined;
        }

        //if element attributes are defined else no attribute will be set

        if(obj.attribute){

            let attr = obj.attribute;
            let l = attr.length;

            if(typeof attr === 'function'){
                attr = attr();
            }
          if(attr.substr(l-3,l) === ":?:"){
            attr = attr.substr(0,l-3);
          }

          var b = attr.split(":?:");
          b.forEach(function(e){
          var c = e.split("=");
            var att = document.createAttribute(c[0]);
            att.value = c[1];
            elmnt.setAttributeNode(att);
          })
        }

        //if innerhtml is defined
        if(obj.innerhtml){
          elmnt.innerHTML = obj.innerhtml;
        }

        //if htmlobject is given to append in the element
        if(obj.htmlObj){
          obj.htmlObj.forEach(function(e){
            elmnt.appendChild(e);
          })

        }
        return elmnt;
}
/**
 *
 * @param {string} html encoded string
 * return decoded string with preserved html tags
 */
function decodeHtml(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

//////////////////////////////////////////////////////////////


$(document).ready(function(){

    document.querySelectorAll('.tab').forEach(function(tab){
            let tabContent = tab.attributes.content.value;
            tab.querySelectorAll('button').forEach(function(btn){
                let tabId = btn.attributes.tabcontent.value;
                btn.addEventListener('click',function(){
                    tab.querySelectorAll('button').forEach(function (z) {
                       z.classList.remove('active_tab');
                    });
                    btn.classList.add('active_tab');
                    document.querySelectorAll("#"+tabContent+" div").forEach(function(div){
                        div.style.display = 'none';
                    });
                    document.getElementById(tabId).style.display = 'block';
                });
                if(btn.attributes.default && btn.attributes.default.value.toLowerCase()==='true'){
                    btn.click();
                }
            });
    });

    $("#menu-toggle").click(
        function (e) {
            e.preventDefault();
           $('#wrapper').toggleClass('menuDisplayed');
    });

    $("#prntBtn").click(function(){
        $('#prntHiddenArea').html('');
        $('#prntHiddenArea').html($("#prntArea").html());
        window.print();
    });

    $('.dropdown-menu.drop-menu li').click(function(){
        var txt = $(this).find('a').html();
        $('.dropdown.open input').attr('value',txt);
    })
});
