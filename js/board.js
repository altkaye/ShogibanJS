(function() {
    phina.define("sb.ShogiBoard", {
        superClass: "phina.display.Shape",
        boardLayout: null,

        paddingX: 0,
        paddingY: 0,

        komaPaddingX: 0,
        komaPaddingY: 0,

        init: function(param) {
            this.superInit(param);
            this.paddingX = param.paddingX || 8;
            this.paddingY = param.paddingY || 8;
            this.komaPaddingX = param.komaPaddingX || 4;
            this.komaPaddingY = param.komaPaddingY || 4;


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

        putKoma: function(koma, x, y) {
            this.boardLayout.addChildInLayout(koma, 10 - x, y);
        },

        removeKoma: function(koma) {
            this.boardLayout.removeChild(koma);
        }
    });
})();

(function() {
    phina.define("sb.ShogiBoardLayout", {
        superClass: "putil.layout.GridLayout",

        init: function(width, height) {
            var param = {
                width: width,
                height: height,
                backgroundColor: "#F3E2A9",
                fill: "green",
                stroke: "#886A08",
                strokeWidth: 2
            };
            this.superInit(param, 9, 9);
        },

        _render: function() {
            this._renderBackground();
            this.canvas.transformCenter();
            this.canvas.strokeStyle = this.stroke;
            this.canvas.context.lineWidth = this.strokeWidth;
            var xb = -this.width / 2;
            var yb = -this.height / 2;

            // column line
            for (var i = 0; i < 10; i++) {
                this.canvas.drawLine(
                    i * this.getWidthOf(1) + xb, yb,
                    i * this.getWidthOf(1) + xb, yb + this.height);
            }
            //row line
            for (var i = 0; i < 10; i++) {
                this.canvas.drawLine(
                    xb, yb + i * this.getHeightOf(1),
                    xb + this.width, yb + i * this.getHeightOf(1));
            }
        }
    });
})();