(function() {
    phina.define("sb.Komadai", {
        komas: null,

        init: function() {
            this.komas = [];
        },

        testHitElement: function() {
            return false; //TODO temp
        },
        has: function(koma) {
            return this.komas.indexOf(koma) >= 0;
        },

        put: function(koma) {
            return this.komas.push(koma);
        },

        removeAll:function() {
            for (var i = 0; i < this.komas; i++) {
                this.remove(komas[i]);
            }
        },

        toJSONArray: function() {
            var ret = [];
            for (var prop in this.komas) {
                var koma = this.komas[prop].toJSON();
                var kp = this.propToKp(prop);

                koma.kx = kp.x;
                koma.ky = kp.y;

                //var op = this.boardLayout.getPositionFromKp(kp.x, kp.y);
                //koma.dx = (op.x - koma.position.x) / this.boardLayout.width;
                //koma.dy = (op.y - koma.position.y) / this.boardLayout.height;

                ret.push(koma);
            }
            return ret;
        },

        remove: function(koma) {
            return this.komas.splice(this.komas.indexOf(koma), 1);
        }
    });
})();