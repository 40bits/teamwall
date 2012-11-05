function TeamwallApp() {

  var instruments = [];

  this.loadDashboard = function () {

    $.ajax({
             url:"teamwall.json",
             cache:false,
             success:function (data) {
               jQuery.each(data, function () {
                 var instrumentData = this;
                 var instrument;

                 var canvas = document.createElement("canvas");
                 canvas.id = instrumentData.id;
                 canvas.width = instrumentData.width;
                 canvas.height = instrumentData.height;
                 canvas.setAttribute("style", "margin: 5px");
                 document.body.appendChild(canvas);

                 switch (instrumentData.instrument) {
                   case "percent" :
                     instrument = teamwall.instrument.percent(instrumentData);
                     break;
                   case "buildchain" :
                     instrument = teamwall.instrument.buildChain(instrumentData);
                     break;
                   case "number" :
                     instrument = teamwall.instrument.number(instrumentData);
                     break;
                   default:
                     break;
                 }
                 instruments.push(instrument);
               });
             },
             statusCode:{
               404:function () {
                 alert("Please add a teamwall.json file to the installation.");
               }}
           });
    window.setInterval(updateInstruments, 1000);
  };

  function updateInstruments() {
    jQuery.each(instruments, function () {
      var instrument = this;
      $.ajax({
               url:instrument.getConfiguration().url,
               cache:false,
               success:function (data) {
                 instrument.setValue(data);
               }
             });
    });
  }
}
