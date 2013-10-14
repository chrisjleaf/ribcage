// DerivedModel.js
// Common Extension of backbone models providing utilities for derived 
// model fields. 
define([
       'backbone'
],function(Backbone){
  var parent = Backbone.Model;
  return Backbone.Model.extend({
    whitelist: null, 
    blacklist: null,
    toJSON: function(options){
      var obj = _.clone(this.attributes);
      if(this.whitelist !== null)
        obj = _.pick(obj, this.whitelist);
      if(this.blacklist !== null)
        obj = _.omit(obj, this.blacklist);
      return obj;
    },
    // Override this from the model, gets all attributes
    // Need to return at least the new attributes, but can just extend.
    refresh: function(attrs){
      return {};
    }, 
    update: function(){
      this.set({}); 
    },
    derivedlist: null,
    set: function(key,val,options){
      var attrs;
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }
      var tempAttrs = _.extend({}, this.attributes,attrs);
      tempAttrs = _.defaults(tempAttrs, this.defaults);
      attrs = _.extend(attrs, this.refresh(tempAttrs));
      return parent.prototype.set.apply(this,[attrs, options]);
    }
  });
});
