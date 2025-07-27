    const __ = require('lodash');
    const PoiFleets = require("./constants/poi-fleets");
    const defaultSortieId = 1;
    const defaultBattleId = 10000;

function getWorld(poiDataList) {
    return __.get(poiDataList, ["map", 0], 0);
}

function getMap(poiDataList) {
    return __.get(poiDataList, ["map", 1], 0);
}

function getSortieTime(poiDataList) {
    return parseInt((poiDataList.time ? poiDataList.time : Date.now()) / 1000);
}

function getCombinedType(poiDataList) {
    return __.get(poiDataList, ["fleet", "type"], 0);
}

function getFleet(poiDataList, poiFleetKey, isBossSupport) {
    const poiData = isBossSupport === true ? __.last(poiDataList) : poiDataList;
    return convertFleet(__.get(poiData, ["fleet", poiFleetKey]));
}

function convertFleet(poiFleetData) {
    if (!poiFleetData || !Array.isArray(poiFleetData)) {
        return [];
    }

    return __.map(__.compact(poiFleetData), function (poiShip) {
        if (!poiShip || !poiShip.api_ship_id) {
            return null;
        }

        const output = {
            "mst_id": poiShip.api_ship_id,
            "level": poiShip.api_lv || 1,
            "kyouka": poiShip.api_kyouka || [0, 0, 0, 0],
            "morale": poiShip.api_cond || 49,
            "equip": [],
            "stars": [],
            "ace": []
        };

        const allEquip = poiShip.poi_slot ? __.compact(poiShip.poi_slot) : [];
        if (poiShip.poi_slot_ex) {
            allEquip.push(poiShip.poi_slot_ex);
        }
        
        __.forEach(allEquip, equipment => {
            if (equipment && equipment.api_slotitem_id) {
                output.equip.push(equipment.api_slotitem_id);
                output.stars.push(equipment.api_level || 0);
                output.ace.push(equipment.api_alv || 0);
            }
        });

        return output;
    }).filter(ship => ship !== null);
}

function getLbas(poiDataList) {
    const poiLbac = __.get(poiDataList, ["fleet", "LBAC"]);
    if (!poiLbac) {
        return [];
    }
    
    return __.compact(__.map(poiLbac, lbac => {
        if (!lbac) return null;
        
        return {
            "rid": lbac.api_rid || 0,
            "range": lbac.api_distance || 0,
            "action": lbac.api_action_kind || 0,
            "planes": __.map(lbac.api_plane_info || [], poiPlaneInfo => {
                if (!poiPlaneInfo) return null;
                
                return {
                    "mst_id": __.get(poiPlaneInfo, ["poi_slot", "api_slotitem_id"], 0),
                    "count": __.get(poiPlaneInfo, "api_count", 0),
                    "stars": __.get(poiPlaneInfo, ["poi_slot", "api_level"], 0),
                    "ace": __.get(poiPlaneInfo, ["poi_slot", "api_alv"], 0),
                    "state": __.get(poiPlaneInfo, "api_state", 1),
                    "morale": __.get(poiPlaneInfo, "api_cond", 49)
                };
            }).filter(plane => plane !== null)
        };
    }));
}

function checkHasNodeSupport(poiDataList) {
    if (!Array.isArray(poiDataList)) {
        return 0;
    }
    return __.some(__.initial(poiDataList), fleetData => __.get(fleetData, ["fleet", "support"])) ? 1 : 0;
}

function checkHasBossSupport(poiDataList) {
    if (!Array.isArray(poiDataList)) {
        return 0;
    }
    return __.get(__.last(poiDataList), ["fleet", "support"]) != null ? 1 : 0;
}

function getBattles(poiDataList) {
    if (!poiDataList.packet || !Array.isArray(poiDataList.packet) || poiDataList.packet.length === 0) {
        return {
            "sortie_id": defaultSortieId,
            "node": __.get(poiDataList, ["map", 2], 0),
            "data": {},
            "yasen": {},
            "rating": "S",
            "drop": null,
            "time": getSortieTime(poiDataList),
            "baseEXP": 0,
            "hqEXP": 0,
            "mvp": [0],
            "id": defaultBattleId
        };
    }
    
    const battleResult = __.last(poiDataList.packet);
    
    return {
        "sortie_id": defaultSortieId,
        "node": __.get(poiDataList, ["map", 2], 0),
        "data": __.get(poiDataList, ["packet", 0], {}),
        "yasen": poiDataList.packet.length > 2 ? __.get(poiDataList, ["packet", 1], {}) : {},
        "rating": __.get(battleResult, "api_win_rank", "S"),
        "drop": __.get(battleResult, ["api_get_ship", "api_ship_id"], null),
        "time": __.get(battleResult, "poi_time", Date.now()) / 1000,
        "baseEXP": __.get(battleResult, "api_get_base_exp", 0),
        "hqEXP": __.get(battleResult, "api_get_exp", 0),
        "mvp": [__.get(battleResult, "api_mvp", 0)],
        "id": defaultBattleId
    };
}

module.exports.convert = function(poiDataList) {
    try {
        if (!poiDataList) {
            throw new Error("No battle data provided");
        }
        
        const escortFleet = getFleet(poiDataList, PoiFleets.escort);
        
        return {
            "id": defaultSortieId,
            "world": getWorld(poiDataList),
            "mapnum": getMap(poiDataList),
            "fleetnum": 1,
            "combined": getCombinedType(poiDataList),
            "fleet1": getFleet(poiDataList, PoiFleets.main),
            "fleet2": escortFleet,
            "fleet3": getFleet(poiDataList, PoiFleets.support),
            "fleet4": getFleet(poiDataList, PoiFleets.support, true),
            "support1": checkHasNodeSupport(poiDataList),
            "support2": checkHasBossSupport(poiDataList),
            "lbas": getLbas(poiDataList),
            "time": getSortieTime(poiDataList),
            "battles": [getBattles(poiDataList)]
        };
    } catch (error) {
        console.error("Error converting battle data:", error);
        throw new Error(`Failed to convert battle data: ${error.message}`);
    }
};