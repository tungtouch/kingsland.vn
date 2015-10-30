angular.module('app')
    .controller('CommandCtrl', ['$state', '$auth', function ($state, $auth) {
        var privilige = $auth.getUser().user.privilige;
        if (privilige !== 2 && privilige !== 1 && privilige !== 5) {
            $state.go('checkAuth');
        }
    }])
    .controller('CreateCommandCtrl', ['$scope', '$state', '$stateParams', '$restful', '$auth', 'App', 'Upload', 'toaster', '$http',
        function ($scope, $state, $stateParams, $restful, $auth, App, Upload, toaster, $http) {
            $restful.get('leases/test', function (err, resp) {

            })
            $scope.list_city = [];
            $scope.list_district = [];
            $scope.add_list = [];
            $scope.ApartmentAddItem = {};
            $scope.type_lease = [];
            $scope.frm = {};
            $scope.submit_btn = false;


            $scope.$watch('frm.type_invite', function (value) {
                if (value == 2) {
                    $scope.frm.project = "";
                }
            });


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
                console.log(frm);

                $restful.post('commands/postCreate', frm, function (error, resp) {
                    $scope.submit_btn = false;
                    if (error) {
                        toaster.pop('warning', 'Lỗi', error);
                    } else {
                        toaster.pop('success', 'Thông báo', 'Đặt lệnh thành công thành công');
                        $state.go('app.commands.list');
                    }
                })
            };

            $scope.loadProject = function (query) {
                $restful.get('projects/show', {page: 1, item_page: 20}, function (error, resp) {
                    if (error) {
                        toaster.pop('warning', 'Lỗi', error);
                    } else {
                        $scope.list_projects = resp.data;
                    }
                })
            };


        }])

    .controller('ListCommandCtrl', ['$scope', '$state', '$stateParams', '$restful', '$auth', 'App', 'Upload', 'toaster',
        function ($scope, $state, $stateParams, $restful, $auth, App, Upload, toaster) {

            $scope.item_page = 20;
            $scope.total = 0;
            $scope.currentPage = 1;
            $scope.loadingData = true;

            $scope.list_commands = [];

            $scope.load = function (status, frm) {

                $scope.loadingData = true;
                $scope.filter = {page: $scope.currentPage, item_page: $scope.item_page};

                $scope.status = status;

                angular.extend($scope.filter, frm);


                $restful.get('commands/show', $scope.filter, function (error, resp) {
                    $scope.loadingData = false;
                    if (error) {
                        toaster.pop('warning', 'Lỗi', error);
                    } else {
                        $scope.total = resp.total;
                        $scope.list_commands = resp.data;
                    }
                })
            }

            $scope.load('ALL');

        }])
    .controller('ViewCommandCtrl', ['$scope', '$state', '$stateParams', '$restful', '$auth', 'App', '$modal',
        function ($scope, $state, $stateParams, $restful, $auth, App, $modal) {

            $scope.privilige = $auth.getUser().user.privilige;
            $restful.get('commands/show', {id: $stateParams.id}, function (error, resp) {
                $scope.loadingData = false;
                if (error) {
                    toaster.pop('warning', 'Lỗi', error);
                } else {

                    $scope.total = resp.total;
                    $scope.data = resp.data;
                    if(resp.data != undefined) {
                        $restful.post('leases/test', resp.data, function (err, res) {
                            console.log('OK', res);
                        })
                    }
                }
            })

            $scope.open_modal = function (item) {
                var modalInstance = $modal.open({
                    templateUrl: 'views/commands/update-status-modal.html',
                    controller: function ($scope, $restful, $stateParams, $state, $auth, item, toaster, $modalInstance) {
                        $scope.frm = {};
                        $scope.item = item;

                        if (item.project) {
                            $scope.frm.project = item.project.id;
                        }
                        $scope.loadProject = function (query) {
                            $restful.get('projects/show', {page: 1, item_page: 20}, function (error, resp) {
                                if (error) {
                                    toaster.pop('warning', 'Lỗi', error);
                                } else {
                                    $scope.list_projects = resp.data;
                                }
                            })
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

                        $scope.saveStatus = function (frm) {
                            if (!frm || !frm.status) {
                                return false;
                            }

                            if (!frm || !frm.note) {
                                return false;
                            }

                            var data = {
                                'status': frm.status,
                                'note': frm.note,
                                'command': $stateParams.id,
                                'old_status': $scope.item.status
                            }
                            if (frm.status == 'SUCCESS') {
                                data['project'] = frm.project || "";
                                data['total_amount'] = get_number(frm.total_amount) || "";
                            }
                            $restful.post('commandjourneys/create', data, function (err, resp) {
                                if (err) {
                                    return toaster.pop('warning', 'Thông báo', err);
                                }
                                $modalInstance.close(data);
                            })
                        }

                        $scope.close = function () {
                            $modalInstance.dismiss();
                        };

                        $scope.loadProject();

                    },
                    size: 'md',
                    resolve: {
                        item: function () {
                            return item;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    if (angular.isObject(selectedItem)) {
                        selectedItem['createdAt'] = new Date();
                        $scope.data.unshift(selectedItem);
                    }
                }, function () {
                });
            }
        }])
