// HotEditItemView.js
define([
       'underscore', 
       'jquery', 
       'backbone',
       'marionette'
], function(_,$,Backbone,Marionette){
  var parent = Backbone.Marionette.ItemView.prototype;
  return Backbone.Marionette.ItemView.extend({
    constructor: function() { 
      this.events = this.events || {}; 
      _.extend(this.events, this.hotEditEvents); 
      parent.constructor.apply(this, arguments); 
    },
    hotEditEvents: {
      'click .hot-edit': 'hoteditStart',
      'keypress .hot-edit': function(e){ 
        if(e.keyCode === 13 && !e.shiftKey) this.hoteditFinish(e); 
      }
    },
    nestedExtend: function(target, fields, value){
      var head = fields.shift();
      if (fields.length === 0){
        target[head] = value; 
        return target; 
      }
      target[head] = this.nestedExtend(target[head], fields, value); 
      return target; 
    },
    hoteditStart: function(e){
      e.preventDefault();
      var hotEdit = $(e.target).parent();
      if (!hotEdit.hasClass("active")) {
        value = $(e.target).html().replace(/^\s+/, '').replace(/\s+$/, ''); 
        hotEdit.html("<input type='text' value='" + value + "'>");
        hotEdit.addClass("active");
        hotEdit.find("input").focus();
        var finish = _.bind(this.hoteditFinish, this); 
        hotEdit.on("focusout", finish); 
      }
    },
    hoteditFinish: function(e){
      e.preventDefault(); 
      var hotEdit = $(e.target).parent();
      value = $(e.target).val().replace(/^\s+/, '').replace(/\s+$/, ''); 
      var targetField = hotEdit.attr('hot-edit-field');
      var obj = this.nestedExtend(_.clone(this.model.attributes), targetField.split('.'), value); 
      targetField = targetField.split('.').shift();
      this.model.save(_.pick(obj, targetField), {patch: true});
      hotEdit.off("focusout");
      hotEdit.removeClass("active");
      hotEdit.html("<p> " + value + "</p>"); 
    },
  });
});
