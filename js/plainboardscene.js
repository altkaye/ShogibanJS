(function() {
    phina.define("sb.scene.PlainBoardScene", {
        superClass: "phina.display.CanvasScene",
        layout: null,
        board: null,
        komadais: null,
        isEditable: null,
        shogiController: null,

        init: function(param) {
            this.superInit(param);
            var lp = {
                width: param.width,
                height: param.height,
                backgroundColor: param.bgcolor || "#F0FFFF"
            };
            this.isEditable = param.isEditable;

            this.layout = putil.layout.GridLayout(lp, 5, 3);
            this.layout.addChildTo(this);
            this.layout.setPosition(this.gridX.center(), this.gridY.center());
            //this.layout._debug_displayGrid();

            var boardParam = {
                width: this.layout.getWidthOf(3),
                height: this.layout.getHeightOf(3),
                backgroundColor: "transparent"
            };

            var komadaiParam = {
                width: this.layout.getWidthOf(1),
                height: this.layout.getHeightOf(2),
                backgroundColor: "transparent"
            }

            this.board = sb.ShogiBoard(boardParam);
            this.komadais = {};

            this.komadais.sente = sb.Komadai(putil.cloneObject(komadaiParam));
            this.komadais.gote = sb.Komadai(putil.cloneObject(komadaiParam));

            this.layout.addChildInLayout(this.komadais.sente, 5, 2.5);
            this.layout.addChildInLayout(this.komadais.gote, 1, 1.5);

            this.layout.addChildInLayout(this.board, 3, 2);

            this.shogiController = sb.ShogiController(this.layout, this.board, this.komadais).attachTo(this.layout);

            this.initHirateGame();

            this._json = this.toJSON();
        },

        flush: function() {
            this.board.removeAll();
            this.komadais.sente.removeAllKoma();
            this.komadais.gote.removeAllKoma();
        },

        initHirateGame: function() {
            this.flush();
            //puttin
            var komaList = sb.BoardInitializer.hirate(this.board);
            if (this.isEditable) {
                var self = this;
                komaList.forEach(function(koma) {
                    sb.KomaDragController(koma, self.shogiController).attachTo(koma);
                });
            }
        },

        update: function(app) {
            //TODO test code
            if (app.keyboard.getKey("ctrl")) {
                if (app.keyboard.getKeyDown("c")) {
                    this.backup();
                }
            }
            /**
                if (app.keyboard.getKeyDown("v")) {
                    this.initFromJSON(this._json);
                    this.flare("paste");
                }
            }
            **/
        },

        backup: function() {
            this._json = this.toJSON();
            this.flare("backup", {
                json: this._json
            }); //TODO create accessory
        },

        initFromJSON: function(json) {
            this.flush();

            var komaList = sb.JSONConverter.JSONToBoard(json, this.board);
            if (this.isEditable) {
                var self = this;
                komaList.forEach(function(koma) {
                    sb.KomaDragController(koma, self.shogiController).attachTo(koma);
                });
            }
        },

        toJSON: function() {
            return sb.JSONConverter.toJSON(this.board, this.komadais.sente, this.komadais.gote);
        }
    });
})();