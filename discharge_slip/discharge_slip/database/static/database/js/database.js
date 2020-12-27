window.onload = ()=>{
    if (document.getElementById('add_btn')) {
        document.getElementById('add_btn').addEventListener('click', () => {

            let a = createElement({
                'element': 'input',
                attribute: 'type=text:?:class=form-control',
            });
            let close = createElement({
                element: 'i',
                attribute: "class=input-cross-database fa fa-times icon",
            });

            close.addEventListener('click', () => close.parentElement.remove());
            let b = createElement({
                element: 'li',
                htmlObj: [close, a],
            });

            document.getElementById('input_area').append(b);
        });
        document.querySelectorAll('.input-cross-database').forEach((x) => {
            x.addEventListener('click', () => {
                x.parentElement.remove();
            });
        });
    }

    if(document.getElementById('db_save')){document.getElementById('db_save').addEventListener('click', save_db);}
    let params = new URLSearchParams(location.search);
    let no_checkbox = false;
    document.querySelectorAll('input[type=checkbox]').forEach((x)=>{
        let target = x.attributes.target.value;

        if(x.checked === false){
            if(params.get(target)=== null || params.get(target) === ''){
                document.querySelector('[name='+target+']').disabled = true;

            }else {
                x.checked = true;
                no_checkbox = true;
                document.querySelector('[name='+target+']').value = params.get(target);
            }
        }
        x.addEventListener('click', ()=>{
            if(x.checked === true){
                document.querySelector('[name='+target+']').disabled = false;
            }else if(x.checked === false){
                document.querySelector('[name='+target+']').disabled = true;
            }
        });

    });
    if(no_checkbox===false){
        document.querySelector('[target=slip_id]').checked = true;
        document.querySelector('[name=slip_id]').disabled = false;
    }
};