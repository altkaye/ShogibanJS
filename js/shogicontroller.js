(function() {
    phina.define("sb.ShogiController", {
        superClass:"phina.accessory.Accessory",
        board:null,
        komadai:null,

        init:function(root, board, komadai) {
            this.superInit(root);
            this.board = board || root;

            this.komadai = komadai || {
                sente:sb.Komadai(),
                gote:sb.Komadai()
            };
        },

        setKomasOnKomadai:function(komaList) {
            var self = this;
            komaList.forEach(function(v) {
                var dai = !v.reverse ? self.komadai.sente : self.komadai.gote;
                dai.put(v);
            });
        },

        nextFromKomaObject:function(koma, sente, nari) {
            var p = this.board.localPositionToKif(koma.position);
            sb.log(p);
            sente = sente || !koma.isReverse;
            nari = nari || koma.isNari;
            this.moveKoma(koma, sente, p.x, p.y, nari);
        },

        putKomaOnBoard:function(koma, x, y) {
            this.board.putKoma(koma, x, y);
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

        moveKoma:function(koma, senteOrGote, x, y, nari) {
            var isSente = this.isSente(senteOrGote);
            var dai = isSente ? this.komadai.sente : this.komadai.gote;

            if ((isSente && koma.isReverse) || (!isSente && !koma.isReverse)) {
                koma.reverse();
            }

            if (0 < x && 0 < y) {
                if (dai.has(koma)) {
                    dai.remove(koma);
                }
                if (nari == null) {
                    //DO NOTING
                } else if ((nari && !koma.isNari) || (!nari && koma.isNari)) {
                    koma.flip();
                }
                //apply to view
                this.board.moveKoma(koma, x, y);
            } else {
                this.board.removeKoma(koma);
                dai.put(koma);
                if (koma.isNari) {
                    koma.flip();
                }
            }
        }

    });
})();