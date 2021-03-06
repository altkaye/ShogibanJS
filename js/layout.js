(function() {
    phina.define("putil.layout.GridLayout", {
        superClass: "phina.display.Shape",
        column: 0,
        row: 0,
        width:0,
        height:0,

        init: function(param, column, row) {
            this.superInit(param);
            this.width = param.width;
            this.height = param.height;
            this.column = param.column || column || 1;
            this.row = param.row || row || 1;
        },

        addChildInLayout: function(child, x, y) {
            x = x || 1;
            y = y || 1;
            var p = this.getPositionAt(x, y);
            child.addChildTo(this);
            child.setPosition(p.x, p.y);
        },

        setPositionInLayout: function(target, x, y) {
            x = x || 1;
            y = y || 1;
            var p = this.getPositionAt(x, y);
            target.setPosition(p.x, p.y);
        },

        _debug_displayGrid: function() {

            for (var x = 1; x <= this.column; x++) {
                for (var y = 1; y <= this.row; y++) {
                    var rectangle = phina.display.RectangleShape({
                        width: this.getWidthOf(1),
                        height: this.getHeightOf(1)
                    });
                    var star = phina.display.StarShape();
                    this.addChildInLayout(rectangle, x, y);
                    this.addChildInLayout(star, x, y);
                }
            }
            return this;
        },

        getPositionAt: function(x, y) {
            var px = this.getWidthOf(x - 0.5) - this.width / 2;
            var py = this.getHeightOf(y - 0.5) - this.height / 2;
            return phina.geom.Vector2(px, py);
        },

        getWidthOf: function(span) {
            return span * (this.width / this.column);
        },

        getHeightOf: function(span) {
            return span * (this.height / this.row);
        }
    });
})();