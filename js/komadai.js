(function() {
    phina.define("sb.Komadai", {
        superClass:"phina.display.Shape",
        komas: null,
        bg:null,

        init: function(param) {
            this.superInit(param);
            this.komas = [];
            var bgParam = {
                width:this.width - 8,
                height:this.height - 8,
                fill:"#F3E2A9",
                stroke:"#886A08",
                strokeWidth:2
            };
            this.bg = phina.display.RectangleShape(bgParam).addChildTo(this);
        },

        hasKoma: function(koma) {
            return this.komas.indexOf(koma) >= 0;
        },

        putKoma: function(koma) {
            return this.komas.push(koma);
        },

        removeAllKoma:function() {
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

        removeKoma: function(koma) {
            return this.komas.splice(this.komas.indexOf(koma), 1);
        }
    });
})();