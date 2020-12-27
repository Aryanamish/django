(function(undefined){
    let root = typeof self == 'object' && self.self === self && self ||
			typeof global == 'object' && global.global === global && global ||
			this ||
			{};

    // let ajaxCallState = false;
    // let timeout = 10000;

    let animateScreen = {
        beforeSend: function(){
                $('#loading').removeClass('animatezoomout').addClass('animatezoomin');
            },
        complete: function () {
                $('#loading').removeClass('animatezoomoin').addClass('animatezoomout');
            }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    root.ajax = {
        saveTemp: function(e){
            let url = e.attributes.url.value;
            $(e).find('input').each(function (p, ui) {
                TempData[$(ui).attr('name')] = ui.value;
            });
            TempData['property'] = property;

            $.ajax({
                ...{
                    url: url,
                    type: 'POST',
                    data: TempData,
                    beforeSend: function () {
                        $('#loading').removeClass('animatezoomout').addClass('animatezoomin');
                    },
                    success: function (result) {
                        result = JSON.parse(result);
                        if (result.save_form) {
                            let html = '';
                            $(e).find('input[name=csrfmiddlewaretoken], button').each(function (p, ui) {
                                html += ui.outerHTML;
                            });
                            $(e).html(result.save_form + html);
                        } else {
                            alert('something is not right Contact website admin')
                        }
                        if (result.status === true) {
                            TempData = result.data;
                            // property = TempData.property;
                            editingMode();
                        } else {
                            if (DEBUG) console.log("something went wrong: " + result.message);

                        }
                    },
                    complete: function () {
                        $('#loading').removeClass('animatezoomoin').addClass('animatezoomout');
                    }
                }, ...animateScreen
            });
        },

    };

})(undefined);
