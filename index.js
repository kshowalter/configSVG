var svgAttrDefaults = require('./svg');

var fixes = {
  cicle: function(specs){
    specs.props.cx = specs.props.x;
    delete specs.props.x;
    specs.props.cy = specs.props.y;
    delete specs.props.y;


    return specs;
  },
  rect: function(specs){

    return specs;
  },
  g: function(specs){
    specs.props = specs.props || {};
    specs.props.x = specs.props.x || 0;
    specs.props.y = specs.props.y || 0;
    specs.props.transform = 'translate('+ specs.props.x +' '+ specs.props.y +')';
    delete specs.props.x;
    delete specs.props.y;

    return specs;
  },

  xx: function(specs){

    return specs;
  }

};


module.exports = function svgize(specs, svgAttr){

  svgAttr.layer_attr = Object.assign({}, svgAttrDefaults.layer_attr, svgAttr.layer_attr); // TODO: find best way to do this only once
  svgAttr.fonts = Object.assign({}, svgAttrDefaults.fonts, svgAttr.fonts); // TODO: find best way to do this only once

  specs.props = specs.props || {};

  if( fixes[specs.tag] ){
    specs = fixes[specs.tag](specs);
  }

  if( specs.tag === 'svg' ){
    specs.props['xmlns'] = 'http://www.w3.org/2000/svg';
    specs.props['xmlns:xlink'] = 'http://www.w3.org/1999/xlink';
  }

  specs.meta = specs.meta || {};
  specs.meta.namespaceURI = 'http://www.w3.org/2000/svg';
  specs.meta.layer_attr = specs.meta.layer_attr || svgAttr.layer_attr;
  specs.meta.fonts = specs.meta.fonts || svgAttr.fonts;

  specs.meta.layerName = specs.meta.layerName || 'base';
  specs.meta.fontName = specs.meta.fontName || 'base';

  if( ! (['svg', 'g', 'a'].indexOf(specs.tag)+1) ){
    var layer = specs.meta.layer_attr[specs.meta.layerName];
    for( var name in layer ){
      specs.props[name] = layer[name];
    }
  }

  if( ['text', 'textPath', 'title', 'tref', 'tspan'].indexOf(specs.tag)+1 ){
    var font = specs.meta.fonts[specs.meta.fontName];
    for( var name in font ){
      specs.props[name] = font[name];
    }
  }

  if( specs.children ){
    specs.children.map(function(child){
      return svgize(child, svgAttr);
    })
  }

  return specs;
};
