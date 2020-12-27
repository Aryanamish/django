
function ajaxCreateDatabase(e){


    let data = {};
    $(e).find('input, textarea').each(function(e,ui){
        data[$(ui).attr('name')] = $(ui).val();
    });

    $.ajax({
        'url':  e.attributes.url.value,
        'data': data,
        'type': $(e).attr('method'),
        'success': function(result){
            result = JSON.parse(result);
            if(result.status === false){
                $(e).html(
                    $(e).find('input[name=csrfmiddlewaretoken]').prop('outerHTML')+
                    result.form +
                    e.querySelector('button').outerHTML
                );
            }else{
                Database = {
                    'db_name':result.db_name,
                    'db_header': JSON.parse(result.db_header),
                    'data': [],
                };
                hideModel();
                renderUpdateForm(result.db_form_update);
                renderTable();
                updateSideBar(result.db_name);
            }
            },
        error: function(xhr){
          alert("Something went wrong")
        },
        complete: function(xhr){
            // $(e).innerHTML = form;
        }
    });

}


function ajaxUpdateDatabase(e){
    let table = document.getElementById('prntArea');
    table = table.querySelector('table');

    table.querySelectorAll('tr').forEach(function(e){
        let blank = true;
        if(e.querySelector('th')!==null){
            blank = false;
        }
       e.querySelectorAll('td input').forEach(function(f){
           if (f.value.trim()!=='' || undefined){
                blank = false
           }
       });
       if (blank===true){
           e.remove();
       }
    });

    Database.data = window.Json2Html.table2json(table, Database.db_header);
    let data = {};
    $(e).find('input, textarea').each(function(e,ui){
        data[$(ui).attr('name')] = $(ui).val();
    });
    data['data'] = JSON.stringify(Database.data);
     $.ajax({
        'url':  e.attributes.url.value,
        'data': data,
        'type': $(e).attr('method'),
        'success': function(result){
            result = JSON.parse(result);
            if(result.status === false){
                $(e).html(
                    $(e).find('input[name=csrfmiddlewaretoken]').prop('outerHTML')+
                    result.form +
                    e.querySelector('button').outerHTML
                );
            }else{
                Database = {
                    'db_name':result.db_name,
                    'db_header': JSON.parse(result.db_header),
                    'data': JSON.parse(result.data),
                };
                hideModel();
                renderTable();
            }
            },
        error: function(xhr){
          alert("Something went wrong")
        },
        complete: function(xhr){
            // $(e).innerHTML = form;
        }
    });
}

function ajaxLoadDatabase(e, btn_val){
    let data = {};
    if(btn_val !== undefined){
        data['db_name'] = btn_val;
    }else{
        data['db_name'] = $(e).find('.load_temp_btn_active').html();
    }

    $(e).find('input').each(function(e,ui){
       data[$(ui).attr('name')] = $(ui).val();
    });

    $.ajax({
        'url': e.attributes.url.value,
        'type': $(e).attr('method'),
        'data': data,
        'success': function(result){
            result = JSON.parse(result);
            if(result.status === true){
                Database = {
                    db_name: result.database.db_name,
                    db_header: JSON.parse(result.database.db_header),
                    data: JSON.parse(result.database.data)
                };
                hideModel();
                renderTable();
                renderUpdateForm(result.db_form_update);
            }
        },
        'error': function(xhr){
            alert(xhr.status);
        },
        'complete': function(xhr){
            //pass
        }
    })

}