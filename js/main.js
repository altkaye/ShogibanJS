(function() {
    console.log("hello world!");
    window.sb = window.sb || {};

    sb.DEFAULT_GRID_SIZE = 150;
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
                    this.isPhinaBinded = false;
                }
            }
        })
    });

    var Build = function() {
        //get all sho-giban elements and bind phina
        var shogibans = document.getElementsByTagName("sho-giban");
        for (var i = 0; i < shogibans.length; i++) {
            if (!shogibans[i].isPhinaBinded) {
                (function(dom) {
                    var param = {
                        width: dom.canvas.width,
                        height: dom.canvas.height,
                        domElement: dom.canvas,
                        backgroundColor: "transparent",
                        fit: false
                    };
                    var app = phina.display.CanvasApp(param);
                    var scene = sb.scene.ReplayScene(param);

                    app.replaceScene(scene);
                    app.run();
                    dom.isPhinaBinded = true;
                })(shogibans[i]);
            }
        }
    };

    sb.Build = sb.Build || Build;

    //entry point;
    phina.main(Build);
})();