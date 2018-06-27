var priorities = {};

exports.addUnitPriority = addUnitPriority 
function addUnitPriority(unit, priority) {
    priorities[unit] = priority;
}

exports.getPrioritizedUnits = getPrioritizedUnits 
function getPrioritizedUnits(unitsObj) {
    var units = [];
    for (var u in unitsObj) {
        units.push({unit: u, priority: priorities[u]});
    }
    units.sort(function (a, b) {
        return a.priority - b.priority;
    });
    return units;
}
