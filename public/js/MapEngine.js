var MapEngine = {
    _callback: null,
    init: function(location, callback){       
        this.location.init(location); // init location system
        if (typeof callback === "function") {
            this._callback = callback;
        }else this._callback = null;
    },

    location:{
        _geocoder: null, 
        _location: {
            lat: null,
            lng: null, 
        },

        init: function(find){ 
            this._geocoder = new google.maps.Geocoder(); // create google object
            this.getLatLngByAddress(find); 
        },
        getLatLngByAddress: function(address){ //using avalid global location, find the lat lngs
            var Engine = this;

            this._geocoder.geocode({ 'address': address }, function(results, status){
                if (status == google.maps.GeocoderStatus.OK){
                    Engine._location.lat = results[0].geometry.location.lat();
                    Engine._location.lng = results[0].geometry.location.lng();
                    if(MapEngine._callback !== null && typeof MapEngine._callback === 'function') MapEngine._callback();
                }
            });
        },
        getLatLng: function(){ //public method to retrieve lat longs
            return {lat: this._location.lat, lng:this._location.lng};
        }
    }
};