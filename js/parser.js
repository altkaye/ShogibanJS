(function() {
    window.sb = window.sb || {};

    window.sb.JSONConverter = {
        toJSON: function(board, sente, gote) {
            var json = {};
            json.board = board.toJSONArray();
            json.komadai = {};
            json.komadai.sente = sente.toJSONArray();
            json.komadai.gote = gote.toJSONArray();
            return json;
        },

        JSONToBoard: function(json, board) {
            var ret = [];
            var komas = json.board;
            komas.forEach(function(j) {
                var param = board.buildKomaInitParam();
                var ns = j.className.split(".");
                var initializer = window;
                ns.forEach(function(token) {
                    if (initializer[token] != null) {
                        initializer = initializer[token];
                    }
                });
                if (initializer !== window && typeof(initializer) === "function") {
                    var koma = initializer(param);
                    board.putKoma(koma, j.kx, j.ky);
                    if (j.isNari) {
                        koma.flip();
                    }
                    if (j.isReverse) {
                        koma.reverse();
                    }
                    ret.push(koma);
                }
            });

            return ret;
        }
    };
})();