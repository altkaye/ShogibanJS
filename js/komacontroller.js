(function() {
    phina.define("sb.KomaDragController", {
        superClass: 'phina.accessory.Draggable',
        board:null,

        init:function(target, board) {
            this.superInit(target, board);
            //TODO
        },

        ondragstart:function() {
            console.log(this.target.name + " drag start");
        },

        ondrag:function() {

        },

        ondragend:function() {
            console.log(this.target.name + " drag end");
            this.back();
        }

    });
})();