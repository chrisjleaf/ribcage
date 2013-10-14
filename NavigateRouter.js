// NavigateRouter.js
// Routes top level routes
define([
       'backbone',
       'commands'
], function(Backbone,commands){
  return Backbone.Router.extend({
    history: [],
    initialize: function(options){
      this.commands = commands; 
      this.commands.setHandler("navigateHome", this.goHome, this);
      this.commands.setHandler("navigateBack", this.goBack, this);
      this.commands.setHandler("navigateTo", this.goToPage, this);
      this.commands.setHandler("urlSet", this.urlUpdate, this);
      this.commands.setHandler("urlBack", this.urlBack, this);
      this.commands.setHandler("urlAppend", this.append, this);
      this.commands.setHandler("urlInsert", this.insert, this);
      this.commands.setHandler("urlTruncate", this.truncate, this);
    },
    cleanRoute: function(route){
      return _.map(route.split('/'), function(frag){
        return  frag.replace(/\s+/g, '-')
                    .replace(/[^\w\/._~:?#\[\]@!$&'\(\)*+,;=%]+/g, '-')
                    .replace(/^[-]+/, '')
                    .replace(/[-]+$/, '')
                    .replace(/[-]+/g, '-'); 
      }).join('/');
    }, 
    goToPage: function(route, options){
      //Extend default args with user defined options
      options = _.extend({
        trigger:true, 
        replace:false,
        pushUrl:false,
        popUrl:false
      }, options);
      
      if(options.pushUrl){
        this.history.push(Backbone.history.fragment);
      }
      if(options.popUrl){
        if(this.history.length <= 0) throw "No history left to pop"; 
        route = this.history.pop();
      }
      route = this.cleanRoute(route); 
      this.navigate(route, options);
      
      if(typeof options.success === 'function'){
        options.success();
      }
    },
    goHome: function(){
      this.goToPage('');
    },
    goBack: function(){
      window.history.back();
    },

    urlUpdate: function(route, options){
      options = _.extend({
        trigger: false, 
        replace: true,
        pushUrl: false,
        popUrl: false
      }, options);

      if(options.pushUrl){
        this.history.push(Backbone.history.fragment);
      }
      if(options.popUrl){
        if(this.history.length <= 0) throw "No history left to pop"; 
        route = this.history.pop();
      }
      route = this.cleanRoute(route);
      this.navigate(route, options);
      if(typeof options.success === 'function'){
        options.success();
      }
    },
    urlBack : function(options){
      options = _.extend({
        popUrl: true
      }, options); 
      this.urlUpdate("", options); 
    }, 
    truncate: function(options){
      var route = Backbone.history.fragment.split('/');
      if(typeof options.by !== 'undefined'){
        route = route.slice(0,route.length - options.by);
      }else if(typeof options.to !== 'undefined'){
        route = route.slice(0,options.to);
      }
      route = route.join('/');

      this.urlUpdate(route, options);
    },
    append: function(suffix, options){
      this.urlUpdate(Backbone.history.fragment + "/" + suffix, options);
    },
    insert: function(str, options){
      var t = Backbone.history.fragment;
      var index = 0; 
        if(options.before && t.indexOf(options.before) > -1 ){
          index = t.indexOf(options.before);
          t = t.substr(0,index) + str + '/' + t.substr(index);
          this.urlUpdate(t, options);
        }else if(options.after && t.indexOf(options.after) > -1 ){
          index = t.indexOf(options.after) + options.after.length + 1;  //one for '/'
          if (t.charAt(index-1) != '/'){
            t = t.substr(0,index) + '/' +  str;
          }else{
            t = t.substr(0,index) + str + '/' + t.substr(index);
        }
        this.urlUpdate(t, options);
      }
    }
    //End 
  });
});
