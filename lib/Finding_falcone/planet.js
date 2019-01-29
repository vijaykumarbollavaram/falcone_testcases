
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