angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services'])
    .run(function($ionicPlatform, $rootScope) {
        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

        $rootScope.singleProduct = "";
    })

.service('dataService1', function() {
        this.isChecked;
    })
    .service('dataService2', function() {
        this.isChecked;
    })
    .service('dataService3', function() {
        this.isChecked;
    })
    .service('dataService4', function() {
        this.isChecked;
    })

.config(function($stateProvider, $urlRouterProvider, $compileProvider) {

    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    $stateProvider

        .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
    })

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'menuCtrl'
    })

    .state('app.inicio', {
        url: '/inicio',
        views: {
            'menuContent': {
                templateUrl: 'templates/inicio.html',
                controller: 'inicioCtrl'
            }
        }
    })

    .state('app.productos', {
        url: '/productos',
        views: {
            'menuContent': {
                templateUrl: 'templates/productos.html',
                controller: 'productosCtrl'
            }
        }
    })

    .state('app.inventarios', {
        url: '/inventarios',
        views: {
            'menuContent': {
                templateUrl: 'templates/inventarios.html',
                controller: 'inventarioCtrl'
            }
        }
    })

    .state('app.buscar', {
        url: '/buscar',
        views: {
            'menuContent': {
                templateUrl: 'templates/buscar.html',
                controller: 'buscarCtrl'
            }
        }
    })

    .state('app.movimientos', {
        url: '/movimientos',
        views: {
            'menuContent': {
                templateUrl: 'templates/movimientos.html',
                controller: 'movimientosCtrl'
            }
        }
    })

    .state('app.ubicaciones', {
        url: '/ubicaciones',
        views: {
            'menuContent': {
                templateUrl: 'templates/ubicaciones.html',
                controller: 'ubicacionesCtrl'
            }
        }
    })


    .state('app.escribir', {
        url: '/escribir',
        views: {
            'menuContent': {
                templateUrl: 'templates/escribir.html',
                controller: 'writeCtrl'
            }
        }
    })

    .state('app.borrar', {
        url: '/borrar',
        views: {
            'menuContent': {
                templateUrl: 'templates/borrar.html',
                controller: 'eraseCtrl'
            }
        }
    })

/*CHECK IF USER IS ALREADY LOGGED IN*/
    if (window.localStorage['usidu'] != "") {
         //$state.go('app.inicio');
         $urlRouterProvider.otherwise('/app/inicio');
    }else{
         $urlRouterProvider.otherwise('/login');
    }
   
});
