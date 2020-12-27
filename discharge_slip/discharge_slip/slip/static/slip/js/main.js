
window.onload = () =>{
   document.querySelectorAll('.navbar-toggle').forEach((x)=>{
      if(x.attributes.target.value){
         let targetId = x.attributes.target.value;
         x.addEventListener('click',()=>{
            let elmnt = document.getElementById(targetId);
            elmnt.classList.toggle('navbar-hide');
         });
      }
   });



    document.getElementById('print').addEventListener('click',()=>{
       document.querySelectorAll('#pageContent input').forEach((x)=>{
            x.setAttribute("value", x.value);
       });
       document.querySelectorAll('#pageContent textarea').forEach((x)=>{
            x.innerHTML = x.value;

       });

       document.querySelectorAll('#pageContent select').forEach((x)=>{
            x.setAttribute("value", x.value);
            x.querySelectorAll('option').forEach((y)=>{
                if(y.value === x.value){
                    y.setAttribute('selected', 'true');
                }else{
                    y.removeAttribute('selected');
                }
            });

       });

       let data = document.getElementById('pageContent').outerHTML;
       localStorage.setItem('cache', data);

        save();
    });

    if(localStorage.getItem('cache')) {
        document.getElementById('pageContent').outerHTML = localStorage.getItem('cache');
    }
    onload();
};



const onload = ()=>{

    if(document.getElementById('clear')){
        document.getElementById('clear').addEventListener('click', ()=>{
            localStorage.removeItem('cache');
            location.reload();
    });
    }


    document.querySelectorAll('.input-cross-advice').forEach((x)=>{
        x.addEventListener('click', () => {x.parentElement.parentElement.remove();
        document.getElementById('advice_counter').value =
            parseInt(document.getElementById('advice_counter').value) - 1;

        });
    });

    if (document.getElementById('btn_add_advice')) {
        document.getElementById('btn_add_advice').addEventListener('click', () => {
            let counter = parseInt(document.querySelector('input[name=advice_counter]').value);
            document.querySelector('input[name=advice_counter]').value = counter + 1;
            let datalist = createElement({
                'element': 'input',
                attribute: 'required=true:?:list=browsers:?:class=form-control advice:?:name=advice_field_' + counter + ':?:id=id_advice_field_' + counter ,
            });
            let close = createElement({
                element: 'i',
                attribute: "class=input-cross-advice fa fa-times icon",
            });
            close.addEventListener('click', () => close.parentElement.parentElement.remove());

            let input = createElement({
                'element': 'input',
                attribute: 'autocomplete=off:?:type=text:?:class=form-control advice:?:name=advice_value_' + counter + ':?:id=id_advice_value_' + counter,
            });

            let div_col_5 = createElement({
                element: 'div',
                attribute: 'class=col-lg-5 col-sm-5',
                htmlObj: [datalist]
            });

            let div_col_5_2 = createElement({
                element: 'div',
                attribute: 'class=col-lg-push-1 col-sm-push-1 col-lg-5 col-sm-5',
                htmlObj: [close, input]
            });

            let div_row = createElement({
                element: 'div',
                attribute: 'class=row',
                htmlObj: [div_col_5, div_col_5_2],
            });



            document.getElementById('advice').append(div_row);
        });
        document.querySelectorAll('.input-cross-doctor').forEach((x) => {
            x.addEventListener('click', () => {
                x.parentElement.remove();
            });
        });
    }


    document.querySelectorAll('.input-cross-investigation').forEach((x)=>{
        x.addEventListener('click',()=>{
            x.parentElement.remove();
            document.getElementById('investigation_counter').value =
                parseInt(document.getElementById('investigation_counter').value) - 1;
        })
    });

    document.getElementById('btn_add_investigation').addEventListener('click',()=>{
        let counter = parseInt(document.querySelector('input[name=investigation_counter]').value);
        document.querySelector('input[name=investigation_counter]').value = counter + 1;
       let label = createElement({
           element:'label',
           attribute: 'class=control-label',
           innerhtml: 'Date of Investigation'
       });

       let close = createElement({
           element:'i',
           attribute: 'class=input-cross-investigation  fa fa-times icon:?:style=position:relative'
       });

       close.addEventListener('click', ()=> close.parentElement.remove());
       let date = createElement({
            element: 'input',
            attribute: 'class=form-control investigation:?:type=date:?:name=date_of_investigation_' + counter + ':?:id=id_date_of_investigation_' + counter,

        });
        let textarea = createElement({
            element: 'textarea',
            attribute: 'cols=40:?:name=investigation_textarea_' + counter +
                ':?:class=form-control investigation:?:rows=5:?:style=display:inline:?:required:?:id=id_investigation_textarea_' + counter,

        });

        let div_col_3 = createElement({
            element:'div',
            attribute: 'class=col-lg-3 col-sm-3',
            htmlObj:[label],
        });
        let div_col_7 = createElement({
            element:'div',
            attribute: 'class=col-lg-7 col-sm-7',
            htmlObj:[date],
        });

        let div_col_5 = createElement({
            element:'div',
            attribute: 'class=col-lg-5 col-sm-5',
            htmlObj:[div_col_3, div_col_7],
        });
        let div_col_6 = createElement({
            element:'div',
            attribute: 'class=col-lg-6 col-sm-6',
            htmlObj:[textarea],
        });

        let div_row = createElement({
            element:'div',
            attribute: 'class=row',
            htmlObj:[div_col_5, div_col_6, close],
        });

        document.getElementById('investigation').append(div_row);
    });





    document.getElementById('create_new_db').addEventListener('click',(e)=>{
        let target = e.target;
    confirmation();
    });
    document.getElementById('merge_db').addEventListener('click',(e)=>{
        let target = e.target;
        let id = document.querySelector('.selected_db td:nth-child(2)').innerHTML;
        confirmation(id);
    });
};



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
const createElement = (obj)=>{
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


};

const getOffsetTop = (elem)=>{
    let offsetTop = 0;
    do {
      if ( !isNaN( elem.offsetTop ) )
      {
          offsetTop += elem.offsetTop;
      }
    } while( elem = elem.offsetParent );
    return offsetTop;

};

const getOffsetLeft = (elem)=>{
    let offsetLeft = 0;
    do {
      if ( !isNaN( elem.offsetLeft ) )
      {
          offsetLeft += elem.offsetLeft;
      }
    } while( elem = elem.offsetParent );
    return offsetLeft;

};