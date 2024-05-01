function isFullPlayerNotSupported() {
    return swfobject.ua.mac && swfobject.getFlashPlayerVersion().major === 7
}

function shouldRedirectToStaticObjectPage() {
    return true //swfobject.ua.mac || (swfobject.ua.win && swfobject.ua.ie);
}

if (shouldRedirectToStaticObjectPage()) {
    var id = window.location.pathname.split("/player-object/")[1];
    var url = isFullPlayerNotSupported()? "/player-simple/" + id : "/player/" + id;
    window.location.replace(url);
} else {
    // Assuming it's OK to use SWFObject to embed the music player.

    /* Adobe recomienda a los desarrolladores utilizar SWFObject2 para la detección de Flash Player.
    Para obtener más información, consulte la página del objeto SWFObject en Google Code (http://code.google.com/p/swfobject/).
    La información también está disponible en el Centro de desarrollo de Adobe, en el artículo sobre "detección de las versiones de Flash Player e incorporación de archivos SWF con SWFObject 2 (en inglés)"
    Establézcalo en la versión mínima requerida de Flash Player o en 0 si no quiere activar la detección de la versión */
    
    var swfVersionStr = "6.0.0";
    //xiSwfUrlStr se puede utilizar para definir un archivo SWF de instalación rápida.
    var xiSwfUrlStr = "";
    var flashvars = {};
    var flashvars = JSON.parse($("#flashData").html());
    var params = {};
    params.quality = "high";
    params.play = "true";
    params.loop = "false";
    params.wmode = "transparent";
    params.scale = "showall";
    params.menu = "true";
    params.devicefont = "false";
    params.salign = "";
    params.allowscriptaccess = "sameDomain";
    var attributes = {};
    attributes.id = "player";
    attributes.name = "player";
    attributes.align = "middle";
    // swfobject.createCSS("html", "height:100%; background-color: #ffffff;");
    // swfobject.createCSS("body", "margin:0; padding:0; overflow:hidden; height:100%;");
    swfobject.embedSWF(
        "/yonic-corner-music-player.swf", "flashContent",
        "196", "196",
        swfVersionStr, xiSwfUrlStr,
        flashvars, params, attributes);
}