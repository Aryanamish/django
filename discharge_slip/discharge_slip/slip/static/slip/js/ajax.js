let d = '';
const save = ()=>{
    const csrf= document.querySelector('input[name=csrfmiddlewaretoken]').value;

    let send_data = {};

    document.querySelectorAll('#pageContent input:not(.investigation):not(.advice), #pageContent select, #pageContent textarea:not(.investigation)').forEach((x)=>{
        send_data[x.name] = x.value;
    });

    let investigation = parseInt(document.getElementById('investigation_counter').value);

    for(let i=0; i< investigation; i++){
        let date_name, txt_name;
        if(i === 0){
            date_name = 'date_of_investigation';
            txt_name = 'investigation_textarea'
        }else{
            date_name = 'date_of_investigation_' + i;
            txt_name = 'investigation_textarea_' + i;
        }

        send_data[date_name] = document.querySelector('input[name='+ date_name +']').value;
        send_data[txt_name] = document.querySelector('textarea[name='+ txt_name +']').value;
    }

    let advice = parseInt(document.getElementById('advice_counter').value);
    for(let i=0; i< advice; i++){
        let advice_field, advice_value;
        if(i === 0){
            advice_field = 'advice_field';
            advice_value = 'advice_value'
        }else{
            advice_field = 'advice_field_' + i;
            advice_value = 'advice_value_' + i;
        }

        send_data[advice_field] = document.querySelector('input[name='+ advice_field +']').value;
        send_data[advice_value] = document.querySelector('input[name='+ advice_value +']').value;
    }


    send_data['csrfmiddlewaretoken'] = csrf;
    $.ajax({
        url: url_save,
        type: 'POST',
        data: send_data,
        beforeSend:()=>{
            document.querySelector('.modal-header-hide').style.display = 'none';
            document.querySelector('.modal-footer-hide').style.display = 'none';
            document.getElementById('progress').style.display = 'block';
            document.getElementById('success').style.display='none';
            document.getElementById('error').style.display='none';
            document.getElementById('modal-close').style.display='none';
            document.getElementById('data').style.display = 'none';
            document.getElementById('btn_patient_select').click();

            let bar = document.getElementById('progress_bar');
            bar.style.width = '0%';
            let progress_bar = ()=>{
                bar.style.width = parseInt(bar.style.width) + 1 + '%';
                if(parseInt(bar.style.width) > 100){
                    return;
                }
                setTimeout(progress_bar, 50);
            };
            progress_bar();

        },
        success: (result)=>{
            result = JSON.parse(result);
            d = result;
            if(result.valid === false){
                let bar = document.getElementById('progress_bar');
                let check_progress_bar = ()=>{
                if(parseInt(bar.style.width) > 100){
                    show_error();
                    return;
                }
                setTimeout(check_progress_bar, 100);
            };
                check_progress_bar();
                document.getElementById('dump').innerHTML = result.rendered;

            }else if(result.error === true){
                alert(result.message);
            }else if(result.confirmation === true){
                display_modal(result.patient, result.header)
            }
            if(result.printed === true){
                let bar = document.getElementById('progress_bar');
                let check_progress_bar = ()=>{
                if(parseInt(bar.style.width) > 100){
                    show_success();
                    return;
                }
                setTimeout(check_progress_bar, 100);
            };
                check_progress_bar();

            }

        },
        error: (result)=>{
            document.getElementById('progress').style.display = 'none';
            document.getElementById('error').style.display = 'none';

        }
    })
};

const confirmation = (id=null)=>{
    const csrf= document.querySelector('input[name=csrfmiddlewaretoken]').value;
    let data = {'csrfmiddlewaretoken': csrf, 'confirmation': true};
    if(id != null ){
        data['patient_id'] = id
    }

    $.ajax({
        url: url_save,
        type: 'POST',
        data: data,
        success: (result)=>{
            result = JSON.parse(result);
            d = result;
            if(result.valid === false){
                document.getElementById('dump').innerHTML = result.rendered;
            }else if(result.error === true){
                alert(result.message);
            }else if(result.confirmation === true){
                display_modal(result.patient, result.header)

            }

        },
    })
};

function display_modal(patient, header){
    let modal = document.getElementById('patient_select');
    let body = modal.querySelector('.modal-body');
    let table = {
        element: 'table',
        attribute: 'class=table patient_table',
        htmlObj: []
    };
    let th = {
        element:'tr',
        htmlObj:[]
    };
th.htmlObj.push(createElement({
        element: 'th',
        innerhtml:'Select',


    }));
    th.htmlObj.push(createElement({
        element: 'th',
        innerhtml:'Patient Id',


    }));
    th.htmlObj.push(createElement({
        element: 'th',
        innerhtml:'Name',

    }));
    th.htmlObj.push(createElement({
        element: 'th',
        innerhtml:'Age',

    }));
    th.htmlObj.push(createElement({
        element: 'th',
        innerhtml:'Sex',

    }));
    th.htmlObj.push(createElement({
        element: 'th',
        innerhtml:'Phone',

    }));
    th.htmlObj.push(createElement({
        element: 'th',
        innerhtml:'Accuracy',

    }));
    table.htmlObj.push(createElement(th));
    for(let i in patient){

        if(patient.hasOwnProperty(i)){
            let tr = {
            element:'tr',
            htmlObj: []
            };

            td_radio = {
                element:'td',
                htmlObj:[]
            };

            td_radio.htmlObj.push(createElement({
                element: 'input',
                attribute:'class=radio:?:type=radio:?:name=choice'
            }));

            tr.htmlObj.push(createElement(td_radio));

            tr.htmlObj.push(createElement({
                element:'td',
                innerhtml: i,
            }));
            for(let j=0; j < patient[i].length; j++){
                let val = patient[i][j];

                tr.htmlObj.push(createElement({
                    element: 'td',
                    innerhtml: val.toString(),
                }));
            }
            table.htmlObj.push(createElement(tr));
        }
    }
    table = createElement(table);
    console.log(table);
    body.innerHTML = '';
    body.appendChild(table);
    document.querySelector('.modal-header-hide').style.display = 'block';
    document.querySelector('.modal-footer-hide').style.display = 'block';

    document.getElementById('progress').style.display = 'none';
    document.getElementById('data').style.display = 'block';
    document.getElementById('modal-close').style.display = 'block';

    document.getElementById('modal_header').innerHTML = header;


    document.querySelectorAll('table td input[type=radio]').forEach((x)=>{
        x.addEventListener('click',()=>{
            if(x.checked===true){
                document.querySelectorAll('table tr').forEach((y)=>{
                    y.classList.remove('selected_db');
                });
                 x.parentElement.parentElement.classList.add('selected_db');
            }
        });
    });

}

const show_success = ()=>{
    document.querySelector('.modal-header-hide').style.display = 'none';
    document.querySelector('.modal-footer-hide').style.display = 'none';

    document.getElementById('progress').style.display = 'none';
    document.getElementById('data').style.display = 'none';
    document.getElementById('success').style.display='block';
    document.getElementById('modal-close').style.display='block';
};

const show_error = ()=>{
    document.querySelector('.modal-header-hide').style.display = 'none';
    document.querySelector('.modal-footer-hide').style.display = 'none';

    document.getElementById('progress').style.display = 'none';
    document.getElementById('data').style.display = 'none';
    document.getElementById('success').style.display='none';
    document.getElementById('modal-close').style.display='block';

    document.getElementById('error').style.display='block';

};