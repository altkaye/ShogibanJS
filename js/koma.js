(function() {
    phina.define("sb.Koma", {
        superClass:"phina.display.Shape",
        komaShape:null,

        label:null,

        name:null,
        nariName:null,

        isNari:false,

        movement:null,

        init:function(param, name, nariName) {
            this.superInit(param);
            this.komaShape = sb.KomaShape(param);
            this.komaShape.addChildTo(this);

            this.name = param.name || name;
            this.nariName = param.nari || nariName;

            var labelParam = {
                text:this.name,
                fontSize:this.width * 0.6,
                strokeWidth:1
            };
            this.label = phina.display.Label(labelParam).addChildTo(this);
        },

        flip:function() {
            this.isNari = !this.isNari;
            this.label.text = isNari ? nariName : name;
        },

        registerMovement:function(dst, isNari) {
            var prop = isNari ? "nari" : "normal";
            this.movement[prop].push(dst);
        }
    })
})();


(function() {
    phina.define("sb.KomaShape", {
        superClass: "phina.display.Shape",

        init: function(param) {
            this.superInit(param);
            this.corner = param.corner || phina.geom.Vector2(this.width / 8, this.height / 4);
        },

        _render: function() {
            this._renderBackground();
            this.canvas.transformCenter();
            var xb = -this.width / 2;
            var yb = -this.height / 2;

            //bottom
            this.canvas.drawLine(
                0 + xb, this.height + yb,
                this.width + xb, this.height + yb
            );

            //left side
            this.canvas.drawLine(
                0 + xb, this.height + yb,
                this.corner.x + xb, this.corner.y + yb
            );
            this.canvas.drawLine(
                this.corner.x + xb, this.corner.y + yb,
                this.width / 2 + xb, 0 + yb
            );

            //right side
            this.canvas.drawLine(
                this.width + xb, this.height + yb,
                this.width - this.corner.x + xb, this.corner.y + yb
            );
            this.canvas.drawLine(
                this.width - this.corner.x + xb, this.corner.y + yb,
                this.width / 2 + xb, 0 + yb
            );


        }
    });
})();