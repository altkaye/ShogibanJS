(function() {
    phina.define("sb.KomaDragController", {
        superClass: 'putil.accessory.DoubleTap',
        shogiCtrl: null,

        init: function(target, shogiCtrl, board) {
            this.superInit(target);
            this.shogiCtrl = shogiCtrl;
            this.board = board || this.shogiCtrl.board;
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
          //  this.shogiCtrl.disfocusKoma(this.target);
            //sb.log(this.target.name + " drag end");
            //sb.log(this.target.position)
            var kp = this.shogiCtrl.localPositionToKifPosition(this.target.position);
            if (putil.math.isIn(kp.x, 1, 9) && putil.math.isIn(kp.y, 1, 9)) {//TODO do not write 1, 9 directly
                if (this.shogiCtrl.isGoho(this.target, this.target.isReverse, kp.x, kp.y, false)) {
                    this.shogiCtrl.nextFromKomaObject(this.target);
                } else {
                    //sb.log("cant do dat");
                    this.back();
                }
            } else {
                //sb.log("out of board");
                this.back();
            }
        }

    });
})();