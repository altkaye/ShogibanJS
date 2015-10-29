(function() {
    phina.define("sb.ShogiBoard", {
        superClass: "phina.display.Shape",
        boardLayout: null,

        paddingX: 0,
        paddingY: 0,

        komaPaddingX: 0,
        komaPaddingY: 0,

        init: function(param) {
            this.superInit(param);
            this.paddingX = param.paddingX || 8;
            this.paddingY = param.paddingY || 8;
            this.komaPaddingX = param.komaPaddingX || 4;
            this.komaPaddingY = param.komaPaddingY || 4;


            this.boardLayout = sb.ShogiBoardLayout(this.width - this.paddingX * 2, this.height - this.paddingY * 2);
            this.boardLayout.addChildTo(this);
        },

        buildKomaInitParam: function() {
            return {
                width: this.boardLayout.getWidthOf(1) - this.komaPaddingX * 2,
                height: this.boardLayout.getHeightOf(1) - this.komaPaddingY * 2,
                backgroundColor: "transparent"
            };
        },

        localPositionToKif:function(position) {
            var unceilX = (position.x + this.boardLayout.width / 2) / this.boardLayout.getWidthOf(1);
            var unceilY = (position.y + this.boardLayout.height / 2) / this.boardLayout.getHeightOf(1);

            var x = 10 - putil.math.range(Math.ceil(unceilX), 1, 9);
            var y = putil.math.range(Math.ceil(unceilY), 1, 9);
            return phina.geom.Vector2(x, y);
        },

        moveKoma:function(koma, x, y) {
            this.removeKoma(koma);
            this.putKoma(koma, x, y);
        },

        putKoma: function(koma, x, y) {
            this.boardLayout.addChildInLayout(koma, 10 - x, y);
        },

        removeKoma: function(koma) {
            this.boardLayout.removeChild(koma);
        }
    });
})();

