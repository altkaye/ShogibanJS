(function() {
    phina.define("sb.KomaDragController", {
        superClass: 'phina.accessory.Draggable',
        boardController: null,

        init: function(target, boardController) {
            this.superInit(target);
            this.boardController = boardController;
        },

        ondragstart: function() {
            sb.log(this.target.name + " drag start");
        },

        ondrag: function() {

        },

        ondragend: function() {
            sb.log(this.target.name + " drag end");
            sb.log(this.target.position)
            var kp = this.boardController.localPositionToKifPosition(this.target.position);
            if (putil.math.isIn(kp.x, 1, 9) && putil.math.isIn(kp.y, 1, 9)) {//TODO do not write 1, 9 directly
                this.boardController.nextFromKomaObject(this.target);
            } else {
                console.log("out of board");
                this.back();
            }
            //this.back();
            //this.boardController.nextFromKomaController(this.target);
        }

    });
})();