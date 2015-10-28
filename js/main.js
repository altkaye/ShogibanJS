(function() {
    console.log("hello world!");
    var sb = {};
    window.sb = sb;

    sb.DEFAULT_GRID_SIZE = 100;
    sb.DEFAULT_WIDTH = sb.DEFAULT_GRID_SIZE * 5;
    sb.DEFAULT_HEIHGT = sb.DEFAULT_GRID_SIZE * 4;
    sb.TAG = 'sho-giban';

    //prepare <sho-giban>
    sb.Shogiban = document.registerElement(sb.TAG, {
        prototype: Object.create(HTMLElement.prototype, {
            createdCallback: {
                value: function() {
                    var canvas = document.createElement("canvas");
                    canvas.width = this.getAttribute("width") || sb.DEFAULT_WIDTH;
                    canvas.height = this.getAttribute("height") || sb.DEFAULT_HEIHGT;
                    this.appendChild(canvas);
                    this.canvas = canvas;
                }
            }
        })
    });

    var shogibanMain = function() {
        //get all sho-giban elements and bind phina
        var shogibans = document.getElementsByTagName("sho-giban");
        for (var i = 0; i < shogibans.length; i++) {
            (function(dom) {
                var param = {
                    width: dom.canvas.width,
                    height: dom.canvas.height,
                    domElement: dom.canvas,
                    fit: false
                };
                var app = phina.display.CanvasApp(param);
                var scene = sb.scene.ReplayScene(param);

                app.replaceScene(scene);
                app.run();
            })(shogibans[i]);
        }
    };

    phina.main(shogibanMain);
})();