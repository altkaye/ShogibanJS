(function() {
    phina.define("sb.ShogiBoard", {
        superClass: "phina.display.Shape",
        boardLayout: null,

        paddingX: 0,
        paddingY: 0,

        komaPaddingX: 0,
        komaPaddingY: 0,

        komas:null,

        init: function(param) {
            this.superInit(param);
            this.paddingX = param.paddingX || 8;
            this.paddingY = param.paddingY || 8;
            this.komaPaddingX = param.komaPaddingX || 4;
            this.komaPaddingY = param.komaPaddingY || 4;

            this.komas = {};
            this.boardLayout = sb.ShogiBoardLayout(this.width - this.paddingX * 2, this.height - this.paddingY * 2);
            this.boardLayout.addChildTo(this);
        },

        buildKomaInitParam: function() {
            return {
                width: this.boardLayout.getWidthOf(1) - this.komaPaddingX * 2,
                height: this.boardLayout.getHeightOf(1) - this.komaPaddingY * 2,
                backgroundColor: "transparent"
            };
        },

        localPositionToKifPosition:function(position) {
            var unceilX = (position.x + this.boardLayout.width / 2) / this.boardLayout.getWidthOf(1);
            var unceilY = (position.y + this.boardLayout.height / 2) / this.boardLayout.getHeightOf(1);

            var kx = 10 - Math.ceil(unceilX);
            var ky = Math.ceil(unceilY);
            return phina.geom.Vector2(kx, ky);
        },

        moveKoma:function(koma, kx, ky) {
            this.removeKoma(koma);
            this.putKoma(koma, kx, ky);
        },

        toString:function() {
            var ret = [];
            for (var prop in this.komas) {
                var koma = this.komas[prop];

                var s = {};
                s.name = koma.name;
            }
        },

        getKomaAt:function(kx, ky) {
            return this.komas[kx + "," + ky];
        },

        putKoma: function(koma, kx, ky) {
            this.komas[kx + "," + ky] = koma;
            this.boardLayout.addChildByKifPoistion(koma, kx, ky);
        },

        removeKoma: function(koma) {
            for (var prop in this.komas) {
                if (this.komas[prop] === koma) {
                    this.komas[prop] = null;
                    break;
                }
            }
            this.boardLayout.removeChild(koma);
        }
    });
})();

(function() {
    phina.define("sb.ShogiBoardLayout", {
        superClass: "putil.layout.GridLayout",

        init: function(width, height, column, row) {
            var param = {
                width: width,
                height: height,
                backgroundColor: "#F3E2A9",
                fill: "green",
                stroke: "#886A08",
                strokeWidth: 2
            };
            column = column || 9;
            row = row || 9;
            this.superInit(param, column, row);
        },

        addChildByKifPoistion:function(koma, kx, ky) {
            this.addChildInLayout(koma, this.column + 1 - kx, ky);
        },

        _render: function() {
            this._renderBackground();
            this.canvas.transformCenter();
            this.canvas.strokeStyle = this.stroke;
            this.canvas.context.lineWidth = this.strokeWidth;
            var xb = -this.width / 2;
            var yb = -this.height / 2;

            // column line
            for (var i = 0; i < this.column + 1; i++) {
                this.canvas.drawLine(
                    i * this.getWidthOf(1) + xb, yb,
                    i * this.getWidthOf(1) + xb, yb + this.height);
            }
            //row line
            for (var i = 0; i < this.row; i++) {
                this.canvas.drawLine(
                    xb, yb + i * this.getHeightOf(1),
                    xb + this.width, yb + i * this.getHeightOf(1));
            }
        }
    });
})();