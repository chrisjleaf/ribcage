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
    filter: function(attrs){
      var obj = _.clone(attrs);
      if(this.whitelist !== null)
        obj = _.pick(obj, this.whitelist);
      if(this.blacklist !== null)
        obj = _.omit(obj, this.blacklist);
      return obj;
    }, 
    toJSON: function(options){
      return this.filter(this.attributes);
    },
    // Override this from the model, gets all attributes
    // Need to return at least the new attributes, but can just extend.
    refresh: function(updates, attrs){
      return {};
    }, 
    update: function(){
      this.set({}); 
    },
    derivedlist: null,
    set: function(k,v,options){
      var key = _.clone(k)
         ,val = _.clone(v); 
      var attrs;
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }
      var tempAttrs = _.extend({}, this.attributes,attrs);
      tempAttrs = _.defaults(tempAttrs, this.defaults);
      _.extend(attrs, this.refresh(attrs, tempAttrs));
      return parent.prototype.set.apply(this,[attrs, options]);
    }
  });
});
