
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