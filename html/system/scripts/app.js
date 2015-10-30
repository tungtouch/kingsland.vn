"use strict";

var ApiPath = "http://kingsland.vn/api/v1/";
//var ApiPath = "http://localhost:1337/api/v1/";
angular.module('app',
    [
        'ui.router',
        'ngResource',
        'ngSanitize',
        'textAngular',
        'ngFileUpload',
        'toaster',
        'ui.bootstrap',
        'ngTagsInput',
        'angularMoment'
    ]
)

    .config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
        function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
            $urlRouterProvider
                .otherwise('checkAuth');
            $stateProvider
                .state('app', {
                    abstract: true,
                    url: '/',
                    templateUrl: 'views/app.html',
                    'controller': 'AppController'
                })
                .state('login', {
                    url: '/dang-nhap',
                    templateUrl: 'views/login.html',
                    controller: 'LoginCtrl'
                })
                .state('register', {
                    url: '/dang-ky?refer',
                    templateUrl: 'views/register.html',
                    controller: 'LoginCtrl'
                })
                .state('checkAuth', {
                    url: '/checkAuth',
                    controller: 'checkAuthCtrl'
                })

                .state('app.commands', {
                    abstract: true,
                    url: 'dat-lenh',
                    templateUrl: 'views/commands/index.html',
                    controller: 'CommandCtrl'
                })
                .state('app.commands.list', {
                    url: '/danh-sach',
                    templateUrl: 'views/commands/list.html',
                    controller: 'ListCommandCtrl'
                })
                .state('app.commands.create', {
                    url: '/tao-lenh',
                    templateUrl: 'views/commands/create.html',
                    controller: 'CreateCommandCtrl'
                })

                .state('app.commands.view', {
                    url: '/chi-tiet/:id',
                    templateUrl: 'views/commands/view.html',
                    controller: 'ViewCommandCtrl'
                })

                .state('app.projects', {
                    abstract: true,
                    url: 'du-an',
                    templateUrl: 'views/projects/index.html',
                })
                .state('app.projects.list', {
                    url: '/danh-sach',
                    templateUrl: 'views/projects/list.html',
                    controller: 'ListProjectCtrl'
                })
                .state('app.projects.create', {
                    url: '/tao-du-an',
                    templateUrl: 'views/projects/create.html',
                    controller: 'CreateProjectCtrl'
                })
                .state('app.projects.view', {
                    url: '/xem-du-an/:id',
                    templateUrl: 'views/projects/view.html',
                    controller: 'ViewProjectCtrl'
                })

                .state('app.leases', {
                    abstract: true,
                    url: 'cho-thue',
                    templateUrl: 'views/leases/index.html',
                    controller: 'LeasesCtrl'
                })
                .state('app.leases.list', {
                    url: '/danh-sach',
                    templateUrl: 'views/leases/list.html',
                    controller: 'ListLeaseCtrl'
                })
                .state('app.leases.create', {
                    url: '/tao-cho-thue',
                    templateUrl: 'views/leases/create.html',
                    controller: 'CreateLeaseCtrl'
                })
                .state('app.leases.update', {
                    url: '/cap-nhat-cho-thue/:id',
                    templateUrl: 'views/leases/create.html',
                    controller: 'UpdateLeaseCtrl'
                })
                .state('app.leases.view', {
                    url: '/xem-du-an/:id',
                    templateUrl: 'views/leases/view.html',
                    controller: 'ViewLeaseCtrl'
                })

                .state('app.posts', {
                    abstract: true,
                    url: 'posts',
                    templateUrl: 'views/posts/index.html',
                    controller: 'PostsCtrl'
                })
                .state('app.posts.list', {
                    url: '/danh-sach',
                    templateUrl: 'views/posts/list.html',
                    controller: 'ListPostsCtrl'
                })
                .state('app.posts.create', {
                    url: '/create',
                    templateUrl: 'views/posts/create.html',
                    controller: 'CreatePostsCtrl'
                })
                .state('app.posts.update', {
                    url: '/cap-nhat/:id',
                    templateUrl: 'views/posts/create.html',
                    controller: 'UpdatePostsCtrl'
                })
                .state('app.posts.view', {
                    url: '/xem-bai-viet/:id',
                    templateUrl: 'views/posts/view.html',
                    controller: 'ViewPostsCtrl'
                })

                .state('app.users', {
                    abstract: true,
                    url: '/users',
                    templateUrl: 'views/users/index.html'
                })
                .state('app.users.list', {
                    url: '/users/list',
                    templateUrl: 'views/users/list.html',
                    controller: 'ListUserCtrl'
                })
                .state('app.users.create', {
                    url: '/create-users',
                    templateUrl: 'views/users/create.html',
                    controller: 'CreateUserCtrl'
                })
                .state('app.users.view', {
                    url: '/view-users',
                    templateUrl: 'views/users/view.html',
                    controller: 'ViewUserCtrl'
                })

                .state('app.transactions', {
                    url: 'transactions',
                    templateUrl: 'views/projects/index.html'
                })
                .state('app.transactions.withdraw', {
                    url: '/withdraw',
                    templateUrl: 'views/transactions/withdraw.html'
                })
                .state('app.transactions.list', {
                    url: '/list',
                    templateUrl: 'views/transactions/list.html',
                    controller: 'ListTransactionCtrl'
                })
                .state('app.transactions.create', {
                    url: '/create-transactions',
                    templateUrl: 'views/transactions/create.html'
                })

                .state('app.customers', {
                    abstract: true,
                    url: '/customers',
                    templateUrl: 'views/customers/index.html'
                })
                .state('app.customers.list', {
                    url: '/customers/list',
                    templateUrl: 'views/customers/list.html'
                })
                .state('app.customers.create', {
                    url: '/create-customers',
                    templateUrl: 'views/customers/create.html'
                })

                .state('app.affiliates', {
                    abstract: true,
                    url: '/affiliates',
                    templateUrl: 'views/affiliates/index.html'
                })
                .state('app.affiliates.list', {
                    url: '/affiliates/list',
                    templateUrl: 'views/affiliates/list.html'
                })
                .state('app.affiliates.create', {
                    url: '/create-affiliates',
                    templateUrl: 'views/affiliates/create.html'
                })

                .state('app.profile', {
                    url: 'profile',
                    templateUrl: 'views/profiles/index.html',
                    controller: 'ProfileCtrl'
                })

                .state('app.faq', {
                    url: 'faq',
                    templateUrl: 'views/faq/index.html',
                    /*controller: 'ProfileCtrl'*/
                })


        }])
    .run(['$rootScope', '$auth', '$state', '$stateParams', '$templateCache', function ($rootScope, $auth, $state, $stateParams, $templateCache) {

        $rootScope.user = $auth.getUser() || false;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$state = $state;

        $rootScope.transaction_type = {
            'TRANSFER_SYSTEM': 'Giao dịch từ hệ thống',
            'AFFILIATE_MEMBERS': 'Tiền giới thiệu thành viên',
            'AFFILIATE_TRANSACTION': 'Tiền nhận từ giao dịch thành công từ người được giới thiệu.',
            'TRANSFER_BANK': 'Chuyển về ngân hàng',
            'TRANSFER_CASH': 'Nhận tiền mặt',
        };

        $rootScope.project_status = {
            'BUILDED': 'Đã xây dựng xong',
            'BUILDING': 'Đang xây dựng',
        };

        $rootScope.transaction_status = {
            'WAIT_TRANSACTION': {
                bg_color: 'info',
                name: 'Giao dịch chờ xử lý'
            },
            'VERIFIED_TRANSACTION': {
                bg_color: 'primary',
                name: 'Giao dịch đang được xử lý'
            },
            'FAILED_TRANSACTION': {
                bg_color: 'warning',
                name: 'Giao dịch lỗi'
            },
            'SUCCESS_TRANSACTION': {
                bg_color: 'success',
                name: 'Giao dịch thành công'
            }
        };

        $rootScope.commands_status = {
            'WAITING': {
                bg_color: 'info',
                name: 'Chờ xử lý'
            },
            'PROCESSING': {
                bg_color: 'primary',
                name: 'Đang xử lý'
            },
            'CONTRACTED': {
                bg_color: 'primary',
                name: 'Đã chốt với khách'
            },
            'FAIL': {
                bg_color: 'warning',
                name: 'Lỗi'
            },
            'SUCCESS': {
                bg_color: 'success',
                name: 'Thành công'
            }
        };


        $rootScope.logout = function () {
            $auth.clearUser();
            $rootScope.user = false;
            $state.go('login');
        };

        $rootScope.$on('$stateChangeStart', function (evt, toState, toParams) {
            $rootScope.user = $auth.getUser() || false;
            if (toState.name.indexOf('app') !== -1) {
                if (!$auth.getUser() || $auth.getUser()['time_expired'] <= (Date.now() / 1000)) {

                    $auth.clearUser();
                    $rootScope.user = $auth.getUser() || false;
                    evt.preventDefault();

                    $state.go('login');
                }
            }
            if (toState.name == 'login') {
                $auth.clearUser();
                $rootScope.user = $auth.getUser() || false;
            }
        });

        $auth.setToken();


    }])
    .filter('vnNumber', function ($filter) {
        return function (number) {
            if (number != undefined) {
                return $filter('number')(number).replace(/,/g, '.');
            }
        }
    })
    .directive('formatnumber', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (data) {
                    if (data != '' && data != undefined) {
                        //convert data from view format to model format
                        var string = data.toString().replace(/^(0*)/, "");
                        string = string.replace(/(\D)/g, "");
                        string = string.replace(/^$/, "0");
                        string = string.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

                        if (string != data) {
                            modelCtrl.$setViewValue(string);
                            modelCtrl.$render();
                        }

                        return string; //converted
                    }
                    return;
                });

                modelCtrl.$formatters.push(function (data) {
                    //convert data from model format to view format
                    if (data != '' && data != undefined) {
                        var string = data.toString().replace(/','/, "");
                        string = string.replace(/(\D)/g, "");
                        string = string.replace(/^$/, "0");
                        string = string.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                        if (string != data) {
                            modelCtrl.$setViewValue(string);
                            modelCtrl.$render();
                        }
                        return string;
                    }
                    return;
                });
            }
        }
    })
