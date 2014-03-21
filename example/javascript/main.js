var HTTP = function ( ) {
	var self = this;
	
	self.get = function ( url ) {
		return new Promise( function ( resolve, reject ) {
			var xhr = new XMLHttpRequest();
			xhr.open( 'GET', url );
			
			xhr.onload = function ( ) {
				if ( xhr.status == 200 ) {
					resolve( xhr.response );
				}
				else {
					reject( Error( xhr.statusText ) );
				}
			}
			
			xhr.onerror = function ( ) {
				reject( Error( "Network error" ) );
			}
			
			xhr.send();
		} );
	};
	
	self.getJson = function ( url ) {
		return Promise.cast( self.get( url ).then( JSON.parse ) );
	};
}

var Booking_Search = function ( ) {
	var self = this,
		http = new HTTP(),
		loadPromises = [];
	
	self.init = function ( ) {
		self.loadStarted();
		
		self.loadTypes();
		self.loadResults();
		
		Promise.all( loadPromises ).then( self.loadFinished )
	}
	
	self.loadStarted = function ( ) {
		document.getElementById( 'loading' ).style.display = '';
	}
	
	self.loadFinished = function ( ) {
		document.getElementById( 'loading' ).style.display = 'none';
	}
	
	self.loadTypes = function ( ) {
		var el = document.getElementById( 'search-types' );
		loadPromises.push( http.getJson( 'json/search-types.json' ).then( function ( result ) {
			el.innerHTML = result.reduce( function ( html, item ) {
				html.push( '<option value="'+ item.id +'">'+ item.name +'</option>' );
				return html;
			}, [] ).join( '' );
		} ).catch( function ( error ) {
			el.innerHTML = '<option value="">Unable to load search types.</option>';
			console && console.error( error );
		} ) );
	}
	
	self.loadResults = function ( ) {
		var el = document.getElementById( 'search-results' );
		loadPromises.push( http.getJson( 'json/search-results.json' ).then( function ( result ) {
			el.innerHTML = result.reduce( function ( html, item ) {
				html.push(
					'<li>'+
						'<h2><a href="/hotel/'+ item.id +'">'+ item.name +'</a></h2>'+
						'<p>Type: '+ item.type +'</p>'+
						'<p>Avaliable rooms: '+ item.extra.availableRooms +'</p>'+
					'</li>' );
				return html;
			}, [] ).join( '' );
		} ).catch( function ( error ) {
			el.innerHTML = '<li>Unable to load search results.</li>';
			console && console.error( error );
		} ) );
	}
	
	self.init();
}

var bookingSearch = new Booking_Search();