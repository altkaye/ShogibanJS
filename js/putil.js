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

})();