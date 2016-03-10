
(function () {
    'use strict';

	angular.module('hue-app', [])
		.controller('HueController', HueController)
		.factory('hueService', hueService)
		.service('hueState', hueState);

	function HueController (hueService, hueState) {
		var vm = this;
		vm.title = 'Awesome Hue App';
		vm.lightSwitch = lightSwitch;

		hueService.getLights().then(function(response) {
			vm.lights = response.data;
			hueState.set(vm.lights);
		});

		function lightSwitch (index) {
			var lightId = index + 1;
			var lights = hueState.get();
			var state = {
				on: !lights[lightId].state.on
			};

			hueService.putLight(lightId, state).then(function(response) {
				lights[lightId].state.on = !lights[lightId].state.on;
				hueState.set(lights);
			});
		}
 	}

	HueController.$inject = ['hueService', 'hueState'];

	function hueService ($http) {

		var apiUrl = 'http://10.1.2.174/api/a10ada2202d6294331c01ee28725231',
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