'use strict';

angular.module('chronogramApp', ['ui.router','ngResource','ngDialog', 'lbServices'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'HomeController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })
        
            // route for the aboutus page
            .state('app.aboutus', {
                url:'aboutus',
                views: {
                    'content@': {
                        templateUrl : 'views/aboutus.html',
                        controller  : 'AboutController'                  
                    }
                }
            })
        
            // route for the contactus page
            .state('app.contactus', {
                url:'contactus',
                views: {
                    'content@': {
                        templateUrl : 'views/contactus.html',
                        controller  : 'ContactController'                  
                    }
                }
            })

            // route for the menu page
            .state('app.chronogram', {
                url: 'chronograms',
                views: {
                    'content@': {
                        templateUrl : 'views/chronogram.html',
                        controller  : 'ChronogramController'
                    }
                }
            })

            // route for the chronogram details page
            .state('app.chronogramDetails', {
                url: 'menu/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/chronogramDetails.html',
                        controller  : 'ChronogramDetailController'
                   }
                }
            })
        
            // route for the taks list page
            .state('app.tasks', {
                url: 'tasks/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/tasks.html',
                        controller  : 'TaskController'
                   }
                }
            })
            // route for the task details page
            .state('app.taskDetails', {
                url: 'Tasks/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/taskDetails.html',
                        controller  : 'TaskDetailController'
                   }
                }
            })
        
            // route for the dishdetail page
            .state('app.favorites', {
                url: 'favorites',
                views: {
                    'content@': {
                        templateUrl : 'views/favorites.html',
                        controller  : 'FavoriteController'
                   }
                }
            });
    
        $urlRouterProvider.otherwise('/');
    })
;
