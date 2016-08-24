( function( window, document, undefined )
{
	var vlsm 	= {},
		ip  	= {},
		net  	= {},
	    subNet 	= {};

	var construct = {};

	( function()
	{
		var areRealParamters = function( PROPS, keys_args )
		{
			var msgError = '';
			if( PROPS.length > keys_args.length )
				msgError = 'there less paramters than required';
			else if( PROPS.length < keys_args.length )
				msgError = 'there more paramters than required';
			else
			{
				for( var i = 0, l = PROPS.length; i < l; i++ )
					if( PROPS[ i ] !== keys_args[ i ] )
						throw new Error( 'unknow paramter : ' + keys_args[ i ] );
				return true;
			}
			throw new Error( msgError );
		};

		this.init = function( cntx, PROPS, args )
		{
			var keys_args = ( function()
				{
					var keys = [];
					for( var key in args )
						keys.push( key );
					return keys;
				})();

			if( areRealParamters( PROPS, keys_args ) )
				for( var i = 0, l = keys_args.length; i < l; i++ )
					cntx[ keys_args ] = args[ keys_args ];
			else
				return false;
		};
	})
	  .apply( construct );

	( function()
	{
		this.IP = IP;

		var EXP_IP = /^((((1?\d{1,2})|(2([0-4]\d?|5[0-5])))\.){3}((1?\d{1,2})|(2([0-4]\d?|5[0-5]))))$/;

		function IP( ip )
		{
			if( EXP_IP.test( ip ) )
				this.ip = ip;
			else
				throw new Error( 'this is a invalid ip' );
		}

		( function()
		{
			var toConvert = {
				'str' : function( oct )
				{
					return oct + "";
				},

				'dec' : function( oct )
				{
					return parseInt( oct );
				},

				'bin' : function( oct )
				{
					var lengthOct	= 8,
						binStr 		= this.dec( oct ).toString( 2 ),
						zeros 		= '';

					for( var i = 0, l = lengthOct - binStr.length; i < l; i++ )
						zeros += '0';
					return zeros + binStr;
				}
			},

			CLASSES = {
				'A' : {
					'range' 	: [ 1, 126 ],
					'ms'		: new IP( '255.0.0.0' ),
					'toString'  : function()
					{
						return 'A';
					}
				},

				'B' : {
					'range' 	: [ 128, 191 ],
					'ms'		: new IP( '255.255.0.0' ),
					'toString'  : function()
					{
						return 'B';
					}
				},

				'C' : {
					'range' 	:  [ 192, 223 ],
					'ms'		: new IP( '255.255.255.0' ),
					'toString'  : function()
					{
						return 'C';
					}
				},
			};

			this.getOctetos = function( converter )
			{
				converter || ( converter = 'str' );

				var octetos 	= this.ip.split( '.' ),
					octetosStr 	= [];
				for( var i = 0, l = octetos.length; i < l; i++ )
					octetosStr.push( toConvert[ converter ]( octetos[ i ] ) );
				return octetosStr;
			};

			this.getOcteto = function( pos, converter )
			{
				return this.getOctetos( converter )[ pos ];
			};

			this.getClass = function()
			{
				var octeto = this.getOcteto( 0, 'dec' );

				for( var key in CLASSES )
				{
					var classe = CLASSES[ key ],
						range  = classe.range;
					if( octeto >= range[ 0 ] && octeto <= range [ 1 ] )
						return classe;
				}
			};

			this.isPrivate = function()
			{
				var octeto1 = this.getOcteto( 0, 'dec' ),
					octeto2 = this.getOcteto( 1, 'dec' );

				return ( ( octeto1 === 10 ) ||
					     ( octeto1 === 172 && ( octeto2 > 15 && octeto2 < 32 ) ) ||
					     ( octeto1 === 192 && octeto2 === 168 ) );
			};

			this.isPublic = function()
			{
				return !this.isPrivate();
			};
		})
		  .apply( IP.prototype );
	})
	  .apply( ip );

	( function()
	{
		this.Net = Net;

		function Net( args )
		{
			/*var props = [
				'ip',
				'ms'
			];
			construct.init( this, props, args );*/
		    this.setIP( args.ip );
		    this.setMS( args.ms );
		}

		( function()
		{
			// props privates
			var isMS = function( ip )
			{
				var strIP = ip.getOctetos( 'bin' ).join( '' );
				for( var i = 0, l = strIP.length; i < l; i++ )
					if( strIP[ i ] === '0' )
						break;
				for( var j = i; j < l; j++ )
					if( strIP[ j ] === '1' )
						return false;
				return true;
			};

			this.getAbrevMS = function()
			{
				var octetos = this.ms.getOctetos( 'bin' ),
					abrev   = 0;
				for( var i = 0, l = octetos.length; i < l; i++ )
					for( var j = 0, k = octetos[ i ].length; j < k; j++ )
					{
						if( octetos[ i ][ j ] === '0' )
							break;
						abrev += 1;
					}
				return abrev;
			};

			this.getIP = function()
			{
				return this.ip;
			};

			this.getMS = function()
			{
				if( !this.hasOwnProperty( 'ms' ) )
					return this.getIP().getClass().ms;
				return this.ms;
			};

			this.setIP = function( ipStr )
			{
				this.ip = new ip.IP( ipStr );
			};

			this.setMS = function( msStr )
			{
				msStr || ( msStr = this.getMS().ip );
				var ms = new ip.IP( msStr );
				if( !isMS( ms ) )
					throw new Error( 'that is not a subnet mask valid' );
				this.ms = ms;
			};
		})
		  .apply( Net.prototype );
	})
	  .apply( net );

	( function()
	{
		this.SubNet = SubNet;

		function SubNet( args )
		{
			construct.init( this, [ 'hosts', 'net' ], args )
		}

		( function()
		{
			this.getBitsHosts = function()
			{
				var hostCurrent = 2;
				for( var i = 1; hostCurrent < this.hosts; i++ )
					hostCurrent *=2;
				return i;
			};

			this.getRangeIPHosts = function()
			{

			};

			this.getNet = function()
			{

			};

			this.getBroadCast = function()
			{

			};
		})
		  .apply( SubNet.prototype );
	})
	  .apply( subNet );

	( function()
	{

	})
	  .apply( vlsm );

	vlsm.ip  = ip;
	vlsm.net = net;
	vlsm.subNet = subNet;
	window.vlsm = vlsm;
})
( window, document );