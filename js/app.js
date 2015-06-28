(function($){
    $(function(){
        var isBlocked = ( $('#player-api').children().length == 0 );

        if ( isBlocked ) {
            chrome
            .extension
            .sendMessage(
                {
                    action : 'pleaseProxy',
                    url : window.location.href
                }
            );
        } else {
            chrome
            .extension
            .sendMessage(
                {
                    action : 'clearProxy'
                }
            );
        }
    });
})(jQuery);