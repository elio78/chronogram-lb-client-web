'use strict';
var chronoId="";
var taskId="";
var errorMessage = "";
var currentChronogram = {};
var currentTask = {};

angular.module('chronogramApp')

.controller('ChronogramController', ['$scope', 'ngDialog', '$rootScope', '$state', '$stateParams','Chronograms', 'Favorites', 'AuthService', function ($scope, ngDialog, $rootScope, $state, $stateParams, Chronograms, Favorites, AuthService) {

    var ctrl="ChronogramController";
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showFavorites = false;
    $scope.showDelete = false;
    $scope.showMenu = false;
    $scope.username="whoami";
    $scope.newChronogram = {};
    $scope.newChronogram.status = "defined";
	$scope.newChronogram.state = "defined";
	$scope.newChronogram.plannedDuration = "30";
	$scope.newChronogram.createdAt = Date.now();
	$scope.newChronogram.effectiveDuration = 0;
	$scope.newChronogram.responsibles = [$scope.username];
	$scope.newChronogram.tasks=[];
    $scope.username = "anonymous"; 
    if(AuthService.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthService.getUsername();
    } 
	

    $scope.message = "Loading ...";

    Chronograms.find()
        .$promise.then(
        function (response) {
            $scope.Chronograms = response;
            $scope.showMenu = true;

        },
        function (response) {
            $scope.message = ctrl+":Error: " + response.status + " " + response.statusText;
        });

    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "defined";
        } else if (setTab === 3) {
            $scope.filtText = "started";
        } else if (setTab === 4) {
            $scope.filtText = "delayed";
        } else if (setTab === 5) {
            $scope.filtText = "terminated";
        } else {
            $scope.filtText = "";
        }
    };
    
    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        console.log("toggleDetails 2");
        $scope.showDetails = !$scope.showDetails;
    };
    $scope.toggleFavorites = function () {
        $scope.showFavorites = !$scope.showFavorites;
    };
    $scope.toggleDelete = function () {
        console.log("toggleDelete 2");
        $scope.showDelete = !$scope.showDelete;
    };
    
    $scope.addToFavorites = function(chronogramid) {
        Favorites.create({customerId: $rootScope.currentUser.id, ChronogramsId: chronogramid});
        $scope.showFavorites = !$scope.showFavorites;
    };
    $scope.openNewChronogram = function () {
        ngDialog.open({ template: 'views/newchronogram.html', scope: $scope, className: 'ngdialog-theme-default', controller:"ChronogramController" });
    };

     $scope.doCreateChronogram = function () {
        console.log('Doing chronogram creation'+ $scope.newChronogram);
        console.log("name...............:"+$scope.newChronogram.name);
        console.log("description........:"+$scope.newChronogram.description);
        console.log('Username...........:'+$scope.newChronogram.username);
        console.log('plannedStartDate...:'+$scope.newChronogram.plannedStartDate);
        console.log('effectiveStartDate.:'+$scope.newChronogram.effectiveStartDate);
        console.log("status.............:"+$scope.newChronogram.status);
	console.log("state..............:"+$scope.newChronogram.state);
	console.log("plannedDuration....:"+$scope.newChronogram.plannedDuration);
	console.log("createdAt..........:"+$scope.newChronogram.createdAt);
	console.log("effectiveDuration..:"+$scope.newChronogram.effectiveDuration);
	console.log("responsibles.......:"+$scope.newChronogram.responsibles);
	console.log("tasks..............:"+$scope.newChronogram.tasks);
       
	Chronograms.create($scope.newChronogram)
	.$promise.then(
            function (response) {
                $scope.chronogram = response;
                $state.go($state.current, {}, {reload: true});
	        ngDialog.close();
            },
            function (response) {
                $scope.message = ctrl+":Error: " + response.status + " " + response.statusText;
            }
        );
	
	};
         

    $scope.deleteChronogram = function(chronogramid) {
        Chronograms.deleteById({id: chronogramid});
	$state.go($state.current, {}, {reload: true});
        $scope.showDelete = !$scope.showDelete;
    };
     
}])

