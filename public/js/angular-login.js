    var app = angular.module('myApp', []);
    app.controller('myCtrl', function($scope, $http) {


        $scope.phNum = '';
        $scope.requestId = '';
        $scope.showVerfn = true;
        $scope.slctLang = 'Spanish';
        $scope.slctMethod = 'SMS';
        $scope.showVerfnCode = false;
        $scope.getVerfnCode = function() {

            if ($scope.phNum.length < 10) {
                alertify.error('Invalid Phone Number');
            } else {
                $http.get('http://textuallearnnew.mybluemix.net/verifycode?number=' + $scope.phNum)
                .success(function(res) {
                    console.log(res);
                    if (res.status == 3)
                        alertify.error('Invalid Phone Number');
                    else {
                        $scope.requestId = res.request_id;
                        $scope.showVerfnCode = true;
                        alertify.success('Your code is on the way');
                    }
                });
            }
        }




        $scope.submitCode = function() {
            if ($scope.codeNum.length < 4 || $scope.codeNum.length > 4) {
                alertify.error('Invalid Code Number');
            } else {
                console.log($scope.requestId);

                console.log($scope.codeNum);
                $http.get('http://textuallearnnew.mybluemix.net/verifycheck?request_id=' + $scope.requestId + '&code=' + $scope.codeNum)
                .success(function(res) {
                    console.log(res);
                    if (res.status != 0)
                        alertify.error('Invalid Code Number');
                    else {
                        $scope.showVerfn = false;
                        swal("Good job!", "Your Number is verified", "success");
                    }
                });
            }
        }

        var method=true;
        var lang='spa'

        $scope.subscribe = function() {
            if($scope.lctLang=='Spanish')
            {
                lang='spa';
            }
            else{
                lang='fra';
            }
            if($scope.slctMethod=='SMS')
            {
                method=1;
            }
            else{
                method=0;
            }
            $http.get('http://textuallearnnew.mybluemix.net/subscribe?lang='+lang+'&method='+method)
            .success(function(res) {
                console.log(res);
                swal("Good job!", "Your Subscription is Active", "success");
            });

        }


        $scope.stopNotifs = function() {
            $http.get('http://textuallearnnew.mybluemix.net/stopNotifications')
            .success(function(res) {
                swal("Good job!", "Your Subscription is De activated", "error");
            });
        }
    });