(function() {
    window.sb = window.sb || {};
    window.sb.BoardInitializer = {
        hirate:function(board) {
            var ret = [];
            for (var i = 1; i <= 9; i++) {
                var hu1 = sb.Hu(board.buildKomaInitParam());
            }
            return ret;
        }
    };
})();