.controller('ContactController', ['$scope', function ($scope) {

    var ctrl="ContactController";
    $scope.feedback = {"status": "defined",
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: ""
    };

    var channels = [{
        value: "tel",
        label: "Tel."
    }, {
        value: "Email",
        label: "Email"
    }];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

    $scope.sendFeedback = function () {


        if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
            $scope.invalidChannelSelection = true;
        } else {
            $scope.invalidChannelSelection = false;
            // feedbackFactory.save($scope.feedback);
            $scope.feedback = {
                mychannel: "",
                firstName: "",
                lastName: "",
                agree: false,
                email: ""
            };
            $scope.feedback.mychannel = "";
            $scope.feedbackForm.$setPristine();
        }
    };
}])

.controller('ChronogramDetailController', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', 'Chronograms', 'Tasks', 'Histories', 'AuthService', function ($scope, $rootScope, $state, $stateParams, ngDialog, Chronograms, Tasks, Histories, AuthService) {

    var ctrl="ChronogramDetailController";
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.chronogram = {};
    $scope.showTask = false;
    $scope.message = "Loading ...";
    $scope.noValue = "No task defined!";
    $scope.showEmpty = true;
    $scope.showDetails = false;
    $scope.showDelete = false;
    $scope.username = "anonymous"; 
    if(AuthService.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthService.getUsername();
    } 
    
    
    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "defined";
        } else if (setTab === 3) {
            $scope.filtText = "started";
        } else if (setTab === 4) {
            $scope.filtText = "delayed";
        } else if (setTab === 5) {
            $scope.filtText = "terminated";
        } else {
            $scope.filtText = "";
        }
    };
    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };    
    $scope.chronogram = Chronograms.findById({id: $stateParams.id})
        .$promise.then(
            function (response) {
                $scope.chronogram = response;
                console.log("chronogram id : "+response.id);
                currentChronogram = response;
                chronoId = response.id;
                $scope.showTask = true;
                console.log("avant");
                $scope.tasks = Tasks.find();
                
            },
            function (response) {
                $scope.message = ctrl+" : Error : " + response.status + " " + response.statusText;
            }
        );

     $scope.toggleDetails = function () {
         console.log("toggleDetails 3")
        $scope.showDetails = !$scope.showDetails;
    };
    $scope.toggleDelete = function () {
         console.log("toggleDelete 3")
        $scope.showDelete = !$scope.showDelete;
    };
    
     $scope.openNewTask = function () {
        console.log("openNewTask");
        ngDialog.open({ template: 'views/newTask.html', scope: $scope, className: 'ngdialog-theme-default', controller:"TaskController" });
    };
}])

