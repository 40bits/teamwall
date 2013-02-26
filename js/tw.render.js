teamwall.render.fontForHeader = function (canvas) {
    var tenPercentHeight = canvas.height / 10;
    var fontSize = tenPercentHeight / 2;
    var font = fontSize + "pt " + teamwall.configuration.font;
    return font;
};

teamwall.render.fontFor2ndHeader = function (canvas) {
    var tenPercentHeight = canvas.height / 10;
    var fontSize = tenPercentHeight / 3;
    var font = fontSize + "pt " + teamwall.configuration.font;
    return font;
} ;

teamwall.render.font = function (canvas, percentHeight) {
    var masterScaleFactor = canvas.width;
    if (canvas.width > canvas.height) {
        masterScaleFactor = canvas.height;
    }
    var fontSize = (masterScaleFactor / 100 ) * percentHeight;
    var font = fontSize + "pt " + teamwall.configuration.font;
    return font;
};

teamwall.render.perfectFont = function (context, longestText) {
    var textWidth;
    var fontSize = 10;
    var fontSizeIncrement = 2;
    var eightyPercentOfWidth = context.canvas.width*0.8;
    do {
        context.font = fontSize + "pt " + teamwall.configuration.font;
        var metrics = context.measureText(text); // is based on canvas.width
        textWidth = metrics.width;
        fontSize += fontSizeIncrement;
    } while (textWidth < (eightyPercentOfWidth));
    var secondToLastFontSize = (fontSize - (2 * fontSizeIncrement));
    context.font = secondToLastFontSize + "pt " + teamwall.configuration.font;
}

teamwall.render.yPointForDrawingHeading = function (canvas) {
    return canvas.height / 18
};

teamwall.render.yPointForDrawingFooter = function (canvas) {
    return canvas.height - (canvas.height / 18);
};

teamwall.render.yPointForDrawing2ndHeading = function(canvas) {
    return canvas.height - (15.4 * (canvas.height / 18));
} ;

teamwall.render.writeText = function (context, text, x, y, font, color) {
    context.font = font;
    context.textAlign = "center";
    context.fillStyle = color;
    context.textBaseline = "middle";
    context.fillText(text, x, y);
//    context.shadowColor="black";
//    context.shadowBlur = 10;
};
