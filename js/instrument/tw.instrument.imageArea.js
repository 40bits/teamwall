teamwall.instrument.imageArea = function (configuration) {

    function ImageAreaInstrument(configuration) {

        var instrumentConfiguration = configuration;

        this.setValue = function (data) {
            drawInstrument(data);
        };

        this.getConfiguration = function () {
            return instrumentConfiguration;
        };

        this.getInstrumentDrawType = function () {
            return "img";
        };

        function drawInstrument(data) {
		
	    var request = {
                'url': instrumentConfiguration.image_url,
                'success': function(data, textStatus, jqXHR) {
                   var eTag = jqXHR.getResponseHeader('ETag');
	           var imgElement = document.getElementById(instrumentConfiguration.id);
		   imgElement.src = instrumentConfiguration.image_url + "?" + encodeURIComponent(eTag);
	        }
	    };

	    $.ajax(request);
        }

    }

    return new ImageAreaInstrument(configuration)
};
