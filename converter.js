    const __ = require('lodash');
    const PoiFleets =  require("./constants/poi-fleets");
    const defaultSortieId = 1;
    const defaultBattleId = 10000;

getWorld = function(poiDataList) {
    return __.get(poiDataList, ["map", 0], 0);
}

getMap = function(poiDataList) {
    return __.get(poiDataList, ["map", 1]);
}

getSortieTime = function(poiDataList) {
    return parseInt((poiDataList.time ? poiDataList.time : Date.now()) / 1000);
}

getCombinedType = function(poiDataList) {
    return __.get(poiDataList, ["fleet", "type"], 0);
}

getFleet = function(poiDataList, poiFleetKey, isBossSupport) {
    const poiData = isBossSupport === true ? __.last(poiDataList) : poiDataList;
    return convertFleet(__.get(poiData, ["fleet", poiFleetKey]));
}

convertFleet = function(poiFleetData) {

    return poiFleetData ? __.map(__.compact(poiFleetData), function (poiShip) {

        const output = {
            "mst_id": poiShip.api_ship_id,
            "level": poiShip.api_lv,
            "kyouka": poiShip.api_kyouka,
            "morale": poiShip.api_cond,
            "equip": [],
            "stars": [],
            "ace": []
        };

        const allEquip = poiShip.poi_slot ? __.compact(poiShip.poi_slot) : [];
        poiShip.poi_slot_ex && allEquip.push(poiShip.poi_slot_ex);
        __.forEach(allEquip, equipment => {
            output.equip.push(equipment.api_slotitem_id);
            output.stars.push(equipment.api_level);
            output.ace.push(equipment.api_alv);
        });

        return output;
    }) : [];
}

getLbas = function(poiDataList) {
    const poiLbac = __.get(poiDataList, ["fleet", "LBAC"]);
    return poiLbac ? __.compact(__.map(poiLbac, lbac => lbac && {
        "rid": lbac.api_rid,
        "range": lbac.api_distance,
        "action": lbac.api_action_kind,
        "planes": __.map(lbac.api_plane_info, poiPlaneInfo => poiPlaneInfo && {
            "mst_id": __.get(poiPlaneInfo, ["poi_slot", "api_slotitem_id"]),
            "count": __.get(poiPlaneInfo, "api_count"),
            "stars": __.get(poiPlaneInfo, ["poi_slot", "api_level"]),
            "ace": __.get(poiPlaneInfo, ["poi_slot", "api_alv"]),
            "state": __.get(poiPlaneInfo, "api_state"),
            "morale": __.get(poiPlaneInfo, "api_cond")
        })
    })) : []
}

checkHasNodeSupport = function(poiDataList) {
    return __.some(__.initial(poiDataList), fleetData => __.get(fleetData, ["fleet", "support"])) ? 1 : 0;
}

checkHasBossSupport = function(poiDataList) {
    return __.get(__.last(poiDataList), ["fleet", "support"]) != null ? 1 : 0;
}

getBattles = function(poiDataList) {
 const battleResult = __.last(poiDataList.packet);
 return {
  "sortie_id": defaultSortieId,                                   // Not mappable, corresponds to KC3K's combat data top level id
  "node": __.get(poiDataList, ["map", 2]),
  "data": __.get(poiDataList, ["packet", 0]),
  "yasen": poiDataList.packet.length > 2 ? __.get(poiDataList, ["packet", 1]) : {}, // Conditional - if 'packet.length > 2', and has key 'api_deck_id', also 'poi_path' === "/kcsapi/api_req_battle_midnight/battle",
  "rating": battleResult.api_win_rank,
  "drop": __.get(battleResult, ["api_get_ship", "api_ship_id"]),
  "time": __.get(battleResult, "poi_time", Date.now()) / 1000,
  "baseEXP": battleResult.api_get_base_exp,
  "hqEXP": battleResult.api_get_exp,
  "mvp": [battleResult.api_mvp],
  "id": defaultBattleId                                              // Not mappable, unique ID for this battle by KC3K
}
}

module.exports.convert = function(poiDataList) {
    const lo = require('lodash');
    const PoiFleets =  require("./constants/poi-fleets");
    const defaultSortieId = 1;
    const defaultBattleId = 10000;
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
    }
}