// HotEditItemView.js
define([
       'underscore', 
       'jquery', 
       'backbone',
       'marionette'
], function(_,$,Backbone,Marionette){
  return Backbone.Marionette.ItemView.extend({
    events: {
      'click .hot-edit': 'hoteditStart',
      'keypress .hot-edit': function(e){ 
        if(e.keyCode === 13) this.hoteditDone(e); 
      }
    },
    nestedExtend: function(target, fields, value){
      var head = fields.shift();
      if (fields.length === 0){
        target[head] = value; 
        return target; 
      }
      target[head] = this.nestedExtend(target[head], fields, value); 
      return; 
    },
    hoteditStart: function(e){
      e.preventDefault();
      var hotEdit = $(e.target).parent();
      if (!hotEdit.hasClass("active")) {
        value = $(e.target).html();
        hotEdit.html("<input type='text' value='" + value + "'>");
        hotEdit.addClass("active");
      }
    },
    hoteditDone: function(e){
      e.preventDefault(); 
      var hotEdit = $(e.target).parent();
      value = $(e.target).val(); 
      var targetField = hotEdit.attr('hot-edit-field');
      var obj = this.nestedExtend(_.clone(this.model.attributes), targetField.split('.'), value); 
      this.model.save(obj, {patch:true});
    }
  });
});
