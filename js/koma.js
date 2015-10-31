(function() {
    phina.define("sb.Koma", {
        superClass: "phina.display.Shape",
        komaShape: null,

        reverseLabel:true,
        label: null,

        name: null,
        nari: null,

        isNari: false,

        movement: null,

        isReverse: false,

        init: function(param, name, nariName) {
            this.superInit(param);
            this.komaShape = sb.KomaShape(param);
            this.komaShape.addChildTo(this);

            this.name = param.name || name;
            this.nari = param.nari || nariName;
            this.reverseLabel = param.reverseLabel || true;

            var labelParam = {
                text: this.name,
                fontSize: this.width * 0.6,
                strokeWidth: 0.4
            };
            this.label = phina.display.Label(labelParam).addChildTo(this);
        },

        toJSON:function() {
            var ret = {
                className:this.className,
                isNari:this.isNari,
                isReverse:this.isReverse
            };
            return ret;
        },

        getCurrentName:function() {
            return !this.isNari ? this.name : this.nariName;
        },

        haveNari: function() {
            return nari !== null;
        },

        reverse: function() {
            this.isReverse = !this.isReverse;
            this.komaShape.rotation = this.isReverse ? 180 : 0;
            this.label.rotation = this.isReverse && this.reverseLabel ? 180 : 0;
            return this;
        },

        flip: function() {
            if (!this.nari) {
                return;
            }
            this.isNari = !this.isNari;
            this.label.stroke = this.isNari ? "red" : "black";
            this.label.fill = this.isNari ? "red" : "black";
            this.label.text = this.isNari ? this.nari : this.name;
            return this;
        },

        registerMovement: function(dst, isNari) {
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
            this.corner = param.corner || phina.geom.Vector2(this.width / 10, this.height / 5);
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