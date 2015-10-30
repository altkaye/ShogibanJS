(function() {
    // TODO find better way
    phina.define("putil.accessory.DoubleTap", {
        superClass:'phina.accessory.Draggable',
        lastClickedTime:null,
        thresholdTime:0,

        init:function(param, thresholdTime) {
            this.superInit(param);
            this.thresholdTime = thresholdTime || 500;//500ms is default of windows
            var self = this;
            this.target.on("pointstart", function() {

                var now = (new Date()).getTime();

                if (self.lastClickedTime == null) {
                    self.lastClickedTime = now;
                } else if (now - self.lastClickedTime < self.thresholdTime) {
                    self.flare("doubletap");
                    self.lastClickedTime = null;
                } else {
                    self.lastClickedTime = now;
                }
            });
        }
    });
})();