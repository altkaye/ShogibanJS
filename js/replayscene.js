(function() {
    phina.define("sb.scene.ReplayScene", {
        superClass:"phina.display.CanvasScene",
        layout:null,

        init:function(param) {
            this.superInit(param);
            this.layout = putil.layout.GridLayout(param, 5, 4);
            this.layout.addChildTo(this);
            this.layout._debug_displayGrid();
        }
    });
})();