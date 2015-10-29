(function() {
    phina.define("sb.scene.ReplayScene", {
        superClass: "phina.display.CanvasScene",
        layout: null,
        board: null,

        init: function(param) {
            this.superInit(param);
            this.layout = putil.layout.GridLayout(param, 5, 4);
            this.layout.addChildTo(this);
            this.layout.setPosition(this.gridX.center(), this.gridY.center());
            //this.layout._debug_displayGrid();

            var boardParam = {
                width: this.layout.getWidthOf(3),
                height: this.layout.getHeightOf(3),
                backgroundColor:"transparent"
            };
            console.log(sb);
            this.board = sb.ShogiBoard(boardParam);
            this.layout.addChildInLayout(this.board, 3, 2);

            var kp = this.board.buildKomaInitParam();
            var koma = sb.Hu(kp);
            koma.flip();
            this.board.putKoma(koma, 1, 1);

            //phina.display.StarShape().addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
        }
    });
})();