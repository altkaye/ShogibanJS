(function() {
    phina.define("sb.Komadai", {
        komas:null,

        init:function() {
            this.komas = [];
        },

        has:function(koma) {
            return this.komas.indexOf(koma) >= 0;
        },

        put:function(koma) {
            return this.komas.push(koma);
        },

        remove:function(koma) {
            return this.komas.splice(this.komas.indexOf(koma), 1);
        }
    });
})();