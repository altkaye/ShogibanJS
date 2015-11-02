(function() {
    phina.define("sb.BasicShogi", {
        superClass: "phina.display.Shape",

        board: null,
        komadais: null,
        layout: null,
        topLayer: null,

        init: function(param) {
            var layoutParam = {
                width: (param.gridSize || sb.DEFAULT_GRID_SIZE) * 5,
                height: (param.gridSize || sb.DEFAULT_GRID_SIZE) * 3,
                column:5,
                row:3,
                backgroundColor: "#F0FFFF"
            };
            this.topLayer = phina.display.Shape({
                width:layoutParam.width,
                height:layoutParam.height,
                backgroundColor:"transparent"
            });

            this.superInit(layoutParam);
            this.layout = putil.layout.GridLayout(layoutParam).addChildTo(this);

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

            this.board = sb.ShogiBoard(boardParam, this.topLayer);
            this.komadais = {};

            this.komadais.sente = sb.Komadai(putil.cloneObject(komadaiParam), this.topLayer);
            this.komadais.gote = sb.Komadai(putil.cloneObject(komadaiParam), this.topLayer).setReverse(true);

            this.layout.addChildInLayout(this.komadais.sente, 5, 2.5);
            this.layout.addChildInLayout(this.komadais.gote, 1, 1.5);
            this.layout.addChildInLayout(this.board, 3, 2);
            this.topLayer.addChildTo(this.layout);

            this.shogiController = sb.ShogiController(this.layout, this.board, this.komadais).attachTo(this.layout);
        },

        focusKoma:function(koma) {

        },

        disfocusKoma:function(koma) {

        },

        flush: function() {
            this.board.removeAll();
            this.komadais.sente.removeAllKoma();
            this.komadais.gote.removeAllKoma();
        },

        initHirateGame: function(isEditable) {
            this.flush();
            //puttin
            var komaList = sb.BoardInitializer.hirate(this.board);
            if (isEditable) {
                var self = this;
                komaList.forEach(function(koma) {
                    sb.KomaDragController(koma, self.shogiController, self).attachTo(koma);
                });
            }
        },

        initFromJSON: function(json, isEditable) {
            this.flush();

            var komaList = sb.JSONConverter.JSONToBoard(json, this.board);
            if (isEditable) {
                var self = this;
                komaList.forEach(function(koma) {
                    sb.KomaDragController(koma, self.shogiController, self).attachTo(koma);
                });
            }
        },

        toJSON: function() {
            return sb.JSONConverter.toJSON(this.board, this.komadais.sente, this.komadais.gote);
        }
    })
})();