(function() {
    phina.define("sb.ShogiBoardLayout", {
        superClass: "putil.layout.GridLayout",

        init: function(width, height) {
            var param = {
                width: width,
                height: height,
                backgroundColor: "#F3E2A9",
                fill: "green",
                stroke: "#886A08",
                strokeWidth: 2
            };
            this.superInit(param, 9, 9);
        },

        _render: function() {
            this._renderBackground();
            this.canvas.transformCenter();
            this.canvas.strokeStyle = this.stroke;
            this.canvas.context.lineWidth = this.strokeWidth;
            var xb = -this.width / 2;
            var yb = -this.height / 2;

            // column line
            for (var i = 0; i < 10; i++) {
                this.canvas.drawLine(
                    i * this.getWidthOf(1) + xb, yb,
                    i * this.getWidthOf(1) + xb, yb + this.height);
            }
            //row line
            for (var i = 0; i < 10; i++) {
                this.canvas.drawLine(
                    xb, yb + i * this.getHeightOf(1),
                    xb + this.width, yb + i * this.getHeightOf(1));
            }
        }
    });
})();
(function() {
    window.sb = window.sb || {};
    window.sb.BoardInitializer = {
        hirate: function(board) {
            var ret = [];
            //hu
            for (var i = 1; i <= 9; i++) {
                var senteHu = sb.Hu(board.buildKomaInitParam());
                var goteHu = sb.Hu(board.buildKomaInitParam()).reverse();
                board.putKoma(goteHu, i, 3);
                board.putKoma(senteHu, i, 7);
                ret.push(senteHu);
                ret.push(goteHu);
            }
            //kaku
            var senteKaku = sb.Kaku(board.buildKomaInitParam());
            board.putKoma(senteKaku, 8, 8);
            ret.push(senteKaku);
            var goteKaku = sb.Kaku(board.buildKomaInitParam()).reverse();
            board.putKoma(goteKaku, 2, 2);
            ret.push(goteKaku);
            //hisha
            var senteHisha = sb.Hisha(board.buildKomaInitParam());
            board.putKoma(senteHisha, 2, 8);
            ret.push(senteHisha);
            var goteHisha = sb.Hisha(board.buildKomaInitParam()).reverse();
            board.putKoma(goteHisha, 8, 2);
            ret.push(goteHisha);

            for (var i = 0; i < 2; i++) {
                //kyo
                var senteKyo = sb.Kyo(board.buildKomaInitParam());
                var goteKyo = sb.Kyo(board.buildKomaInitParam()).reverse();
                ret.push(senteKyo);
                ret.push(goteKyo);
                board.putKoma(senteKyo, 9 - 8 * i, 9);
                board.putKoma(goteKyo, 9 - 8 * i, 1);
                //kei
                var senteKei = sb.Kei(board.buildKomaInitParam());
                var goteKei = sb.Kei(board.buildKomaInitParam()).reverse();
                ret.push(senteKei);
                ret.push(goteKei);
                board.putKoma(senteKei, 8 - 6 * i, 9);
                board.putKoma(goteKei, 8 - 6 * i, 1);
                //gin
                var senteGin = sb.Gin(board.buildKomaInitParam());
                var goteGin = sb.Gin(board.buildKomaInitParam()).reverse();
                ret.push(senteGin);
                ret.push(goteGin);
                board.putKoma(senteGin, 7 - 4 * i, 9);
                board.putKoma(goteGin, 7 - 4 * i, 1);
                //kin
                var senteKin = sb.Kin(board.buildKomaInitParam());
                var goteKin = sb.Kin(board.buildKomaInitParam()).reverse();
                ret.push(senteKin);
                ret.push(goteKin);
                board.putKoma(senteKin, 6 - 2 * i, 9);
                board.putKoma(goteKin, 6 - 2 * i, 1);

            }

            var senteGyoku = sb.Gyoku(board.buildKomaInitParam());
            var goteGyoku = sb.Gyoku(board.buildKomaInitParam()).reverse();
            board.putKoma(senteGyoku, 5, 9);
            board.putKoma(goteGyoku, 5, 1);
            ret.push(senteGyoku);
            ret.push(goteGyoku);

            return ret;
        }
    };
})();
(function() {
    phina.define("sb.Koma", {
        superClass: "phina.display.Shape",
        komaShape: null,

        label: null,

        name: null,
        nari: null,

        isNari: false,

        movement: null,

        isReverse: false,

        init: function(param, name, nariName) {
            this.superInit(param);
            this.komaShape = sb.KomaShape(param);
            this.komaShape.addChildTo(this);

            this.name = param.name || name;
            this.nari = param.nari || nariName;

            var labelParam = {
                text: this.name,
                fontSize: this.width * 0.6,
                strokeWidth: 1
            };
            this.label = phina.display.Label(labelParam).addChildTo(this);
        },

        haveNari: function() {
            return nari !== null;
        },

        reverse: function() {
            this.isReverse = !this.isReverse;
            this.komaShape.rotation = this.isReverse ? 180 : 0;
            return this;
        },

        flip: function() {
            if (!this.nari) {
                return;
            }
            this.isNari = !this.isNari;
            this.label.stroke = this.isNari ? "red" : "black";
            this.label.fill = this.isNari ? "red" : "black";
            this.label.text = this.isNari ? this.nari : this.name;
            return this;
        },

        registerMovement: function(dst, isNari) {
            var prop = isNari ? "nari" : "normal";
            this.movement[prop].push(dst);
        }
    })
})();


