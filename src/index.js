import "proj4"
import "openlayers"

// Lisätään ETRS-TM-35-FIN projektio
proj4.defs("EPSG:3067", "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

var proj3067 = ol.proj.get('EPSG:3067');
proj3067.setExtent([44000, 6594000, 740000, 7782000]);

var dynamicArcGISRestMapServiceUrl = 'http://kkgeoct1.env.fi/arcgis/rest/services/sykemaps/GISAineistot/MapServer/';
    
var layerDynamicDefinition = 
    {"id":277,"source":{"type":"dataLayer","dataSource":{"type":"table","workspaceId":"INSPIRE3","dataSourceName":"GEO.SVW_GEO_TULVARISKIALUE"}},"drawingInfo":{"renderer":{"type":"simple","symbol":{"type":"esriSFS","style":"esriSFSNull","color":[0,0,0,0],"outline":{"type":"esriSLS","style":"","color":[255,0,0,255],"width":2}}}}};

var map = new ol.Map({
    target: 'map',
    renderer: 'canvas'
});

map.setView(new ol.View({
    center: [333000, 6660000],
    zoom: 8,
    projection: new ol.proj.Projection({
        code: "EPSG:3067",
        units: 'm'
    })
}));


var getLayerResolutionLimits = function(layerMinScale, layerMaxScale) {
        
    // TODO: figure out correct value for this
    var conversionConstant = 5000;
    
    var layerMinResolution = 1 / (layerMaxScale * conversionConstant);
    var layerMaxResolution = 1 / (layerMinScale * conversionConstant);
    
    return {minResolution: layerMinResolution, maxResolution: layerMaxResolution};
}
    

var addArcGISDynamicMapServiceLayerAsImageByDefinition = function(layerDefinition, minScale, maxScale, useTiling) {

    var resolutionLimits = getLayerResolutionLimits(minScale, maxScale);
    var layer = null;
    var layerData = {
        url: dynamicArcGISRestMapServiceUrl,
        params: {dynamicLayers:"["+JSON.stringify(layerDefinition)+"]"}
    };
    
    if (useTiling) {
        var source = new ol.source.TileArcGISRest(layerData);
    
        layer = new ol.layer.Tile({
            source: source,
            maxResolution: resolutionLimits.maxResolution,
            minResolution: resolutionLimits.minResolution
        });
    }
    else { // NO TILING:

        var source = new ol.source.ImageArcGISRest(layerData);
    
        layer = new ol.layer.Image({
            source: source,
            maxResolution: resolutionLimits.maxResolution,
            minResolution: resolutionLimits.minResolution
        });
    }

    map.addLayer(layer);
    
}		

addArcGISDynamicMapServiceLayerAsImageByDefinition(layerDynamicDefinition, 1.0 / 4000000, 1.0 / 1000, true);