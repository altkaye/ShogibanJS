(function() {
    phina.define("sb.ShogiBoard", {
        superClass:"phina.display.Shape",
        boardLayout:null,

        init:function(param) {
            this.superInit(param);
            this.boardLayout = sb.ShogiBoardLayout(this.width, this.height);
            this.boardLayout.addChildTo(this);
            //console.log(this.boardLayout.position);
            //this.boardLayout.setPosition(0, 0);
            //this.boardLayout._debug_displayGrid();
        }
    });
})();

(function() {
    phina.define("sb.ShogiBoardLayout", {
        superClass:"putil.layout.GridLayout",

        init:function(width, height) {
            var param = {
                width:width,
                height:height,
                backgroundColor:"yellow",
                fill:"green",
                stroke:"blue",
                strokeWidth:8
            };
            this.superInit(param, 9, 9);
            //this.buildCanvas();
        },

        draw:function(canvas) {
            canvas.strokeStyle = "black";
            canvas.context.fillStyle = "wheal";
            //canvas.fillRect(- this.width / 2, - this.height / 2, this.width, this.height);
            //column line
            //this.canvas.transformCenter();
            //canvas.drawPoint(0,0);
            var xb = -this.width/2;
            var yb = -this.height/2;
           // return;
            for (var i = 0; i < 10; i++) {
                canvas.drawLine(
                    i * this.getWidthOf(1) + xb, yb,
                    i * this.getWidthOf(1) + xb, yb +this.height);
            }
            //row line
            for (var i = 0; i < 10; i++) {
                canvas.drawLine(
                    xb, yb + i * this.getHeightOf(1),
                    xb + this.width, yb + i * this.getHeightOf(1));
            }
        }
    });
})();