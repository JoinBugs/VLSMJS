var cntx = {};
		cntx[ 'priors' ] = {

			'exps' : [ /\(*(\w+)){1}/ ],

			check : function( str )
			{
				var exps = this.exps;
				for( var i = 0, = exps.length; i < l; i++ )
				{
					var test = exps[ i ].exec( str );
					if( test !== null )
						return test[ test.length - 1 ];
				}
				return false;
			}
		},

		validate = function( KEYS, values, tryError )
		{
			tryError || ( tryError = function( key )
			{
				throw new Error( 'check parameter *-----' +  key + '-----*' );
			});

			var priors 		= cntx.priors,
				validates 	= [];
			for( var i = 0, l = KEYS.length; i < l; i++ )
			{
				var priory = priors[ KEYS[ i ] ];
				if( !priors.check( KEYS[ i ] ) )
				{
					tryError( KEYS[ i ] );
					break;
				}
				validates.push( KEYS[ i ] );
			}
			return validates;
		};