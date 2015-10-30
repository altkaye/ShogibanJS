(function() {
    phina.define("sb.KomaDragController", {
        superClass: 'putil.accessory.DoubleTap',
        boardController: null,

        init: function(target, boardController, board) {
            this.superInit(target);
            this.boardController = boardController;
            this.board = board || this.boardController.board;
        },

        ondragstart: function() {
            sb.log(this.target.name + " drag start");
            this.board.popupKoma(this.target);
        },

        ondrag: function() {

        },

        ondoubletap:function() {
            this.target.flip();
        },

        ondragend: function() {
            //sb.log(this.target.name + " drag end");
            //sb.log(this.target.position)
            var kp = this.boardController.localPositionToKifPosition(this.target.position);
            if (putil.math.isIn(kp.x, 1, 9) && putil.math.isIn(kp.y, 1, 9)) {//TODO do not write 1, 9 directly
                if (this.boardController.isGoho(this.target, this.target.isReverse, kp.x, kp.y, false)) {
                    this.boardController.nextFromKomaObject(this.target);
                } else {
                    //sb.log("cant do dat");
                    this.back();
                }
            } else {
                //sb.log("out of board");
                this.back();
            }
            //this.back();
            //this.boardController.nextFromKomaController(this.target);
        }

    });
})();