(function() {
    phina.define("sb.ShogiController", {
        superClass:"phina.accessory.Accessory",
        board:null,
        komadai:null,

        isSenteNow:true,

        init:function(root, board, komadai) {
            this.superInit(root);
            this.board = board || root;
            this.board.setInteractive(true, "rect");
            this.komadai = komadai || {
                sente:sb.Komadai(),
                gote:sb.Komadai()
            };
            this.isSenteNow = true;
        },

        setKomasOnKomadai:function(komaList) {
            var self = this;
            komaList.forEach(function(v) {
                var dai = !v.reverse ? self.komadai.sente : self.komadai.gote;
                dai.put(v);
            });
        },

        focusKoma:function(koma) {
            this._cache = koma.parent;
            koma.addChildTo(this.target);
        },

        disfocusKoma:function(koma) {
            koma.addChildTo(this._cache);
        },


        isGoho:function(koma, senteOrGote, kx, ky, nari) {
            if (!koma.nari && nari) {
                return false;
            }
            var kp = this.board.localPositionToKifPosition(koma);

            kx = kx || kp.x;
            ky = ky || kp.y;

            var dstKoma = this.board.getKomaAt(kx, ky);
            if (!dstKoma) {
                return true;
            }
            return false;//TODO
        },

        nextFromKomaObject:function(koma, sente, nari) {
            var kp = this.localPositionToKifPosition(koma.position);
            sente = sente || !koma.isReverse;
            nari = nari || koma.isNari;
            this.next(koma, this.isSente(sente), kp.x, kp.y, nari);
        },

        localPositionToKifPosition:function(position) {
            return this.board.localPositionToKifPosition(position);
        },

        isHitKomadai:function(koma, senteOrGote) {
            var dai = this.isSente(senteOrGote || !koma.isReverse) ? this.komadai.sente : this.komadai.gote;
            return dai.hitTestElement(koma);//TODO komadai.testHitElm is not implemented
        },

        putKomaOnBoard:function(koma, kx, ky) {
            this.board.putKoma(koma, kx, ky);
        },

        isSente:function(expression) {
            var ret = expression;//return directly if expression is bool

            var sentePettern = [
                "sente", "Sente", "black", "Black", "▲", "▼", "+"
            ];
            var gotePattern = [
                "gote", "Gote", "white", "White", "△", "▽", "-"
            ];

            if (sentePettern.indexOf(expression) >= 0) {
                ret = true;
            }
            if (gotePattern.indexOf(expression) >= 0) {
                ret = false;
            }

            return ret;
        },

        next:function(koma, senteOrGote, kx, ky, nari) {
            var isSente = this.isSente(senteOrGote);
            var dai = isSente ? this.komadai.sente : this.komadai.gote;

            if ((isSente && koma.isReverse) || (!isSente && !koma.isReverse)) {
                koma.reverse();
            }
            sb.log(kx +  "," + ky);
            if (0 < kx && 0 < ky && kx < 10 && ky < 10) {
                if (dai.hasKoma(koma)) {
                    dai.removeKoma(koma);
                }
                if (nari == null) {
                    //DO NOTING
                } else if ((nari && !koma.isNari) || (!nari && koma.isNari)) {
                    koma.flip();
                }
                //apply to view
                this.board.moveKoma(koma, kx, ky);
                sb.log("koma move on board");
            } else {
                sb.log("put on dai/" + isSente);
                this.board.removeKoma(koma);
                dai.putKoma(koma);
                if (koma.isNari) {
                    koma.flip();
                }
            }
        }

    });
})();