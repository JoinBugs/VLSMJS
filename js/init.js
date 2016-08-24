( function( window, document, vlsm, undefined )
{
	window.addEventListener( 'load', init, false );

	function init()
	{
		var net = new vlsm.net.Net( {
			'ip' : '192.168.1.2'
		});

		window.net = net;
	}
})
( window, document, vlsm );