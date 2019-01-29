'use strict';
var fetch = require("node-fetch");
var document = {
    getElementsByClassName: []
};

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
        if(!array || !Array.isArray(array) || array.length === 0 ) {
            // throw "Given value is not array or length zero";
            return;
        }
        return array.every(function(item) {
            return (item.length > 0); 
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


var fetchRequest = function(url, object) {
    return  fetch(url, object)
            .then(function(response) {
                return response.json();
            });
};

var getAccessToken = function() {
    var url = 'https://ﬁndfalcone.herokuapp.com/token';
    var data = {
        method: 'POST',
        headers: {
            "Accept": "application/json"
        }
    };

    fetchRequest(url, data)
    .then(function(data) {
        token = data.token;
    })
    .catch(function(error) {
        var errorObj = {
            status: "Error",
            text: "Failed to get token"
        };
        Notification.show(errorObj, 3000);
        console.log(error);
        console.log(error);
    })
};

var getPlanets = function() {
    var url = 'https://ﬁndfalcone.herokuapp.com/planets';
    var data = {
        method: 'GET'
    };
    fetchRequest(url, data)
    .then(function(data) {
        planets = data;
        DOMUpdate.createPlanetSelectOptions();
    })
    .catch(function(error) {
        var errorObj = {
            status: "Error",
            text: "Failed to get Planets data"
        };
        Notification.show(errorObj, 3000);
        console.log(error);
    })
};

var getVehicles = function() {
    var url = 'https://ﬁndfalcone.herokuapp.com/vehicles';
    var data = {
        method: 'GET'
    };
    fetchRequest(url, data)
    .then(function(data) {
        vehicles = JSON.parse(JSON.stringify(data));
        vehiclesTemp = JSON.parse(JSON.stringify(data));
    })
    .catch(function(error) {
        var errorObj = {
            status: "Error",
            text: "Failed to get vehicles data"
        };
        Notification.show(errorObj, 3000);
        console.log(error);
    })
};

var findQueen = function(choosenPlanets ,choosenVehicles) {
    var url = 'https://findfalcone.herokuapp.com/find';
    var data = {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token: token,
            planet_names: choosenPlanets,
            vehicle_names: choosenVehicles
        })
    };

    fetchRequest(url, data)
    .then(function(data) {
        showResults(data);
        Reset.all();
    })
    .catch(function(error) {
        var errorObj = {
            status: "Error",
            text: "Failed to get result"
        };
        Notification.show(errorObj, 3000);
        console.log(error);
    })
};


var getPlanetSelectElements = function() {
    return document.getElementsByClassName('planet');
};

var DOMEventHandler = (function() {
    var changePlanet = function(element, selectInputIndex) {
        var planetSelectedIndex = element.selectedIndex;
        var planetPreviousSelectedIndex = element.getAttribute('prevIndex') || null;
        var planetSelectedInfo = planets[planetSelectedIndex - 1];
        planetsSelected.splice(selectInputIndex, 1, planetSelectedInfo);

        Planet.toggleSelectOptions(selectInputIndex, planetSelectedIndex, planetPreviousSelectedIndex);
        Planet.updateSelectedPlanets(selectInputIndex, planetSelectedIndex, planetPreviousSelectedIndex);
    };

    var changeVehicle = function(event) {
        var element = event.currentTarget;
        var vehicleIndex = element.value;

        var planetIndex = element.getAttribute('planetIndex') || null;
        var previousSelectedVehicleIndex = vehiclesSelected[planetIndex];

        Vehicle.updateCount(vehicleIndex, previousSelectedVehicleIndex);
        
        vehiclesSelected.splice(planetIndex, 1, vehicleIndex);
        
        Vehicle.updatePlanetsVechileData(previousSelectedVehicleIndex);

        var selectedPlanetIndex = planets.findIndex(function(planet) {
            return planet.name === planetsSelected[planetIndex].name;
        })

        Time.calculate(selectedPlanetIndex, vehicleIndex, previousSelectedVehicleIndex);

        previousSelectedVehicleIndex = null;  
    };
    
    return {
        changePlanet: changePlanet,
        changeVehicle: changeVehicle
    }
})();

