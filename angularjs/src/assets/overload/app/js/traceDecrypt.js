function traceDecrypt(data) {
	var d = data,
		firstTime = d.firstTime;
	delete d.firstTime;
	var _decodeNumberEx = function(line) {
		var _EP_KEY = 6;
		var i = 0;
		var rets = [];
		var strLen = line.length;
		if(strLen <= 0) return rets;
		while(i < strLen) {
			var b = 0;
			var shift = 0;
			var result = 0;
			var currkey = _EP_KEY;
			do {
				b = (line.charCodeAt(i++)) - 63;
				var currValue = (((b >> 1) ^ (currkey++)) & 0x1f);
				result |= currValue << shift;
				shift += 5;
			} while ((b & 0x1) == 0);
			result = ((result & 0x01) == 0x01) ? ~(result >> 1) : (result >> 1);
			rets.push(result);
		}
		return rets;
	};
	var _decodeTimes = function(times, firstTime) {
		times = _decodeNumberEx(times);
		times[0] = firstTime;
		return times;
	};
	var _decodeLevels = function(encoded) {
		var result = [];
		if(typeof encoded == "string" && encoded && encoded.indexOf(",") != -1) {
			var levelstr = encoded.split(",");
			for(var i = 0; i < levelstr.length; i++) {
				var items = _decodeNumberEx(levelstr[i]);
				var x = 0;
				for(var j = 0; j < items.length; j++) {
					x += items[j];
					result[x] = i + 1;
				}
			}
		}
		return result;
	};
	var _decodeData = function(data) {
		if(data.lons){
            var result = [],
                lons = data.lons,
                lats = data.lats,
                levels = data.levels,
                times = data.times,
                speeds = data.speeds,
                oils = data.instantOils,
                directions = data.directions,
                length = lons.length;
            var lat = 0,
                lon = 0,
                level = 0,
                speed = 0,
                time = 0,
                oil = 0,
                direction = 0,
                pt, timeDiff = 0;
            for(var i = 0; i < length; i++) {
                level = levels[i] || 0;
                lat += lats[i] * 0.00001;
                lon += lons[i] * 0.00001;
                timeDiff = i ? +times[i] : 0;
                time += +times[i];
                speed += speeds[i];
                direction += directions[i];
                oil += oils[i];
                pt = {
                    lon: lon,
                    lat: lat,
                    time: time,
                    date: moment(time).format('YYYY-MM-DD HH:mm:ss'),
                    timeDiff: timeDiff,
                    speed: speed,
                    direction: 360 - direction,
                    oil: oil / 100,
                    levelGroup: level
                };
                result.push(pt);
            }
            return result;
		}
	};
	for(var k in d) {
		var v = data[k];
		if(k === 'levels') {
			d[k] = _decodeLevels(v);
			continue;
		}
		if(k === 'times') {
			d[k] = _decodeTimes(v, firstTime);
			continue;
		}
		d[k] = _decodeNumberEx(v);
	}
	return _decodeData(d);
}
