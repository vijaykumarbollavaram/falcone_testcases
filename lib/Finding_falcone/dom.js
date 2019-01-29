
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