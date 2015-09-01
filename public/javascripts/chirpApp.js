var expireDate = new Date();
expireDate.setFullYear(expireDate.getFullYear() + 1);

var app = angular.module('chirpApp', ['ngRoute', 'ngResource', 'ngCookies']).run(function($rootScope, $http, $cookies, $location) {
	console.log("angular.module(chirpApp).run(function)");
	$rootScope.authenticated = $cookies.get('authenticated');
	if($rootScope.authenticated === undefined) {
		$rootScope.authenticated = false;
	}

	if($rootScope.authenticated) {
		$rootScope.current_user = $cookies.getObject('current_user');
		if($rootScope.current_user === undefined) {
			$rootScope.current_user = '';
			$rootScope.authenticated = false;
			$cookies.put('authenticated', false);
		}
	} else {
			$rootScope.current_user = '';
	}
	$rootScope.signout = function(){
			console.log("$rootScope.signout");
			console.log($location.path());
    	$http.get('auth/signout');
    	$rootScope.authenticated = false;
			$cookies.put('authenticated', false);
    	$rootScope.current_user = '';
			$cookies.remove('current_user');
			$location.path("/login").replace();
			console.log($location.path());
	};
});

app.config(function($routeProvider){
	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		//the login display
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
		//the signup display
		.when('/register', {
			templateUrl: 'register.html',
			controller: 'authController'
		});
		console.log("routeProvider");
});

app.factory('postService', function($resource){
	console.log("factory(postService)");
	return $resource('/api/posts/:id');
});

app.factory('addressService', function($resource){
	console.log("factory(addressService)");
	return $resource('/api/addr/');
});

app.controller('mainController', function(addressService, postService, $scope, $rootScope){
	console.log("controller(mainController)");
	$scope.posts = postService.query();
	$scope.addresses = addressService.query();
	$scope.newPost = {created_by: '', text: '', created_at: ''};
	$scope.newAddr = {ipAddres: '', desc: '', created_by: '', created_at: ''};

	$scope.post = function() {
		console.log("$scope.post");
	  $scope.newPost.created_by = $rootScope.current_user;
	  $scope.newPost.created_at = Date.now();
	  postService.save($scope.newPost, function(){
	    $scope.posts = postService.query();
	    $scope.newPost = {created_by: '', text: '', created_at: ''};
	  });
	};

	$scope.addAddress = function() {
		console.log("$scope.addAddress");
		$scope.newAddr.created_by = $rootScope.current_user;
	  $scope.newAddr.created_at = Date.now();
	  addressService.save($scope.newAddr, function(){
	    $scope.addresses = addressService.query();
			$scope.newPost.text = "ADICIONADO\nIP:" + $scope.newAddr.ipAddress + "\nDescrição" + $scope.newAddr.desc;
			console.log($scope.newPost.text);
			$scope.post();
			$scope.newAddr = {ipAddres: '', desc: '', created_by: '', created_at: ''};
	  });
	};
});

app.controller('authController', function($scope, $http, $rootScope, $location, $cookies){
	console.log("controller(authController)");
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';

  $scope.login = function(){
		console.log("$scope.login");
    $http.post('/auth/login', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
				$cookies.put('authenticated', true, {'expires': expireDate});
        $rootScope.current_user = data.user.username;
				$cookies.putObject('current_user', $rootScope.current_user, {'expires': expireDate});
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };

  $scope.register = function(){
		console.log("$scope.register");
    $http.post('/auth/signup', $scope.user).success(function(data){
      if(data.state == 'success'){
				$rootScope.authenticated = true;
				$cookies.put('authenticated', true, {'expires': expireDate});
        $rootScope.current_user = data.user.username;
				$cookies.putObject('current_user', $rootScope.current_user, {'expires': expireDate});
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };
});
