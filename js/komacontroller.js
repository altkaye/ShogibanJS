(function() {
    phina.define("sb.KomaDragController", {
        superClass: 'phina.accessory.Draggable',
        boardController:null,

        init:function(target, boardController) {
            this.superInit(target);
            this.boardController = boardController;
        },

        ondragstart:function() {
            sb.log(this.target.name + " drag start");
        },

        ondrag:function() {

        },

        ondragend:function() {
            sb.log(this.target.name + " drag end");
            sb.log(this.target.position)
            this.boardController.nextFromKomaObject(this.target);
            //this.back();
            //this.boardController.nextFromKomaController(this.target);
        }

    });
})();