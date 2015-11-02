(function() {
    phina.define("sb.scene.PlainBoardScene", {
        superClass: "phina.display.CanvasScene",
        shogi: null,

        init: function(param) {
            this.superInit(param);

            this.shogi = sb.BasicShogi(param);

            this.shogi.addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
            this.shogi.initHirateGame(true);
        },

        update: function(app) {
            if (app.keyboard.getKey("ctrl")) {
                if (app.keyboard.getKeyDown("c")) {
                    this.backup();
                }
            }
        },

        initFromJSON: function(json) {
            this.shogi.initFromJSON(json, true);
        },

        toJSON :function() {
            return this.shogi.toJSON();
        },

        backup: function() {
            this._json = this.shogi.toJSON();
            this.flare("backup", {
                json: this._json
            }); //TODO create accessory
        }
    });
})();