var DOMUpdate = (function() {
    var createPlanetSelectOptions = function() {
        var selectOptionElements = getPlanetSelectElements();
        Array.prototype.forEach.call(selectOptionElements, function(element) {
            for (var i = 0; i < planets.length; i++) {
                var option = document.createElement("option");
                option.value = planets[i].name;
                option.text = planets[i].name;
                element.appendChild(option);
            }
        });
    };

    var createVehicleRadioInputs = function(index, selectedPlanetIndex) {
        var currentPlanet = planets[selectedPlanetIndex - 1];
        var element = document.getElementById('list-element-' + index);

        var radioInputsWrapper = document.createElement("div");
        radioInputsWrapper.className += 'radio-input-wrapper';

        vehicles.forEach(function(vehicle, i) {

            var parentElement = document.createElement("div");
            
            var radioInput = document.createElement("input");
            radioInput.setAttribute('type', 'radio');
            radioInput.setAttribute('id', 'vehicle' + index + '' + i);
            radioInput.setAttribute('name', 'planet' + index);
            radioInput.setAttribute('planetIndex', index);
            radioInput.setAttribute('value', i);

            radioInput.onchange = DOMEventHandler.changeVehicle;

            if(currentPlanet.distance > vehicle.max_distance || vehicle.total_no === 0) {
                radioInput.setAttribute('disabled', true);
            }

            var label = document.createElement("label");
            label.setAttribute('for', 'vehicle' + index + '' + i);
            label.textContent = vehicle.name +  '(' +  vehicle.total_no + ')';

            parentElement.appendChild(radioInput);
            parentElement.appendChild(label);

            radioInputsWrapper.appendChild(parentElement)
            
        });
        element.appendChild(radioInputsWrapper);
    };

    var updateVechileData = function(planetIndex, previousIndex) {
        var element = document.getElementById('list-element-' + planetIndex);
        var labels = element.getElementsByTagName('label');
        var vehicleInputs = element.getElementsByTagName('input');
    
        var currentPlanet = planetsSelected[planetIndex];
        
        vehicles.forEach(function(vehicle, index) {
            var currentLabel = labels[index];
            if(currentPlanet && (currentPlanet.distance > vehicle.max_distance) || (vehicle.total_no === 0)) {
                vehicleInputs[index].setAttribute('disabled', true);
            } else {
                vehicleInputs[index].removeAttribute('disabled');
            }
            currentLabel.textContent = vehicle.name +  '(' +  vehicle.total_no + ')';
        })
        
        if(previousIndex) {
            var prevoiusVehicle = vehicles[previousIndex] || null; 
            var prevoiusLabel = labels[previousIndex];
            if(currentPlanet && currentPlanet.distance < prevoiusVehicle.max_distance) {
                vehicleInputs[previousIndex].removeAttribute('disabled');
            }
            prevoiusLabel.textContent = prevoiusVehicle.name +  '(' +  prevoiusVehicle.total_no + ')';    
        };
    };

    return {
        createPlanetSelectOptions: createPlanetSelectOptions,
        createVehicleRadioInputs: createVehicleRadioInputs,
        updateVechileData: updateVechileData
    }
})();


var Vehicle = (function() {
    var updateCount = function(currentIndex, previousIndex) {
        if(currentIndex) {
            vehicles[currentIndex].total_no--;
        }
        if(previousIndex) {
            vehicles[previousIndex].total_no++;
        };
    };

    var uncheckInput = function(elements, index) {
        if(elements && index) {
            elements[index].checked  = false;
        }
    };

    var updatePlanetsVechileData = function(previousVehicleIndex) {
        var selectOptionElements = getPlanetSelectElements();
        Array.prototype.forEach.call(selectOptionElements, function(ele, i) {
            if(ele.selectedIndex > 0) {
                DOMUpdate.updateVechileData(i, previousVehicleIndex);
            }
        })
    }

    var getVehicleNames = function() {
        return vehiclesSelected.map(function(vehicleIndex) {
            return vehicles[vehicleIndex] && vehicles[vehicleIndex].name;
        })
    }

    return {
        updateCount: updateCount,
        uncheckInput: uncheckInput,
        updatePlanetsVechileData: updatePlanetsVechileData,
        getVehicleNames: getVehicleNames
    }
})();


var Planet = (function() {
    var toggleSelectOptions = function(selectInputIndex, planetSelectedIndex, planetPreviousSelectedIndex) {
        var selectElements = getPlanetSelectElements();
        Array.prototype.forEach.call(selectElements, function(element, index) {
            if(index != selectInputIndex) {
                if(planetPreviousSelectedIndex) {
                    element.options[planetPreviousSelectedIndex].disabled = false;
                }
                element.options[planetSelectedIndex].disabled = true;
            } else {
                element.setAttribute('prevIndex', planetSelectedIndex);
            }
        });
    }

    var updateSelectedPlanets = function(selectInputIndex, planetSelectedIndex, planetPreviousSelectedIndex) {
        var listElement = document.getElementById('list-element-' + selectInputIndex);
        var labels = listElement.getElementsByTagName('label');
        var vehicleInputs = listElement.getElementsByTagName('input');
        var vehicleIndex = vehiclesSelected[selectInputIndex];
        
        if(labels.length) {
            Vehicle.updateCount(null, vehicleIndex);
            Vehicle.uncheckInput(vehicleInputs, vehicleIndex);
            this.updatePlanetsSelected(selectInputIndex, null);
            Vehicle.updatePlanetsVechileData(null);
            Time.calculate(planetPreviousSelectedIndex - 1, null, vehicleIndex);
        }
        else {
            DOMUpdate.createVehicleRadioInputs(selectInputIndex, planetSelectedIndex);
        }
    };
    
    var updatePlanetsSelected = function(index, value) {
        vehiclesSelected.splice(index, 1, value);
    }

    var getPlanetNames = function() {
        return planetsSelected.map(function(planet) {
            return planet && planet.name;
        })
    }

    return {
        toggleSelectOptions: toggleSelectOptions,
        updateSelectedPlanets: updateSelectedPlanets,
        updatePlanetsSelected: updatePlanetsSelected,
        getPlanetNames: getPlanetNames
    }
})();

//================================== Page init data.
var initData = function() {
    Reset.planetsSelectedData();
    Reset.vehiclesSelectedData();

    getAccessToken();
    getPlanets();
    getVehicles();

}
initData();