.controller('TaskController', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', 'Chronograms', 'Tasks', 'Favorites', 'AuthService', function ($scope, $rootScope, $state, $stateParams, ngDialog, Chronograms, Tasks, Favorites, AuthService) {

    var ctrl = "TaskController";
    $scope.tab = 1;
    $scope.tasks = {};
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showDelete = false;
    $scope.showTask = false;
    $scope.message = "Loading ...";
    $scope.newTask = {};
    $scope.newTask.status = "defined";
	$scope.newTask.state = "defined";
	$scope.newTask.plannedDuration = "30";
	$scope.newTask.createdAt = Date.now();
	$scope.newTask.effectiveDuration = 0;
	$scope.newTask.responsibles = [$scope.username];
	$scope.newTask.histories=[];
    $scope.username = "anonymous"; 
    if(AuthService.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthService.getUsername();
    } 

    
    Tasks.find()
        .$promise.then(
        function (response) {
            $scope.tasks = response;
            $scope.showTask = true;
        },
        function (response) {
            $scope.message = ctrl+":Error: " + response.status + " " + response.statusText;
        });

    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "defined";
        } else if (setTab === 3) {
            $scope.filtText = "started";
        } else if (setTab === 4) {
            $scope.filtText = "delayed";
        } else if (setTab === 5) {
            $scope.filtText = "terminated";
        } else {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };
    $scope.toggleDelete = function () {
        console.log("toggleDelete");
        $scope.showDelete = !$scope.showDelete;
    };

    $scope.openNewTask = function () {
        console.log("openNewTask");
        ngDialog.open({ template: 'views/newTask.html', scope: $scope, className: 'ngdialog-theme-default', controller:"TaskController" });
    };

     $scope.doCreateTask = function () {
        $scope.newTask.chronogramsId = chronoId;
        console.log('Doing chronogram creation'+ $scope.newChronogram);
        console.log("name...............:"+$scope.newTask.name);
        console.log("description........:"+$scope.newTask.description);
        console.log('Username...........:'+$scope.newTask.username);
        console.log('plannedStartDate...:'+$scope.newTask.plannedStartDate);
        console.log('effectiveStartDate.:'+$scope.newTask.effectiveStartDate);
        console.log("status.............:"+$scope.newTask.status);
	    console.log("state..............:"+$scope.newTask.state);
	    console.log("plannedDuration....:"+$scope.newTask.plannedDuration);
	    console.log("createdAt..........:"+$scope.newTask.createdAt);
	     console.log("effectiveDuration.:"+$scope.newTask.effectiveDuration);
	    console.log("responsibles.......:"+$scope.newTask.responsibles);
	    console.log("histories..........:"+$scope.newTask.histories);
        console.log("chronogramId.......:"+$scope.newTask.chronogramsId);
       
	Tasks.create($scope.newTask)
	.$promise.then(
            function (response) {
                $scope.task = response;
                $state.go($state.current, {}, {reload: true});
	        ngDialog.close();
            },
            function (response) {
                $scope.message = ctrl+":Error: " + response.status + " " + response.statusText;
            }
        );
	};
         

    $scope.deleteTask = function(taskid) {
        Tasks.deleteById({id: taskid});
	$state.go($state.current, {}, {reload: true});
        $scope.showDelete = !$scope.showDelete;
    };
    
      // Change task status
    $scope.changeTaskStatus = function (state) {
        console.log(ctrl+" : State is : "+state);
        $scope.task.status = state;
        currentChronogram.status = state;
        if(state === "started"){
                currentChronogram.effectiveStartDate=Date.now();
                $scope.tasks.effectiveStartDate = Date.now();
        }
        currentChronogram.editedAt=Date.now();
        Chronograms.update(currentChronogram);
        $scope.task.editedAt=Date.now();
        Tasks.update($scope.tasks)
            .$promise.then(
            function(response){
                $ionicLoading.show({ template: 'Task :'+response.name+" set to state : "+state+"!", noBackdrop: true, duration: 3000 });
            },
            function(response) {
                $scope.message = "update Task Error: "+response.status + " " + response.statusText;
                            }
                );
            };
}])

