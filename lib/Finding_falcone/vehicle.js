
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