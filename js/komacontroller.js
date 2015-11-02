(function() {
    phina.define("sb.KomaDragController", {
        superClass: 'putil.accessory.DoubleTap',
        shogiCtrl: null,
        before:null,
        root:null,

        init: function(target, shogiCtrl, root) {
            this.superInit(target);
            this.shogiCtrl = shogiCtrl;
            this.before = {};
            this.root = root;
        },

        ondragstart: function() {
            sb.log(this.target.name + " drag start");
            this.root.focusKoma(this.target);
        },

        ondrag: function() {
        },

        returnToBefore:function() {
            this.root.disfocusKoma(this.target);
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
                    sb.log("call nextFromKomaObj");
                    this.shogiCtrl.nextFromKomaObject(this.target);
                } else {
                    //sb.log("cant do dat");
                    this.returnToBefore();
                }
            } else if (this.shogiCtrl.isHitKomadai(this.target)) {
                this.shogiCtrl.nextFromKomaObject(this.target);
                //this.back();
            } else {
                this.returnToBefore();
            }
        }

    });
})();