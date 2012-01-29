// The templates that this file refers to are in public/bb/index.html
// Go to 'localhost:3000/bb/' to see this set of views rendered
(function($){

  window.Course = Backbone.Model.extend({});

  window.Courses = Backbone.Collection.extend({
   model: Course,
   url: "/courses.json"
  }); //Basic collection to store Course Models and where to get them from

  window.courses = new Courses(); // Only for the example so we can do courses.fetch() from server 

  //View to render 1 single course
  window.CourseView = Backbone.View.extend({
    tagName: 'tr',
    className: 'course',

    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
      this.template = _.template($("#course-template").html());
    },

    render: function() {
      var renderedContent = this.template(this.model.toJSON());
      $(this.el).html(renderedContent);
      return this;
    }
  });

  //View to render a list of courses using CourseView
  window.CourseListView = Backbone.View.extend({
    tagName: 'section',
    className: 'courselist',

    initialize: function() {
      _.bindAll(this, 'render');
      this.template = _.template($("#courselist-template").html());
      this.collection.bind('reset', this.render);
    },

    render: function() {
      var $courses,
          collection = this.collection;

      $(this.el).html(this.template({}));
      $courses = this.$(".courses");
      collection.each(function(course) {
        var view = new CourseView({
          model: course,
          collection: collection //Keywords such as model and collection are shortcuts from Backbone
        });
        $courses.append(view.render().el);
      });
      return this;
    }
  });

  // A Router (controller) with just the home route (for now)
  window.CoursesRouter = Backbone.Router.extend({
    routes: {
      '': 'home'
    },

    initialize: function(){
      this.courseListView = new CourseListView({
        collection: window.courses
      });
    },

    home: function(){
      var $container = $('#container');
      $container.empty();
      $container.append(this.courseListView.render().el);
    }
  });

  $(function(){
   window.App = new CoursesRouter();
   Backbone.history.start();
  }); // Can use App.navigate('where_to_route', true) to programatically navigate to other routes

})(jQuery);
