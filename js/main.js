(function() {
    console.log("hello world!");
    window.sb = window.sb || {};

    sb.DEFAULT_GRID_SIZE = 100;
    sb.DEFAULT_WIDTH = sb.DEFAULT_GRID_SIZE * 5;
    sb.DEFAULT_HEIHGT = sb.DEFAULT_GRID_SIZE * 3;

    sb.BoardType = sb.BoardType || {};//TODO
    sb.BoardType.DEFAULT = "plain";//TODO

    sb.TAG = 'sho-giban';

    sb.log = (function(){
        if (!(console && console.log)) {
            return function() {};
        }

        if (!console.log.bind) {
            return function() {
                var a = Array.prototype.slice.call(arguments);
                    Function.prototype.apply.call(console.log, console, a);
                };
            }
        return console.log.bind(console);
    })();

    //wrapper
    sb.run = phina.main;

    var prevent = function(ev) {
        ev.preventDefault();
    };

    //prepare <sho-giban>
    sb.Shogiban = document.registerElement(sb.TAG, {
        prototype: Object.create(HTMLElement.prototype, {
            createdCallback: {
                value: function() {
                    //this.addEventListener("click", prevent);

                    var canvas = document.createElement("canvas");
                    //TODO create initializer
                    canvas.width = this.getAttribute("width") || sb.DEFAULT_WIDTH;
                    canvas.height = this.getAttribute("height") || sb.DEFAULT_HEIHGT;
                    this.appendChild(canvas);
                    this.canvas = canvas;
                    this.type = this.getAttribute("type") || sb.BoardType.DEFAULT;
                    this.editable = this.getAttribute("editable");
                    if (this.editable == null) {
                        this.editable = true;
                    }
                    this.bgcolor = this.getAttribute("bgcolor");
                    this.isPhinaBinded = false;
                }
            }
        })
    });

    var Build = function() {
        /** TEST CODE
        var hu = sb.koma.Hu();
        sb.log(hu.toString());
        sb.log(hu.constructor);
        sb.log(typeof hu)
        sb.log(hu instanceof sb.koma.Hu);
        sb.log("constname:" + hu.className);
        **/
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
                        fit: false,
                        bgcolor:null,
                        isEditable:dom.editable
                    };
                    var app = phina.display.CanvasApp(param);

                    //TODO: switch scene class by type dom.boardType
                    dom.scene = sb.scene.PlainBoardScene(param);

                    app.replaceScene(dom.scene);
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