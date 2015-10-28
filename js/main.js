(function() {
    console.log("hello world!");
    var sb = {};
    window.sb = sb;

    sb.TAG = 'sho-giban';

    sb.Shogiban = document.registerElement(sb.TAG, {
        prototype: Object.create(HTMLElement.prototype, {
            createdCallback: {
                value: function() {
                    this.innerHTML = "<span>sho-giban</span>";

                    this.style.backgroundColor = "#393";
                    var canvas = document.createElement("canvas");
                    this.appendChild(canvas);
                    var ctx = canvas.getContext("2d");
                    ctx.fillText("foobar", 100, 100);

                    this.canvas = canvas;
                }
            }
        })
    });

    phina.main(function() {
        var shogibans = document.getElementsByTagName("sho-giban");
        for (var i = 0; i < shogibans.length; i++) {
            (function(dom) {
                var param = {
                    width:dom.getAttribute("width") || 300,
                    height:dom.getAttribute("height") || 300,
                    domElement:dom.canvas,
                    fit:false
                };
                var app = phina.display.CanvasApp(param);
                app.run();
                phina.display.StarShape().addChildTo(app.currentScene);
            })(shogibans[i]);
        }
    });
})();