(function() {
    window.putil = window.putil || {};
    putil.cloneObject = function(obj) {
        var r = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var val = obj[key];
                if (typeof val == "object") r[key] = val.clone();
                else r[key] = val;
            }
        }
        r.__proto__ = obj.__proto__;
        return r;
    };
    putil.math = putil.math || {};
    putil.math.range = function(origin, min, max) {
        if (max != null && origin > max) {
            return max;
        } else if (min != null && origin < min) {
            return min;
        } else {
            return origin;
        }
    };
})();