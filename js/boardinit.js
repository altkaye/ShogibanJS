(function() {
    window.sb = window.sb || {};
    window.sb.BoardInitializer = {
        hirate: function(board) {
            var ret = [];
            //hu
            for (var i = 1; i <= 9; i++) {
                var senteHu = sb.Hu(board.buildKomaInitParam());
                var goteHu = sb.Hu(board.buildKomaInitParam()).reverse();
                board.putKoma(goteHu, i, 3);
                board.putKoma(senteHu, i, 7);
                ret.push(senteHu);
                ret.push(goteHu);
            }
            //kaku
            var senteKaku = sb.Kaku(board.buildKomaInitParam());
            board.putKoma(senteKaku, 8, 8);
            ret.push(senteKaku);
            var goteKaku = sb.Kaku(board.buildKomaInitParam()).reverse();
            board.putKoma(goteKaku, 2, 2);
            ret.push(goteKaku);
            //hisha
            var senteHisha = sb.Hisha(board.buildKomaInitParam());
            board.putKoma(senteHisha, 2, 8);
            ret.push(senteHisha);
            var goteHisha = sb.Hisha(board.buildKomaInitParam()).reverse();
            board.putKoma(goteHisha, 8, 2);
            ret.push(goteHisha);

            for (var i = 0; i < 2; i++) {
                //kyo
                var senteKyo = sb.Kyo(board.buildKomaInitParam());
                var goteKyo = sb.Kyo(board.buildKomaInitParam()).reverse();
                ret.push(senteKyo);
                ret.push(goteKyo);
                board.putKoma(senteKyo, 9 - 8 * i, 9);
                board.putKoma(goteKyo, 9 - 8 * i, 1);
                //kei
                var senteKei = sb.Kei(board.buildKomaInitParam());
                var goteKei = sb.Kei(board.buildKomaInitParam()).reverse();
                ret.push(senteKei);
                ret.push(goteKei);
                board.putKoma(senteKei, 8 - 6 * i, 9);
                board.putKoma(goteKei, 8 - 6 * i, 1);
                //gin
                var senteGin = sb.Gin(board.buildKomaInitParam());
                var goteGin = sb.Gin(board.buildKomaInitParam()).reverse();
                ret.push(senteGin);
                ret.push(goteGin);
                board.putKoma(senteGin, 7 - 4 * i, 9);
                board.putKoma(goteGin, 7 - 4 * i, 1);
                //kin
                var senteKin = sb.Kin(board.buildKomaInitParam());
                var goteKin = sb.Kin(board.buildKomaInitParam()).reverse();
                ret.push(senteKin);
                ret.push(goteKin);
                board.putKoma(senteKin, 6 - 2 * i, 9);
                board.putKoma(goteKin, 6 - 2 * i, 1);

            }

            var senteGyoku = sb.Gyoku(board.buildKomaInitParam());
            var goteGyoku = sb.Gyoku(board.buildKomaInitParam()).reverse();
            board.putKoma(senteGyoku, 5, 9);
            board.putKoma(goteGyoku, 5, 1);
            ret.push(senteGyoku);
            ret.push(goteGyoku);

            return ret;
        }
    };
})();