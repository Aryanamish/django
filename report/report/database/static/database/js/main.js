let Database = [{data: {},db_name: ""}];
$(document).ready(function() {
    document.getElementById("menu-toggle").click();
    // hideModel();

    $('#tab .tablinks').click(function () {
        let id = $(this).attr('body');
        $('#tab .tablinks').removeClass('active')
        $(this).addClass('active')
        $(".tabcontent").css('display', 'none');
        $("#" + id).toggle();

    });
    $("#tab button.default").click();


    $('.load_temp_btn').click(function () {
        $('.load_temp_btn').removeClass('load_temp_btn_active');
        $(this).addClass('load_temp_btn_active');

    });


});


function hideModel(){
    $('#database').css('display','none');
    $('.save-btn').css('display','block');
}


function renderTable(){
    $('#prntArea').html('');
    let header =  Database.db_header;
    Database.data = Database.data;
    window.Json2Html.json2table(Database.data,header,{parentId:'prntArea',edit:true});
    let button = {
        element:'button',
        attribute:'class=button:?:id=add_more_row',
        innerhtml: '+',
    };
    button = createElement(button);

    let parent = document.querySelector('#prntArea table tbody');
    button.addEventListener('click',function(e){
        let option = {
        edit: true,
        returnHeader: false,
        returnTable: false,
        td: {
            "<>": 'td',
            html: [{
                "<>": 'input',
                type: 'text',
                'value':''
            }]
        },
        output: 'str',
        };


        let tr = window.Json2Html.json2table([{}],header, option);

        parent.innerHTML += tr +tr +tr+tr+tr;
    });
    document.getElementById('prntArea').append(button);
    let table = document.getElementById('prntArea').querySelector('table');


    let menu = new RightClickMenu();
    menu.menuFunction = {
        add_col: function(){
            console.log('column added');
        },
        delete_col: function(){
            console.log('column deleted');
        },
        add_row: function(){
            console.log('row added');
        },
        delete_row: function(){
            console.log('row deleted');
        }
    };
    menu.menuObj('rightClickMenu', 'table', 'li');
}

function renderUpdateForm(db_form_update){
    $('#modal_start').css('display','none');
    let update_form = $('#modal_end').find('form');
    update_form.css('display','block');
    let button = update_form.find('button').prop('outerHTML');
    let csrf = update_form.find('input[name=csrfmiddlewaretoken]').prop('outerHTML');
    update_form.html(csrf + db_form_update+ button);
    let textarea = update_form.find('textarea[name=fields]').html();
    let fields = '';
    try {
        fields = JSON.parse(textarea);
        let l = fields.length;
        let str='';
        for(let i=0;i<l;i++){
            str +=fields[i] +',';
        }
        str = str.substr(0,str.length-1);
        update_form.find('textarea[name=fields]').html(str);
    }
    catch(err){
        //nothing
    }

}


function updateSideBar(db_name){
    let onclick = "ajaxLoadDatabase(document.querySelector('#editDatabase form'), '${0}')".format(db_name);
    let a = {
        element:'a',
        attribute: 'href=#:?:onclick=${0}'.format(onclick),
        innerhtml: db_name,
    };
    let li = {
        element:'li',
        htmlObj: [createElement(a)]
    };
    li = createElement(li);
    document.querySelector('#sidebar-wrapper ul').append(li)
}

 window.addEventListener('click',function(){
    var a = document.getElementById('rightClickMenu');
    a.style.display="none";
  });

