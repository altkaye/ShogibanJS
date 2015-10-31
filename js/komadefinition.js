(function() {
    window.sb = window.sb || {};

    sb.getDefaultKomaParam = function() {
        return {
            width: 30,
            height: 30,
            backgroundColor: "transparent"
        };
    }
})();
(function() {
    phina.define("sb.koma.Hu", {
        superClass: "sb.Koma",

        init: function(param) {
            param = param || sb.getDefaultKomaParam();
            param.name = "歩";
            param.nari = "と";
            this.superInit(param);
        }
    });
})();
(function() {
    phina.define("sb.koma.Kyo", {
        superClass: "sb.Koma",

        init: function(param) {
            param = param || sb.getDefaultKomaParam();
            param.name = "香";
            param.nari = "杏";
            this.superInit(param);
        }
    });
})();
(function() {
    phina.define("sb.koma.Kei", {
        superClass: "sb.Koma",

        init: function(param) {
            param = param || sb.getDefaultKomaParam();
            param.name = "桂";
            param.nari = "圭";
            this.superInit(param);
        }
    });
})();
(function() {
    phina.define("sb.koma.Gin", {
        superClass: "sb.Koma",

        init: function(param) {
            param = param || sb.getDefaultKomaParam();
            param.name = "銀";
            param.nari = "全";
            this.superInit(param);
        }
    });
})();
(function() {
    phina.define("sb.koma.Kin", {
        superClass: "sb.Koma",

        init: function(param) {
            param = param || sb.getDefaultKomaParam();
            param.name = "金";
            this.superInit(param);
        }
    });
})();
(function() {
    phina.define("sb.koma.Kaku", {
        superClass: "sb.Koma",

        init: function(param) {
            param = param || sb.getDefaultKomaParam();
            param.name = "角";
            param.nari = "馬";
            this.superInit(param);
        }
    });
})();
(function() {
    phina.define("sb.koma.Hisha", {
        superClass: "sb.Koma",

        init: function(param) {
            param = param || sb.getDefaultKomaParam();
            param.name = "飛";
            param.nari = "龍";
            this.superInit(param);
        }
    });
})();
(function() {
    phina.define("sb.koma.Gyoku", {
        superClass: "sb.Koma",

        init: function(param) {
            param = param || sb.getDefaultKomaParam();
            param.name = "玉";
            this.superInit(param);
        }
    });
})();