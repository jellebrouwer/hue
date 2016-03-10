
(function () {
    'use strict';

	angular.module('hue-app', ['rzModule'])
		.controller('HueController', HueController)
        .factory('hueService', hueService)
		.service('hueState', hueState);

	function HueController (hueService, hueState) {
        var vm = this;
        vm.title = 'Awesome Hue App';

		hueService.getLights().then(function(response) {
            vm.lights = response.data;
            angular.forEach(vm.lights, function(light, index) {
                light.optionsHue = {
                    id: {
                        id: index,
                        option: 'hue'
                    },
                    floor: 0,
                    ceil: 65535,
                    onEnd: updateLight
                };
                light.optionsSat = {
                    id: {
                        id: index,
                        option: 'sat'
                    },
                    floor: 0,
                    ceil: 254,
                    onEnd: updateLight
                };
                light.optionsBri = {
                    id: {
                        id: index,
                        option: 'bri'
                    },
                    floor: 0,
                    ceil: 254,
                    onEnd: updateLight
                };
            });
			hueState.set(vm.lights);
        });

        function updateLight(light, modelValue) {
            var state = {};
            state[light.option] = modelValue;
            hueService.putLight(light.id, state);
        }

 	}

	HueController.$inject = ['hueService', 'hueState'];

	function hueService ($http) {

		var apiUrl = 'http://192.168.2.2/api/a10ada2202d6294331c01ee28725231',
            service = {
			    getLights: getLights,
			    putLight: putLight
		    };

		return service;

		function getLights () {
			var url = apiUrl +  '/lights';
			return $http.get(url);
		}

		function putLight (lightId, state) {
			return $http.put(apiUrl + '/lights/' + lightId + '/state', state);
		}
	}

	hueService.$inject = ['$http'];

	function hueState () {

		this.set = function (value) {
			this.lights = value || {};
		};

		this.get = function () {
			return this.lights;
		};
    }

}());