.controller('TaskDetailController', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', 'Chronograms', 'Tasks', 'Histories', 'AuthService',  function ($scope, $rootScope, $state, $stateParams, ngDialog, Chronograms, Tasks, Histories, AuthService) {

    var ctrl = "TaskDetailController";
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.task = {};
    $scope.histories = {};
    $scope.showTask = false;
    $scope.showActions = false;
    $scope.message = "Loading ...";
    $scope.noValue = "No task defined!";
    $scope.showEmpty = true;
    $scope.showDetails = false;
    $scope.showDelete = false;
    $scope.username = "anonymous"; 
    if(AuthService.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthService.getUsername();
    } 
    
    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "defined";
        } else if (setTab === 3) {
            $scope.filtText = "started";
        } else if (setTab === 4) {
            $scope.filtText = "delayed";
        } else if (setTab === 5) {
            $scope.filtText = "terminated";
        } else {
            $scope.filtText = "";
        }
    };
    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };    
    $scope.task = Tasks.findById({id: $stateParams.id})
        .$promise.then(
            function (response) {
                $scope.task = response;
                currentTask = response;
                console.log(ctrl+" : task id : "+response.id);
                console.log(ctrl+": task status : "+response.status);
                taskId = response.id;
                $scope.showTask = true;
                console.log(ctrl+" : AVANT");
                $scope.histories = Histories.find();
            },
            function (response) {
                $scope.message = ctrl+"-Error: " + response.status + " " + response.statusText;
            }
    );

    $scope.toggleDetails = function () {
         console.log(ctrl+" : toggleDetails")
        $scope.showDetails = !$scope.showDetails;
    };
    $scope.toggleAction = function () {
         console.log(ctrl+" : toggleAction")
        $scope.showAction = !$scope.showAction;
    };
    
     $scope.openNewHistory = function () {
        console.log(ctrl+" : openNewHistory");
        ngDialog.open({ template: 'views/newHistory.html', scope: $scope, className: 'ngdialog-theme-default', controller:"HistoryController" });
    };
    
        
     
    
    // Change task status
    $scope.changeTaskStatus = function (state) {
        console.log(ctrl+" : State is : "+state);
        $scope.task.status = state;
        $scope.task.username = $scope.username;
        currentChronogram.status = state;
        if(state === "started"){
                currentChronogram.effectiveStartDate=Date.now();
                $scope.task.effectiveStartDate = Date.now();
        }
        currentChronogram.editedAt=Date.now();
        Chronograms.updateAll(currentChronogram);
        $scope.task.editedAt=Date.now();
        
        console.log('Doing task update'+ currentChronogram);
        console.log("name...............:"+$scope.task.name);
        console.log("description........:"+$scope.task.description);
        console.log('Username...........:'+$scope.task.username);
        console.log('plannedStartDate...:'+$scope.task.plannedStartDate);
        console.log('effectiveStartDate.:'+$scope.task.effectiveStartDate);
        console.log("status.............:"+$scope.task.status);
	    console.log("state..............:"+$scope.task.state);
	    console.log("plannedDuration....:"+$scope.task.plannedDuration);
	    console.log("createdAt..........:"+$scope.task.createdAt);
	     console.log("effectiveDuration.:"+$scope.task.effectiveDuration);
	    console.log("responsibles.......:"+$scope.task.responsibles);
	    console.log("histories..........:"+$scope.task.histories);
        console.log("chronogramId.......:"+$scope.task.chronogramsId);
        
        Tasks.updateAll($scope.task)
            .$promise.then(
            function(response){
                $ionicLoading.show({ template: 'Task :'+response.name+" set to state : "+state+"!", noBackdrop: true, duration: 3000 });
            },
            function(response) {
                $scope.message = "update Task Error: "+response.status + " " + response.statusText;
                            }
                );
            };
    $scope.createHistory = function(taskid){
        console.log(ctrl+" : createHistory for task : "+taskid);
    };
}])


.controller('HistoryController', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', 'Chronograms', 'Tasks', 'Favorites', 'Histories', 'AuthService', function ($scope, $rootScope, $state, $stateParams, ngDialog, Chronograms, Tasks, Favorites, Histories, AuthService) {
    var ctrl = "HistoryController";
    $scope.tab = 1;
    $scope.tasks = {};
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showDelete = false;
    $scope.showTask = false;
    $scope.message = "Loading ...";
    $scope.newHistory = {};
    $scope.newHistory.tasksId = taskId;
    $scope.newHistory.createdAt = Date.now();
    $scope.errorMessage = "";
   
    $scope.username = "anonymous"; 
    if(AuthService.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthService.getUsername();
    } 
    
    $scope.newHistory.postedBy = $scope.username;
    
    Histories.find()
        .$promise.then(
        function (response) {
            $scope.histories = response;
            $scope.showHistories = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };
    $scope.toggleDelete = function () {
        console.log("toggleDelete");
        $scope.showDelete = !$scope.showDelete;
    };

    $scope.openError = function (message) {
        console.log(ctrl+" : openError");
        $scope.errorMessage = message;
        ngDialog.open({ template: 'views/error.html', scope: $scope, className: 'ngdialog-theme-default', controller:"HistoryController" });
    };
   
     $scope.doCreateHistory = function () {
        console.log('Doing history creation'+ $scope.newHistory);
        console.log("description........:"+$scope.newHistory.description);
        console.log('Username...........:'+$scope.newHistory.postedBy);
	    console.log("createdAt..........:"+$scope.newHistory.createdAt);
        console.log("taskId.............:"+$scope.newHistory.tasksId);
   
        Histories.create($scope.newHistory)
	       .$promise.then(
            function (response) {
                $scope.history = response;
                $state.go($state.current, {}, {reload: true});
	        ngDialog.close();
            },
            function (response) {
                $scope.message = ctrl+" : Error: " + response.status + " " + response.statusText;
            }
        );
	};
}])

