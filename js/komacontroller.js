(function() {
    phina.define("sb.KomaDragController", {
        superClass: 'putil.accessory.DoubleTap',
        shogiCtrl: null,
        before: null,
        root: null,

        init: function(target, shogiCtrl, root) {
            this.superInit(target);
            this.shogiCtrl = shogiCtrl;
            this.before = {};
            this.root = root;
            var self = this;

            this.on('attached', function() {
                this.target.setInteractive(true);
                putil.accessory.DoubleTap(this.target).attachTo(this.target);

                this.target.on('pointstart', function(e) {
                    self.initialPosition = phina.geom.Vector2(0, 0);
                    // self._startPointMove = true;
                    self.initialPosition.x = this.x;
                    self.initialPosition.y = this.y;
                    self.flare('movestart');
                });

                this.target.on('pointmove', function(e) {
                    //if (self._startPointMove) {
                    this.x += e.pointer.dx;
                    this.y += e.pointer.dy;
                    // }
                });

                this.target.on('pointend', function(e) {
                    self.flare('moveend');
                    // self._startPointMove = false;
                });
            });
        },

        ondoubletap: function() {
            if (this.shogiCtrl.isHitKomadai(this.target)) {
                return;
            }

            if (!this.target.isNari && !this.target.isReverse) {
                if (this.target.nari) {
                    this.target.flip();
                } else {
                    this.target.reverse();
                }
            } else if (this.target.isNari && !this.target.isReverse) {
                this.target.flip();
                this.target.reverse();
            } else if (!this.target.isNari) {
                if (this.target.nari) {
                    this.target.flip();
                } else {
                    this.target.reverse();
                }
            } else {
                this.target.reverse();
                this.target.flip();
            }
        },

        onmovestart: function() {
            sb.log(this.target.name + " start");
            this.root.focusKoma(this.target);
        },

        returnToBefore: function() {
            this.root.disfocusKoma(this.target);
            this.back();
        },

        back: function() {
            this.target.x = this.initialPosition.x;
            this.target.y = this.initialPosition.y;
        },


        onmoveend: function() {
            //  this.shogiCtrl.disfocusKoma(this.target);
            //sb.log(this.target.name + " drag end");
            //sb.log(this.target.position)
            this.root.disfocusKoma(this.target);
            var kp = this.shogiCtrl.localPositionToKifPosition(this.target.position);
            if (putil.math.isIn(kp.x, 1, 9) && putil.math.isIn(kp.y, 1, 9)) { //TODO do not write 1, 9 directly
                if (this.shogiCtrl.isGoho(this.target, this.target.isReverse, kp.x, kp.y, false)) {
                    sb.log("call nextFromKomaObj");
                    this.shogiCtrl.nextFromKomaObject(this.target);
                } else {
                    //sb.log("cant do dat");
                    this.returnToBefore();
                }
            } else if (this.shogiCtrl.isHitKomadai(this.target) && this.target.kp.x != 0 && this.target.kp.y != 0) {
                this.shogiCtrl.nextFromKomaObject(this.target);
                //this.back();
            } else {
                sb.log("nothing to do");
                this.returnToBefore();
            }
        }

    });
})();