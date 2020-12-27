$(document).ready(function(){
    (function(){
        let counter = {};

        function addPropertyToElement(elmnt){
            //adding drag property
            $(elmnt).draggable({
                cancel: null,
                stop : function(e,ui){

                  //pass
                },
                containment : '#page-content-wrapper',
            });

            //adding resize property
            $(elmnt).resizable({
                alsoResize: $(elmnt).find('*'),
                stop: function(e,ui){
                  //pass
                }
            });

        }


        const sidebar_fun = {
            'createTextbox': function () {
                if (!counter.textBox){
                    counter['textBox'] = 0;
                }else{
                    counter['textBox'] +=1;
                }
                let params = {
                    element: 'input',
                    attribute: 'class=dragClickMe:?:type=text',
                };

                //wrapping around div element
                let parameter = {
                    element: "div",
                    attribute: "class=drag:?:id=textbox${0}".format(counter.textBox),

                    htmlObj: [createElement(params)]
                };
                let elmnt = createElement(parameter);
                document.getElementById('prntArea').appendChild(elmnt);
                addPropertyToElement(elmnt);
            }
        };

            let content = document.getElementById('sidemenu_content');
            content.querySelectorAll('a').forEach(function(e){
                let data = e.attributes.eventFunction.value;
                data = data[data.length-1]===';' ? data.substr(0, data.length-1): data;
                data = data.split(';');
                let l = data.length;
                for (let i=0;i<l;i++){
                    let fun = data[i].split(":");
                    e.addEventListener(fun[0],sidebar_fun[fun[1]]);
                }
            });
    })();
});
