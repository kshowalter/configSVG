var SVG_attr = require('./svg');

var fixes = {
  cicle: function(config){
    config.props.cx = config.props.x;
    delete config.props.x;
    config.props.cy = config.props.y;
    delete config.props.y;


    return config;
  },
  g: function(config){
    config.props = config.props || {};
    config.props.x = config.props.x || 0;
    config.props.y = config.props.y || 0;
    config.props.transform = 'translate('+ config.props.x +' '+ config.props.y +')';
    delete config.props.x;
    delete config.props.y;

    return config;
  },

  xx: function(config){

    return config;
  }

};


module.exports = function svgize(config){


  config.props = config.props || {};

  if( fixes[config.tag] ){
    config = fixes[config.tag](config);
  }

  if( config.tag === 'svg' ){
    config.props['xmlns'] = 'http://www.w3.org/2000/svg';
    config.props['xmlns:xlink'] = 'http://www.w3.org/1999/xlink';
  }

  config.meta = config.meta || {};
  config.meta.namespaceURI = 'http://www.w3.org/2000/svg';
  config.meta.layer_attr = config.meta.layer_attr || SVG_attr.layer_attr;
  config.meta.fonts = config.meta.fonts || SVG_attr.fonts;

  config.meta.layerName = config.meta.layerName || 'base';
  config.meta.fontName = config.meta.fontName || 'base';

  if( ! (['svg', 'g', 'a'].indexOf(config.tag)+1) ){
    var layer = config.meta.layer_attr[config.meta.layerName];
    for( var name in layer ){
      config.props[name] = layer[name];
    }
  }

  if( ['text', 'textPath', 'title', 'tref', 'tspan'].indexOf(config.tag)+1 ){
    var font = config.meta.fonts[config.meta.fontName];
    for( var name in font ){
      config.props[name] = font[name];
    }
  }

  if( config.children ){
    config.children.map(function(child){
      return svgize(child);
    })
  }

  return config;
};
