(($) => {
    var Run = () => {
        var roomname = $('#enterRoom').val();
        var nickname = $('#enterNick').val();
        if (roomname.length >= 5 && nickname != '' && roomname.indexOf('_') < 0 && nickname.indexOf('_') < 0) {
            window.location.href = '/room/' + roomname + '_' + nickname;
        } else {
            alert('房間名稱要大於5個字，暱稱不得空白，都不能有底線');
        }
    }

    $(() => {
        var socket = io.connect();
        socket.on('playerlist', (data) => {
            $('#allpeople').text(data.length);
        });
        socket.on('roomlist', (data) => {
            if (data.length == 0) {
                $('#roomsctrl').hide();
            } else {
                $('#roomsctrl').show();
                $('#rooms').html('');
                for (var i = data.length - 1, j = 0; i >= 0 && j < 10; --i, ++j) {
                    $('#rooms').append('<button id="rb' + i + '" type="button" class="btn btn-' + (data.data[i].playerLen != 2 ? 'success' : 'danger') + ' btn-wide">' + data.data[i].name + '</button>');
                    $('#rb' + i).bind('click', {
                        name: data.data[i].name
                    }, (event) => {
                        if ($('#enterNick').val() != '') {
                            window.location.href = '/room/' + event.data.name + '_' + $('#enterNick').val();
                        } else {
                            alert('請輸入暱稱');
                        }
                    });
                }
            }
        });
        $('#enterRoom').keypress((e) => {
            if (e.which == 13) {
                Run();
                return false;
            }
        });
        $('#enterNick').keypress((e) => {
            if (e.which == 13) {
                Run();
                return false;
            }
        });
        $('#enter').on('click', () => {
            Run();
        });
    });
})(jQuery);