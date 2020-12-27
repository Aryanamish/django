let d = '';
const save_db = () =>{
    let csrf = document.querySelector('input[name=csrfmiddlewaretoken').value;
    let data = [];
    document.querySelectorAll('input[type=text]').forEach((x)=>{
        if (x.value != ''){
            data.push(x.value);

        }
    });
    data = JSON.stringify(data);
    $.ajax({
        url:db_save_url,
        type: 'POST',
        data: {'data': data, 'csrfmiddlewaretoken': csrf},
        success: (result)=>{
           d = JSON.parse(result);

        }
    })
};