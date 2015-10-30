(function() {
    phina.define("sb.scene.PlainBoardScene", {
        superClass: "phina.display.CanvasScene",
        layout: null,
        board: null,

        init: function(param) {
            this.superInit(param);
            var lp = {
                width:param.width,
                height:param.height,
                backgroundColor:"#F0FFFF"
            };
            this.layout = putil.layout.GridLayout(lp, 3, 3);
            this.layout.addChildTo(this);
            this.layout.setPosition(this.gridX.center(), this.gridY.center());
            //this.layout._debug_displayGrid();

            var boardParam = {
                width: this.layout.getWidthOf(3),
                height: this.layout.getHeightOf(3),
                backgroundColor: "transparent"
            };
            console.log(sb);
            this.board = sb.ShogiBoard(boardParam);
            this.layout.addChildInLayout(this.board, 2, 2);
            //put coma
            var komaList = sb.BoardInitializer.hirate(this.board);
            //init controller
            var shogiController = sb.ShogiController(this.board).attachTo(this.board);

            komaList.forEach(function(val) {
                sb.KomaDragController(val, shogiController).attachTo(val);
            });

            //phina.display.StarShape().addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
        }
    });
})();