(function() {
    phina.define("sb.KomaShape", {
        superClass: "phina.display.Shape",

        init: function(param) {
            this.superInit(param);
            this.corner = param.corner || phina.geom.Vector2(this.width / 10, this.height / 5);
        },

        _render: function() {
            this._renderBackground();
            this.canvas.transformCenter();
            var xb = -this.width / 2;
            var yb = -this.height / 2;

            //bottom
            this.canvas.drawLine(
                0 + xb, this.height + yb,
                this.width + xb, this.height + yb
            );

            //left side
            this.canvas.drawLine(
                0 + xb, this.height + yb,
                this.corner.x + xb, this.corner.y + yb
            );
            this.canvas.drawLine(
                this.corner.x + xb, this.corner.y + yb,
                this.width / 2 + xb, 0 + yb
            );

            //right side
            this.canvas.drawLine(
                this.width + xb, this.height + yb,
                this.width - this.corner.x + xb, this.corner.y + yb
            );
            this.canvas.drawLine(
                this.width - this.corner.x + xb, this.corner.y + yb,
                this.width / 2 + xb, 0 + yb
            );


        }
    });
})();
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
(function() {
    phina.define("sb.Hu", {
        superClass: "sb.Koma",

        init: function(param) {
            param.name = "歩";
            param.nari = "と";
            this.superInit(param);
        }
    });
})();
(function() {
    phina.define("sb.Kyo", {
        superClass: "sb.Koma",

        init: function(param) {
            param.name = "香";
            param.nari = "杏";
            this.superInit(param);
        }
    });
})();
(function() {
    phina.define("sb.Kei", {
        superClass: "sb.Koma",

        init: function(param) {
            param.name = "桂";
            param.nari = "圭";
            this.superInit(param);
        }
    });
})();
(function() {
    phina.define("sb.Gin", {
        superClass: "sb.Koma",

        init: function(param) {
            param.name = "銀";
            param.nari = "全";
            this.superInit(param);
        }
    });
})();
(function() {
    phina.define("sb.Kin", {
        superClass: "sb.Koma",

        init: function(param) {
            param.name = "金";
            this.superInit(param);
        }
    });
})();
(function() {
    phina.define("sb.Kaku", {
        superClass: "sb.Koma",

        init: function(param) {
            param.name = "角";
            param.nari = "馬";
            this.superInit(param);
        }
    });
})();
(function() {
    phina.define("sb.Hisha", {
        superClass: "sb.Koma",

        init: function(param) {
            param.name = "飛";
            param.nari = "龍";
            this.superInit(param);
        }
    });
})();
(function() {
    phina.define("sb.Gyoku", {
        superClass: "sb.Koma",

        init: function(param) {
            param.name = "玉";
            this.superInit(param);
        }
    });
})();
(function() {
    phina.define("putil.layout.GridLayout", {
        superClass: "phina.display.Shape",
        column: 0,
        row: 0,
        width:0,
        height:0,

        init: function(param, column, row) {
            this.superInit(param);
            this.width = param.width;
            this.height = param.height;
            this.column = param.column || column || 1;
            this.row = param.row || row || 1;
        },

        addChildInLayout: function(child, x, y) {
            x = x || 1;
            y = y || 1;
            var p = this.getPositionAt(x, y);
            child.addChildTo(this);
            child.setPosition(p.x, p.y);
        },

        setPositionInLayout: function(target, x, y) {
            x = x || 1;
            y = y || 1;
            var p = this.getPositionAt(x, y);
            target.setPosition(p.x, p.y);
        },

        _debug_displayGrid: function() {

            for (var x = 1; x <= this.column; x++) {
                for (var y = 1; y <= this.row; y++) {
                    var rectangle = phina.display.RectangleShape({
                        width: this.getWidthOf(1),
                        height: this.getHeightOf(1)
                    });
                    var star = phina.display.StarShape();
                    this.addChildInLayout(rectangle, x, y);
                    this.addChildInLayout(star, x, y);
                }
            }
            return this;
        },

        getPositionAt: function(x, y) {
            var px = this.getWidthOf(x - 0.5) - this.width / 2;
            var py = this.getHeightOf(y - 0.5) - this.height / 2;
            return phina.geom.Vector2(px, py);
        },

        getWidthOf: function(span) {
            return span * (this.width / this.column);
        },

        getHeightOf: function(span) {
            return span * (this.height / this.row);
        }
    });
})();
(function() {
    console.log("hello world!");
    window.sb = window.sb || {};

    sb.DEFAULT_GRID_SIZE = 150;
    sb.DEFAULT_WIDTH = sb.DEFAULT_GRID_SIZE * 5;
    sb.DEFAULT_HEIHGT = sb.DEFAULT_GRID_SIZE * 4;
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
(function() {
    window.putil = window.putil || {};
    putil.cloneObject = function(obj) {
        var r = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var val = obj[key];
                if (typeof val == "object") r[key] = val.clone();
                else r[key] = val;
            }
        }
        r.__proto__ = obj.__proto__;
        return r;
    };
    putil.math = putil.math || {};
    putil.math.range = function(origin, min, max) {
        if (max != null && origin > max) {
            return max;
        } else if (min != null && origin < min) {
            return min;
        } else {
            return origin;
        }
    };
})();
(function() {
    phina.define("sb.scene.ReplayScene", {
        superClass: "phina.display.CanvasScene",
        layout: null,
        board: null,

        init: function(param) {
            this.superInit(param);
            var lp = {
                width:param.width,
                height:param.height,
                backgroundColor:"#F0FFFF"
            };
            this.layout = putil.layout.GridLayout(lp, 5, 4);
            this.layout.addChildTo(this);
            this.layout.setPosition(this.gridX.center(), this.gridY.center());
            //this.layout._debug_displayGrid();

            var boardParam = {
                width: this.layout.getWidthOf(3),
                height: this.layout.getHeightOf(3),
                backgroundColor: "transparent"
            };
            console.log(sb);
            this.board = sb.ShogiBoard(boardParam);
            this.layout.addChildInLayout(this.board, 3, 2);
            //put coma
            var komaList = sb.BoardInitializer.hirate(this.board);
            //init controller
            var shogiController = sb.ShogiController(this.board).attachTo(this.board);

            komaList.forEach(function(val) {
                sb.KomaDragController(val, shogiController).attachTo(val);
            });

            //phina.display.StarShape().addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
        }
    });
})();
(function() {
    phina.define("sb.ShogiController", {
        superClass:"phina.accessory.Accessory",
        board:null,
        komadai:null,

        init:function(root, board, komadai) {
            this.superInit(root);
            this.board = board || root;

            this.komadai = komadai || {
                sente:sb.Komadai(),
                gote:sb.Komadai()
            };
        },

        setKomasOnKomadai:function(komaList) {
            var self = this;
            komaList.forEach(function(v) {
                var dai = !v.reverse ? self.komadai.sente : self.komadai.gote;
                dai.put(v);
            });
        },

        nextFromKomaObject:function(koma, sente, nari) {
            var p = this.board.localPositionToKif(koma.position);
            sb.log(p);
            sente = sente || !koma.isReverse;
            nari = nari || koma.isNari;
            this.moveKoma(koma, sente, p.x, p.y, nari);
        },

        putKomaOnBoard:function(koma, x, y) {
            this.board.putKoma(koma, x, y);
        },

        isSente:function(expression) {
            var ret = expression;//return directly if expression is bool

            var sentePettern = [
                "sente", "Sente", "black", "Black", "▲", "▼", "+"
            ];
            var gotePattern = [
                "gote", "Gote", "white", "White", "△", "▽", "-"
            ];

            if (sentePettern.indexOf(expression) >= 0) {
                ret = true;
            }
            if (gotePattern.indexOf(expression) >= 0) {
                ret = false;
            }

            return ret;
        },

        moveKoma:function(koma, senteOrGote, x, y, nari) {
            var isSente = this.isSente(senteOrGote);
            var dai = isSente ? this.komadai.sente : this.komadai.gote;

            if ((isSente && koma.isReverse) || (!isSente && !koma.isReverse)) {
                koma.reverse();
            }

            if (0 < x && 0 < y) {
                if (dai.has(koma)) {
                    dai.remove(koma);
                }
                if (nari == null) {
                    //DO NOTING
                } else if ((nari && !koma.isNari) || (!nari && koma.isNari)) {
                    koma.flip();
                }
                //apply to view
                this.board.moveKoma(koma, x, y);
            } else {
                this.board.removeKoma(koma);
                dai.put(koma);
                if (koma.isNari) {
                    koma.flip();
                }
            }
        }

    });
})();