// implement the IndexController and About Controller here

.controller('HomeController', ['$scope', 'Chronograms', 'Leaders', 'Promotions', function ($scope, Chronograms, Leaders, Promotions) {
    var ctrl = "HomeController";
    $scope.showchronogram = false;
    $scope.showLeader = false;
    $scope.showPromotion = false;
    $scope.message = "Loading ...";
     if(AuthService.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthService.getUsername();
     } else {
         $scope.message = ctrl+" : Please log in";
     }
}])

.controller('AboutController', ['$scope', 'Leaders', function ($scope, Leaders) {

    $scope.leaders = Leaders.find();

}])

.controller('FavoriteController', ['$scope', '$rootScope', '$state', 'Favorites', 'Customer', function ($scope, $rootScope, $state, Favorites, Customer) {
    var ctrl = "FavoriteController";
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showDelete = false;
    $scope.showMenu = false;
    $scope.message = "Loading ...";

    if ($rootScope.currentUser) {
    Customer.favorites({id:$rootScope.currentUser.id, "filter":
        {"include":["Chronograms"]}
        })
        .$promise.then(
        function (response) {
            $scope.favorites = response;
            $scope.showMenu = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });
    }
    else{
        $scope.message = "You are not logged in"
    }

    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "appetizer";
        } else if (setTab === 3) {
            $scope.filtText = "mains";
        } else if (setTab === 4) {
            $scope.filtText = "dessert";
        } else {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };

    $scope.toggleDelete = function () {
        $scope.showDelete = !$scope.showDelete;
    };
    
    $scope.deleteFavorite = function(favoriteid) {
        Favorites.deleteById({id: favoriteid});
        $scope.showDelete = !$scope.showDelete;$scope.username = AuthService.getUsername();
        $state.go($state.current, {}, {reload: true});
    };
}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthService', function ($scope, $state, $rootScope, ngDialog, AuthService) {
    var ctrl = "HeaderController";
    $scope.loggedIn = false;
    $scope.username = '';
    
    if(AuthService.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthService.getUsername();
    }
        
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };
    
    $scope.logOut = function() {
       AuthService.logout();
        $scope.loggedIn = false;$scope.username = AuthService.getUsername();
        $scope.username = '';
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthService.isAuthenticated();
        $scope.username = AuthService.getUsername();
    });
        
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthService.isAuthenticated();
        $scope.username = AuthService.getUsername();
    });
    
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
    
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthService', function ($scope, ngDialog, $localStorage, AuthService) {
    var ctrl = "LoginController";
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthService.login($scope.loginData);
        if(AuthService.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthService.getUsername();
            console.log(ctrl+" : userName : "+$scope.username);
    }

        ngDialog.close();

    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
    
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthService', function ($scope, ngDialog, $localStorage, AuthService) {
    var ctrl = "RegisterController";
    $scope.register={};
    $scope.loginData={};
    
    $scope.doRegister = function() {

        AuthService.register($scope.registration);
        
        ngDialog.close();

    };
}])
;
