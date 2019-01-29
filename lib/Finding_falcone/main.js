'use strict';

var token = '',
    planets = [],
    vehicles = [],
    vehiclesTemp = [],
    queen = '',
    vehiclesSelected,
    planetsSelected;

var Reset = (function() {

    var vehiclesData = function() {
        vehicles = [];
        vehicles = JSON.parse(JSON.stringify(vehiclesTemp));
    };

    var vehiclesSelectedData = function() {
        vehiclesSelected = Array(4);
        vehiclesSelected.fill(null);
    };

    var planetsSelectedData = function() {
        planetsSelected = Array(4);
        planetsSelected.fill(null)
    };

    var deSelectplanetsData = function() {
        var selectOptionElements = getPlanetSelectElements();
        var self = this;
        Array.prototype.forEach.call(selectOptionElements, function(element) {
            element.selectedIndex = 0;
            self.enablePlanetOptions(element);    
        })
    };

    var enablePlanetOptions = function(element) {
        element = element || document;
        var options = element.getElementsByTagName('option');
        Array.prototype.forEach.call(options, function(option) {
            option.removeAttribute('disabled');
        })
    };

    var removeVehicleInputs = function() {
        var radioInputs = document.getElementsByClassName('list-item');
        Array.prototype.forEach.call(radioInputs, function(element) {
            var inputWrapper = document.getElementsByClassName('radio-input-wrapper')[0];
            if(inputWrapper) {
                element.removeChild(inputWrapper);
            }
        });
    };

    var time = function() {
        Time.total = 0;
    }

    var all = function() {
        this.deSelectplanetsData();
        this.vehiclesData();
        this.vehiclesSelectedData();
        this.planetsSelectedData();
        this.removeVehicleInputs();
        this.time();
    };

    return {
        deSelectplanetsData: deSelectplanetsData,
        vehiclesData: vehiclesData,
        vehiclesSelectedData: vehiclesSelectedData,
        planetsSelectedData: planetsSelectedData,
        removeVehicleInputs: removeVehicleInputs,
        enablePlanetOptions: enablePlanetOptions,
        time: time,
        all: all
    }
})();

var Notification = (function() {
    
    var show = function(modalObj, time) {

        var snackbar = document.getElementsByClassName('snackbar');
        if(snackbar.length) {
            return;
        }

        var notificationElement = document.createElement('div');
        notificationElement.className += 'snackbar '+ modalObj.status.toLowerCase();

        var notificationTitle = document.createElement('h5');
        notificationTitle.textContent = modalObj.status;

        var notificationDescription = document.createElement('p');
        notificationDescription.textContent = modalObj.text;

        notificationElement.appendChild(notificationTitle);
        notificationElement.appendChild(notificationDescription);

        document.body.appendChild(notificationElement);

        this.hide(time);

    };

    var hide = function(time) {
        var snackbarElement = document.getElementsByClassName('snackbar')[0];
        setTimeout(function() {
            document.body.removeChild(snackbarElement);
        }, time);
    };

    return {
        show: show,
        hide: hide
    }
})();

var Validation = (function(){
    var validate = function(array) {
        return array.every(function(item) {
            return (typeof item === 'string' && item.length > 0); 
        }) && array.length === 4;
    };

    return {
        validate: validate
    }
})();

var Time = (function() {
    var total = 0;
    var calculate = function(selectInputIndex, currentVehicleIndex, previousVehicleIndex ) {
        var distance = planets[selectInputIndex].distance;
        
        if(currentVehicleIndex) {
            var currentVehicleSpeed = vehicles[currentVehicleIndex].speed;
            this.total += distance / currentVehicleSpeed;
        }
        if(previousVehicleIndex) {
            var previousVehiclespeed = vehicles[previousVehicleIndex].speed; 
            this.total -= distance / previousVehiclespeed;
        }
    };
    return {
        total:total,
        calculate: calculate
    }
})();

var showResults = function(data) {
    if(data.status === 'success') {
        var successObj = {
            status: "Success",
            text: "Success, Queen found in " + data.planet_name + ' Planet. Time taken ' + Time.total
        }
        Notification.show(successObj, 10000);
    } else {
        var errorObj = {
            status: "Error",
            text: "Unable to find queen, Plese try again"
        }
        Notification.show(errorObj, 10000);
    }
}

var getResults = function() {
    var choosenPlanets = Planet.getPlanetNames();
    var choosenVehicles = Vehicle.getVehicleNames();
    
    var isPlanetsDataValid = Validation.validate(choosenPlanets);
    var isVehiclesDataValid = Validation.validate(choosenVehicles);
    if(!isPlanetsDataValid) {
        var errorObj = {
            status: "Error",
            text: "Please select 4 planets"
        }
        Notification.show(errorObj, 3000);
        return;
    }
    if(!isVehiclesDataValid) {
        var errorObj = {
            status: "Error",
            text: "Please select 4 vehicles"
        }
        Notification.show(errorObj, 3000);
        return;
    }

    findQueen(choosenPlanets, choosenVehicles);
}

//================================== Page init data.
var initData = function() {
    Reset.planetsSelectedData();
    Reset.vehiclesSelectedData();

    getAccessToken();
    getPlanets();
    getVehicles();

}
initData();