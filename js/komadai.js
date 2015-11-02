(function() {
    phina.define("sb.Komadai", {
        superClass: "phina.display.Shape",
        komas: null,
        bg: null,
        layout: null,
        komaLayer: null,

        init: function(param, komaLayer) {
            this.superInit(param);
            this.komas = {};
            var bgParam = {
                width: this.width - 8,
                height: this.height - 8,
                fill: "#F3E2A9",
                stroke: "#886A08",
                strokeWidth: 2
            };
            this.bg = phina.display.RectangleShape(bgParam).addChildTo(this);

            var p = {
                width: this.width,
                height: this.height,
                column: 2,
                row: 5,
                backgroundColor: "transparent"
            };
            this.komaLayer = komaLayer;
            this.setInteractive(true, "rect");

            this.layout = sb.KomadaiLayout(p).addChildTo(this);
        },

        setReverse: function(r) {
            this.layout.isReverse = r;
            return this;
        },

        hasKoma: function(koma) {
            return this.komas[koma.className] != null;
        },

        putKoma: function(koma) {

            if (!this.komas[koma.className]) {
                this.komas[koma.className] = [];
            }
            this.komas[koma.className].push(koma);
            this.layout.addKoma(koma, this.position, this.komaLayer);
            koma.kp.x = 0;
            koma.kp.y = 0;
            if (koma.isNari) {
                koma.flip();
            }
        },

        removeAllKoma: function() {
            for (var prop in this.komas) {
                var arr = this.komas[prop];
                var self = this;
                arr.forEach(function(koma) {
                    self.layout.removeKoma(koma, self.komaLayer);
                });
                delete this.komas[prop];
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

        removeKoma: function(koma) {
            var arr = this.komas[koma.className];
            if (arr && arr.indexOf(koma) >= 0) {
                arr.splice(arr.indexOf(koma), 1);
                if (arr.length == 0) {
                    delete this.komas[koma.className];
                }
            }
            this.layout.removeKoma(koma, this.komaLayer);
            return koma;
        }
    });
})();

(function() {
    phina.define("sb.KomadaiLayout", {
        superClass: "putil.layout.GridLayout",

        posCounter: null,
        komas: null,
        isReverse: null,

        init: function(param) {
            this.superInit(param);
            this.posCounter = {};
            this.komas = {};
            this.isReverse = false;
        },

        removeKoma: function(koma, layer) {
            if (this.komas[koma.className]) {
                var prop = this.komas[koma.className].sx + "," + this.komas[koma.className].sy;
                this.posCounter[prop] -= 1;
                if (this.posCounter[prop] == 0) {
                    delete this.komas[koma.className];
                }
                layer.removeChild(koma);
            } else {
                return layer.removeChild(koma);
            }
        },

        addKoma: function(koma, origin, layer) {
            if (this.komas[koma.className]) {
                var sx = this.komas[koma.className].sx;
                var sy = this.komas[koma.className].sy;
                this.posCounter[sx + "," + sy] += 1;
                sb.log("add to komadai in prev /" + sx + "," + sy);

                var pos = this.getPositionAt(sx, sy).add(origin);
                return koma.addChildTo(layer).setPosition(pos.x, pos.y);
            }

            var initSY = this.isReverse ? 1 : this.row;
            var self = this;
            var conSY = function(p) {
                if (self.isReverse) {
                    return p <= self.row;
                } else {
                    return p >= 1;
                }
            };


            var initSX = this.isReverse ? this.column : 1;
            var conSX = function(p) {
                if (self.isReverse) {
                    return p >= 1;
                } else {
                    return p <= this.column;
                }
            }

            var dSY = this.isReverse ? 1 : -1;
            var dSX = this.isReverse ? -1 : 1;

            for (var sy = initSY; conSY(sy); sy += dSY) {
                for (var sx = 1; sx <= this.column; sx++) { //TODO
                    var prop = sx + "," + sy;
                    sb.log("prop:" + prop);
                    if (!this.posCounter[prop] || this.posCounter[prop] == 0) {
                        this.posCounter[prop] = 1;
                        sb.log("add to komadai in for /" + prop);
                        this.komas[koma.className] = {
                            sx: sx,
                            sy: sy
                        };
                        var pos = this.getPositionAt(sx, sy).add(origin);
                        return koma.addChildTo(layer).setPosition(pos.x, pos.y);
                    }
                }
            }

            sb.log("e");
        }
    });
})();