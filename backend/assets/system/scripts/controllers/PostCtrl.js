angular.module('app')
    .controller('PostsCtrl',['$state','$auth', function ($state, $auth) {
        var privilige = $auth.getUser().user.privilige;
        if ( privilige !== 3 && privilige !== 1 && privilige !== 5) {
            $state.go('checkAuth');
        }
    }])
    .controller('CreatePostsCtrl', ['$scope', '$state', '$stateParams', '$restful', '$auth', 'App', 'Upload', 'toaster',
        function ($scope, $state, $stateParams, $restful, $auth, App, Upload, toaster) {
            $scope.privilige = $auth.getUser().user.privilige;


            $scope.list_city = [];
            $scope.list_district = [];
            $scope.add_list = [];
            $scope.ApartmentAddItem = {};
            $scope.type_Post = [];
            $scope.for_Post = [];
            $scope.loadingData = false;
            $scope.frm = {};
            $scope.submit_btn = false;



            $scope.$watch('files', function () {
                $scope.upload($scope.files);

            });

            $scope.upload = function (files) {
                if (files && files.length) {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        Upload.upload({
                            url: ApiPath + 'Posts/uploadPicture',
                            fields: {},
                            file: file
                        }).progress(function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                        }).success(function (data, status, headers, config) {
                            console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                        }).error(function (data, status, headers, config) {
                            console.log('error status: ' + status);
                        })
                    }
                }
            };

            function get_number(data) {
                if (data != undefined && data != '') {
                    if (typeof data == 'string') {
                        return data.toString().replace(/,/gi, "");
                    } else {
                        return data.toString();
                    }
                }
                return 0;
            }

            $scope.create = function (frm) {
                $scope.submit_btn = true;

                $restful.post('Posts/createPost', frm, function (error, resp) {
                    $scope.submit_btn = false;
                    if (error) {
                        toaster.pop('warning', 'Lỗi', error);
                    } else {
                        toaster.pop('success', 'Thông báo', 'Đăng thành công');
                        $state.go('app.posts.list');
                    }
                })
            };

        }])

    .controller('ListPostsCtrl', ['$scope', '$state', '$stateParams', '$restful', '$auth', 'App', 'Upload', 'toaster',
        function ($scope, $state, $stateParams, $restful, $auth, App, Upload, toaster) {
            $scope.privilige = $auth.getUser().user.privilige;
            $scope.item_page = 20;
            $scope.total = 0;
            $scope.currentPage = 1;
            $scope.loadingData = true;

            $scope.list_Posts = [];

            $scope.loadCities = function () {
                App.getCities(function (err, resp) {
                    if (!err) {
                        $scope.list_city = resp.data;
                    }
                })
            };

            $scope.loadDistrict = function (id) {
                angular.forEach($scope.list_city, function (value) {
                    if (value.id == id) {
                        App.getDistricts(value.city_code, function (err, resp) {
                            if (!err) {
                                $scope.list_district = resp.data;
                            }
                        })
                        return;
                    }
                })
            };

            $scope.load = function (frm) {
                $scope.loadingData = true;
                $scope.filter = {page: $scope.currentPage, item_page: $scope.item_page, Post_type: '2'};

                angular.extend($scope.filter, frm);

                $restful.get('Posts/show', $scope.filter, function (error, resp) {
                    $scope.loadingData = false;
                    if (error) {
                        toaster.pop('warning', 'Lỗi', error);
                    } else {
                        $scope.total = resp.total;
                        $scope.list_Posts = resp.data;
                    }
                })
            };
            $scope.loadCities();
            $scope.load();

        }])
    .controller('ViewPostsCtrl', ['$scope', '$state', '$stateParams', '$restful', '$auth', 'App',
        function ($scope, $state, $stateParams, $restful, $auth, App) {
            $scope.loadingData = true;
            $scope.privilige = $auth.getUser().user.privilige;
            $scope.load = function () {
                $restful.get('Posts/', {id: $stateParams.id}, function (error, resp) {;
                    if (error) {
                        toaster.pop('warning', 'Lỗi', error);
                    } else {
                        $scope.loadingData = false;
                        $scope.total = resp.total;
                        $scope.data = resp;
                    }
                })
            };
            $scope.load();
        }])
    .controller('UpdatePostsCtrl', ['$scope', '$state', '$stateParams', '$restful', '$auth', 'App', 'Upload', 'toaster',
        function ($scope, $state, $stateParams, $restful, $auth, App, Upload, toaster) {
            $scope.loadingData = true;
            $scope.load = function () {
                $restful.get('Posts/', {id: $stateParams.id}, function (error, resp) {
                    $scope.loadingData = false;
                    if (error) {
                        toaster.pop('warning', 'Lỗi', error);
                    } else {
                        $scope.loadingData = false;
                        function get_number(data) {
                            if (data != undefined && data != '') {
                                if (typeof data == 'string') {
                                    return data.toString().replace(/,/gi, "");
                                } else {
                                    return data.toString();
                                }
                            }
                            return 0;
                        }

                        $scope.total = resp.total;
                        $scope.frm = resp;
                        $scope.ApartmentAddItem = {};


                        $scope.submit_btn = false;


                        $scope.create = function (frm) {
                            $scope.submit_btn = true;

                            $restful.post('Posts/updatePost', frm, function (error, resp) {
                                $scope.submit_btn = false;
                                if (error) {
                                    toaster.pop('warning', 'Lỗi', error);
                                } else {
                                    toaster.pop('success', 'Thông báo', 'Cập nhật thành công');
                                    $state.go('app.posts.list');
                                }
                            })
                        };
                    }
                })
            };
            $scope.load();
        }])