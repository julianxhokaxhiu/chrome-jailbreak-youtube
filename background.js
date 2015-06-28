var saveProxyList = function () {
        proxies['timestamp'] = Date.now();
        window.localStorage.setItem( 'proxyData', JSON.stringify( proxies ) );
    },
    loadProxyList = function () {
        var ret = proxies;

        if ( !ret )
            ret = ( !window.localStorage.getItem('proxyData') ? {} : JSON.parse( window.localStorage.getItem('proxyData') ) );

        return ret;
    },
    switchToNextProxy = function () {
        // Save the current list
        saveProxyList();
        // Move to the next
        nextProxy = proxies.list[0];
        // Set the new proxy
        setProxy( lastUrl, nextProxy );
    },
    sortJSON = function (json, prop, asc) {
        return json.sort(function(a, b) {
            if (asc) return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            else return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        });
    },
    setProxy = function ( customUrl, proxy ) {
        var config = {
                mode: "pac_script",
                pacScript: {
                data: "function FindProxyForURL(url, host) {\n" +
                    "    if ( url == '" + customUrl + "' ) return 'PROXY " + proxy.ip + ":" + proxy.port + "';\n" +
                    "    return 'DIRECT';\n" +
                    "  }"
                }
            };

        console.log( '=> Proxy set to: ' + proxy.ip + ':' + proxy.port );

        chrome.proxy.settings.set(
            {
                value: config,
                scope: 'regular'
            },
            function(){
                reloadTab();
            }
        );
    },
    reloadTab = function ( id ) {
        // Reload the tab
        chrome.tabs.reload( proxyTabId );
    },
    canFetch = function () {
        var now = Date.now(),
            diffInHours = ( 'timestamp' in proxies ? ( now - proxies['timestamp'] ) / ( 3600*1000 ) : null ),
            ret = false;

        if ( diffInHours === null || diffInHours > 3 ) ret = true;

        return ret;
    },
    proxies = loadProxyList(),
    lastUrl = '',
    proxyTabId = null;

chrome.proxy.onProxyError.addListener( function ( details ){

    // Do we have some proxies?
    if ( proxies.list.length ) {
        console.log( '=> Moving to the next Proxy' );
        // Remove this proxy server that didn't work
        proxies.list.splice(0, 1);
        // Move to next proxy
        switchToNextProxy();
    } else {
        console.log( '=> No more proxies to test. Clearing and restarting...' )
        chrome.proxy.settings.clear( {}, function(){} );
    }

    return true;
});

chrome.extension.onMessage.addListener( function ( request, sender, sendResponse ){
    if ( request.action == 'pleaseProxy' ) {
        if ( canFetch() )
            $
            .when(
                // Get all HTTPS server with port 3128
                $.post( 'http://spys.ru/en/https-ssl-proxy/', {
                    xpp:3,
                    xf1:1,
                    xf2:1,
                    xf4:1
                }),
                // Get all HTTPS server with port 8080
                $.post( 'http://spys.ru/en/https-ssl-proxy/', {
                    xpp:3,
                    xf1:1,
                    xf2:1,
                    xf4:2
                }),
                // Get all HTTPS server with port 80
                $.post( 'http://spys.ru/en/https-ssl-proxy/', {
                    xpp:3,
                    xf1:1,
                    xf2:1,
                    xf4:3
                })
            )
            .done( function () {
                var args = Array.prototype.slice.call(arguments),
                    proxyList = [];

                args
                .forEach( function ( result ){
                    var $data = $( result[0] ),
                        $port = $data.find( '#xf4 option:selected' ),
                        $rows = $data.find( 'tr[class*="spy1x"][onmouseover]' );

                    $rows
                    .each( function ( i, row ){
                        var $row = $(row),
                            $ip = $row.find( 'td:eq(0) font.spy14' ),
                            $speed = $row.find( 'td:eq(6) table' ),
                            proxy = {};

                        $ip
                        .find('script')
                        .remove();

                        proxy['ip'] = $ip.text();
                        proxy['speed'] = parseInt( $speed.attr('width') );
                        proxy['port'] = $port.text();

                        proxyList.push( proxy );
                    });
                });

                proxies['list'] = sortJSON( proxyList, 'speed', false ); // DESC - First is the fastest
                lastUrl = request.url;
                proxyTabId = sender.tab.id;

                // Set proxy only for the current URL
                switchToNextProxy();
            });
        else {
            lastUrl = request.url;
            proxyTabId = sender.tab.id;
            // Set proxy only for the current URL
            switchToNextProxy();
        }
    } else if ( request.action == 'clearProxy' )
        chrome.proxy.settings.clear( {}, function(){} );

	return true
});
