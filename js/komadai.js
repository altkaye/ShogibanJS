(function() {
    phina.define("sb.Komadai", {
        superClass:"phina.display.Shape",
        komas: null,
        bg:null,
        layout:null,

        init: function(param) {
            this.superInit(param);
            this.komas = {};
            var bgParam = {
                width:this.width - 8,
                height:this.height - 8,
                fill:"#F3E2A9",
                stroke:"#886A08",
                strokeWidth:2
            };
            this.bg = phina.display.RectangleShape(bgParam).addChildTo(this);

            var p = {
                width:this.width,
                height:this.height,
                column:2,
                row:5,
                backgroundColor:"transparent"
            };

            this.layout = putil.layout.GridLayout(p).addChildTo(this);
        },

        hasKoma: function(koma) {
            return this.komas.indexOf(koma) >= 0;
        },

        putKoma: function(koma) {
            var pos = phina.geom.Vector2(0, 0);

            if (!this.komas[koma.className]) {
                this.komas[koma.className] = [];
                var l = this.komas.length;
                pos.x = Math.floor(l % this.layout.column) + 1;
                pos.y = Math.floor(l / this.layout.row) + 1;
                pos = this.layout.getPositionAt(pos.x, pos.y);
            } else {
                var old = this.komas[koma.className][0];
                pos.x = old.x;
                pos.y = old.y;
            }
            this.komas[koma.className].push(koma);
            koma.addChildTo(this.layout).setPosition(pos.x, pos.y);
        },

        removeAllKoma:function() {
            for (var prop in this.komas) {
                var arr = this.komas[prop];
                var self = this;
                arr.forEach(function(koma) {
                    self.layout.removeChild(koma);
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
            this.layout.removeChild(koma);
            return koma;
        }
    });
})();