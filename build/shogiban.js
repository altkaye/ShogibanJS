(function() {
    phina.define("sb.ShogiBoard", {
        superClass: "phina.display.Shape",
        boardLayout: null,

        paddingX: 0,
        paddingY: 0,

        komaPaddingX: 0,
        komaPaddingY: 0,

        komas:null,

        init: function(param) {
            this.superInit(param);
            this.paddingX = param.paddingX || 8;
            this.paddingY = param.paddingY || 8;
            this.komaPaddingX = param.komaPaddingX || 4;
            this.komaPaddingY = param.komaPaddingY || 4;

            this.komas = {};
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

        localPositionToKifPosition:function(position) {
            var unceilX = (position.x + this.boardLayout.width / 2) / this.boardLayout.getWidthOf(1);
            var unceilY = (position.y + this.boardLayout.height / 2) / this.boardLayout.getHeightOf(1);

            var kx = 10 - Math.ceil(unceilX);
            var ky = Math.ceil(unceilY);
            return phina.geom.Vector2(kx, ky);
        },

        removeAll:function() {
            for (var prop in this.komas) {
                this.removeKoma(this.komas[prop]);
            }
        },

        moveKoma:function(koma, kx, ky) {
            this.removeKoma(koma);
            this.putKoma(koma, kx, ky);
        },

        popupKoma:function(koma) {
            var kp = this.localPositionToKifPosition(koma.position);
            this.moveKoma(koma, kp.x, kp.y);
        },

        toJSONArray:function() {
            var ret = [];
            for (var prop in this.komas) {
                var koma = this.komas[prop].toJSON();
                var kp = this.propToKp(prop);

                koma.kx = kp.x;
                koma.ky = kp.y;

                var op = this.boardLayout.getPositionFromKp(kp.x, kp.y);
                koma.dx = (op.x - this.komas[prop].position.x) / this.boardLayout.width;
                koma.dy = (op.y - this.komas[prop].position.y) / this.boardLayout.height;

                ret.push(koma);
             }
             return ret;
        },

        getKomaAt:function(kx, ky) {
            return this.komas[kx + "," + ky];
        },

        propToKp:function(prop) {
            var s = prop.split(",");
            return phina.geom.Vector2(Number(s[0]), Number(s[1]));
        },

        putKoma: function(koma, kx, ky) {
            this.komas[kx + "," + ky] = koma;
            this.boardLayout.addChildByKifPoistion(koma, kx, ky);
        },

        removeKoma: function(koma) {
            for (var prop in this.komas) {
                if (this.komas[prop] === koma) {
                    delete this.komas[prop]
                    break;
                }
            }
            this.boardLayout.removeChild(koma);
        }
    });
})();

(function() {
    phina.define("sb.ShogiBoardLayout", {
        superClass: "putil.layout.GridLayout",

        init: function(width, height, column, row) {
            var param = {
                width: width,
                height: height,
                backgroundColor: "#F3E2A9",
                fill: "green",
                stroke: "#886A08",
                strokeWidth: 2
            };
            column = column || 9;
            row = row || 9;
            this.superInit(param, column, row);
        },

        getPositionFromKp:function(kx, ky) {
            return this.getPositionAt(this.column + 1 - kx, ky);
        },

        addChildByKifPoistion:function(koma, kx, ky) {
            this.addChildInLayout(koma, this.column + 1 - kx, ky);
        },

        _render: function() {
            this._renderBackground();
            this.canvas.transformCenter();
            this.canvas.strokeStyle = this.stroke;
            this.canvas.context.lineWidth = this.strokeWidth;
            var xb = -this.width / 2;
            var yb = -this.height / 2;

            // column line
            for (var i = 0; i < this.column + 1; i++) {
                this.canvas.drawLine(
                    i * this.getWidthOf(1) + xb, yb,
                    i * this.getWidthOf(1) + xb, yb + this.height);
            }
            //row line
            for (var i = 0; i < this.row + 1; i++) {
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
                var senteHu = sb.koma.Hu(board.buildKomaInitParam());
                var goteHu = sb.koma.Hu(board.buildKomaInitParam()).reverse();
                board.putKoma(goteHu, i, 3);
                board.putKoma(senteHu, i, 7);
                ret.push(senteHu);
                ret.push(goteHu);
            }
            //kaku
            var senteKaku = sb.koma.Kaku(board.buildKomaInitParam());
            board.putKoma(senteKaku, 8, 8);
            ret.push(senteKaku);
            var goteKaku = sb.koma.Kaku(board.buildKomaInitParam()).reverse();
            board.putKoma(goteKaku, 2, 2);
            ret.push(goteKaku);
            //hisha
            var senteHisha = sb.koma.Hisha(board.buildKomaInitParam());
            board.putKoma(senteHisha, 2, 8);
            ret.push(senteHisha);
            var goteHisha = sb.koma.Hisha(board.buildKomaInitParam()).reverse();
            board.putKoma(goteHisha, 8, 2);
            ret.push(goteHisha);

            for (var i = 0; i < 2; i++) {
                //kyo
                var senteKyo = sb.koma.Kyo(board.buildKomaInitParam());
                var goteKyo = sb.koma.Kyo(board.buildKomaInitParam()).reverse();
                ret.push(senteKyo);
                ret.push(goteKyo);
                board.putKoma(senteKyo, 9 - 8 * i, 9);
                board.putKoma(goteKyo, 9 - 8 * i, 1);
                //kei
                var senteKei = sb.koma.Kei(board.buildKomaInitParam());
                var goteKei = sb.koma.Kei(board.buildKomaInitParam()).reverse();
                ret.push(senteKei);
                ret.push(goteKei);
                board.putKoma(senteKei, 8 - 6 * i, 9);
                board.putKoma(goteKei, 8 - 6 * i, 1);
                //gin
                var senteGin = sb.koma.Gin(board.buildKomaInitParam());
                var goteGin = sb.koma.Gin(board.buildKomaInitParam()).reverse();
                ret.push(senteGin);
                ret.push(goteGin);
                board.putKoma(senteGin, 7 - 4 * i, 9);
                board.putKoma(goteGin, 7 - 4 * i, 1);
                //kin
                var senteKin = sb.koma.Kin(board.buildKomaInitParam());
                var goteKin = sb.koma.Kin(board.buildKomaInitParam()).reverse();
                ret.push(senteKin);
                ret.push(goteKin);
                board.putKoma(senteKin, 6 - 2 * i, 9);
                board.putKoma(goteKin, 6 - 2 * i, 1);

            }

            var senteGyoku = sb.koma.Gyoku(board.buildKomaInitParam());
            var goteGyoku = sb.koma.Gyoku(board.buildKomaInitParam()).reverse();
            board.putKoma(senteGyoku, 5, 9);
            board.putKoma(goteGyoku, 5, 1);
            ret.push(senteGyoku);
            ret.push(goteGyoku);

            return ret;
        }
    };
})();
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
(function() {
    phina.define("sb.Koma", {
        superClass: "phina.display.Shape",
        komaShape: null,

        reverseLabel:true,
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
            this.reverseLabel = param.reverseLabel || true;

            var labelParam = {
                text: this.name,
                fontSize: this.width * 0.6,
                strokeWidth: 0.4
            };
            this.label = phina.display.Label(labelParam).addChildTo(this);
        },

        toJSON:function() {
            var ret = {
                className:this.className,
                isNari:this.isNari,
                isReverse:this.isReverse
            };
            return ret;
        },

        getCurrentName:function() {
            return !this.isNari ? this.name : this.nariName;
        },

        haveNari: function() {
            return nari !== null;
        },

        reverse: function() {
            this.isReverse = !this.isReverse;
            this.komaShape.rotation = this.isReverse ? 180 : 0;
            this.label.rotation = this.isReverse && this.reverseLabel ? 180 : 0;
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
        superClass: 'putil.accessory.DoubleTap',
        boardController: null,

        init: function(target, boardController, board) {
            this.superInit(target);
            this.boardController = boardController;
            this.board = board || this.boardController.board;
        },

        ondragstart: function() {
            sb.log(this.target.name + " drag start");
            this.board.popupKoma(this.target);
        },

        ondrag: function() {

        },

        ondoubletap:function() {
            this.target.flip();
        },

        ondragend: function() {
            //sb.log(this.target.name + " drag end");
            //sb.log(this.target.position)
            var kp = this.boardController.localPositionToKifPosition(this.target.position);
            if (putil.math.isIn(kp.x, 1, 9) && putil.math.isIn(kp.y, 1, 9)) {//TODO do not write 1, 9 directly
                if (this.boardController.isGoho(this.target, this.target.isReverse, kp.x, kp.y, false)) {
                    this.boardController.nextFromKomaObject(this.target);
                } else {
                    //sb.log("cant do dat");
                    this.back();
                }
            } else {
                //sb.log("out of board");
                this.back();
            }
        }

    });
})();
(function() {
    phina.define("sb.Komadai", {
        komas: null,

        init: function() {
            this.komas = [];
        },

        testHitElement: function() {
            return false; //TODO temp
        },
        has: function(koma) {
            return this.komas.indexOf(koma) >= 0;
        },

        put: function(koma) {
            return this.komas.push(koma);
        },

        removeAll:function() {
            for (var i = 0; i < this.komas; i++) {
                this.remove(komas[i]);
            }
        },

        toJSONArray: function() {
            var ret = [];
            for (var prop in this.komas) {
                var koma = this.komas[prop].toJSON();
                var kp = this.propToKp(prop);

                koma.kx = kp.x;
                koma.ky = kp.y;

                //var op = this.boardLayout.getPositionFromKp(kp.x, kp.y);
                //koma.dx = (op.x - koma.position.x) / this.boardLayout.width;
                //koma.dy = (op.y - koma.position.y) / this.boardLayout.height;

                ret.push(koma);
            }
            return ret;
        },

        remove: function(koma) {
            return this.komas.splice(this.komas.indexOf(koma), 1);
        }
    });
})();
(function() {
    window.sb = window.sb || {};

    sb.getDefaultKomaParam = function() {
        return {
            width: 30,
            height: 30,
            backgroundColor: "transparent"
        };
    }
})();
(function() {
    phina.define("sb.koma.Hu", {
        superClass: "sb.Koma",

        init: function(param) {
            param = param || sb.getDefaultKomaParam();
            param.name = "歩";
            param.nari = "と";
            this.superInit(param);
        }
    });
})();
(function() {
    phina.define("sb.koma.Kyo", {
        superClass: "sb.Koma",

        init: function(param) {
            param = param || sb.getDefaultKomaParam();
            param.name = "香";
            param.nari = "杏";
            this.superInit(param);
        }
    });
})();
(function() {
    phina.define("sb.koma.Kei", {
        superClass: "sb.Koma",

        init: function(param) {
            param = param || sb.getDefaultKomaParam();
            param.name = "桂";
            param.nari = "圭";
            this.superInit(param);
        }
    });
})();
(function() {
    phina.define("sb.koma.Gin", {
        superClass: "sb.Koma",

        init: function(param) {
            param = param || sb.getDefaultKomaParam();
            param.name = "銀";
            param.nari = "全";
            this.superInit(param);
        }
    });
})();
(function() {
    phina.define("sb.koma.Kin", {
        superClass: "sb.Koma",

        init: function(param) {
            param = param || sb.getDefaultKomaParam();
            param.name = "金";
            this.superInit(param);
        }
    });
})();
(function() {
    phina.define("sb.koma.Kaku", {
        superClass: "sb.Koma",

        init: function(param) {
            param = param || sb.getDefaultKomaParam();
            param.name = "角";
            param.nari = "馬";
            this.superInit(param);
        }
    });
})();
(function() {
    phina.define("sb.koma.Hisha", {
        superClass: "sb.Koma",

        init: function(param) {
            param = param || sb.getDefaultKomaParam();
            param.name = "飛";
            param.nari = "龍";
            this.superInit(param);
        }
    });
})();
(function() {
    phina.define("sb.koma.Gyoku", {
        superClass: "sb.Koma",

        init: function(param) {
            param = param || sb.getDefaultKomaParam();
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
(function() {
    window.sb = window.sb || {};

    window.sb.JSONConverter = {
        toJSON: function(board, sente, gote) {
            var json = {};
            json.board = board.toJSONArray();
            json.komadai = {};
            json.komadai.sente = sente.toJSONArray();
            json.komadai.gote = gote.toJSONArray();
            return json;
        },

        JSONToBoard: function(json, board) {
            var ret = [];
            var komas = json.board;
            komas.forEach(function(j) {
                var param = board.buildKomaInitParam();
                var ns = j.className.split(".");
                var initializer = window;
                ns.forEach(function(token) {
                    if (initializer[token] != null) {
                        initializer = initializer[token];
                    }
                });
                if (initializer !== window && typeof(initializer) === "function") {
                    var koma = initializer(param);
                    board.putKoma(koma, j.kx, j.ky);
                    if (j.isNari) {
                        koma.flip();
                    }
                    if (j.isReverse) {
                        koma.reverse();
                    }
                    ret.push(koma);
                }
            });

            return ret;
        }
    };
})();
(function() {
    phina.define("sb.scene.PlainBoardScene", {
        superClass: "phina.display.CanvasScene",
        layout: null,
        board: null,
        komadais: null,
        isEditable: null,
        shogiController: null,

        init: function(param) {
            this.superInit(param);
            var lp = {
                width: param.width,
                height: param.height,
                backgroundColor: param.bgcolor || "#F0FFFF"
            };
            this.isEditable = param.isEditable;

            this.layout = putil.layout.GridLayout(lp, 5, 3);
            this.layout.addChildTo(this);
            this.layout.setPosition(this.gridX.center(), this.gridY.center());
            //this.layout._debug_displayGrid();

            var boardParam = {
                width: this.layout.getWidthOf(3),
                height: this.layout.getHeightOf(3),
                backgroundColor: "transparent"
            };

            this.board = sb.ShogiBoard(boardParam);
            this.komadais = {};
            this.komadais.sente = sb.Komadai();
            this.komadais.gote = sb.Komadai();
            this.layout.addChildInLayout(this.board, 3, 2);
            this.shogiController = sb.ShogiController(this.board, this.board, this.komadais).attachTo(this.board);

            this.initHirateGame();

            this._json = this.toJSON();
        },

        flush: function() {
            this.board.removeAll();
            this.komadais.sente.removeAll();
            this.komadais.gote.removeAll();
        },

        initHirateGame: function() {
            this.flush();
            //puttin
            var komaList = sb.BoardInitializer.hirate(this.board);
            if (this.isEditable) {
                var self = this;
                komaList.forEach(function(koma) {
                    sb.KomaDragController(koma, self.shogiController).attachTo(koma);
                });
            }
        },

        update: function(app) {
            //TODO test code
            if (app.keyboard.getKey("ctrl")) {
                if (app.keyboard.getKeyDown("c")) {
                    this.backup();
                }
            }
            /**
                if (app.keyboard.getKeyDown("v")) {
                    this.initFromJSON(this._json);
                    this.flare("paste");
                }
            }
            **/
        },

        backup: function() {
            this._json = this.toJSON();
            this.flare("backup", {
                json: this._json
            }); //TODO create accessory
        },

        initFromJSON: function(json) {
            this.flush();

            var komaList = sb.JSONConverter.JSONToBoard(json, this.board);
            if (this.isEditable) {
                var self = this;
                komaList.forEach(function(koma) {
                    sb.KomaDragController(koma, self.shogiController).attachTo(koma);
                });
            }
        },

        toJSON: function() {
            return sb.JSONConverter.toJSON(this.board, this.komadais.sente, this.komadais.gote);
        }
    });
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
    putil.math.isIn = function(origin, min, max) {
        return origin >= min && origin <= max;
    }
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

        isSenteNow:true,

        init:function(root, board, komadai) {
            this.superInit(root);
            this.board = board || root;
            this.board.setInteractive(true, "rect");
            this.komadai = komadai || {
                sente:sb.Komadai(),
                gote:sb.Komadai()
            };
            this.isSenteNow = true;
        },

        setKomasOnKomadai:function(komaList) {
            var self = this;
            komaList.forEach(function(v) {
                var dai = !v.reverse ? self.komadai.sente : self.komadai.gote;
                dai.put(v);
            });
        },

        isGoho:function(koma, senteOrGote, kx, ky, nari) {
            if (!koma.nari && nari) {
                return false;
            }
            var kp = this.board.localPositionToKifPosition(koma);

            kx = kx || kp.x;
            ky = ky || kp.y;

            var dstKoma = this.board.getKomaAt(kx, ky);
            if (!dstKoma) {
                return true;
            }
            return false;//TODO
        },

        nextFromKomaObject:function(koma, sente, nari) {
            var kp = this.localPositionToKifPosition(koma.position);
            sente = sente || !koma.isReverse;
            nari = nari || koma.isNari;
            this.next(koma, this.isSente(sente), kp.x, kp.y, nari);
        },

        localPositionToKifPosition:function(position) {
            return this.board.localPositionToKifPosition(position);
        },

        isHitKomadai:function(koma) {
            return this.komadai.testHitElement(koma);//TODO komadai.testHitElm is not implemented
        },

        putKomaOnBoard:function(koma, kx, ky) {
            this.board.putKoma(koma, kx, ky);
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

        next:function(koma, senteOrGote, kx, ky, nari) {
            var isSente = this.isSente(senteOrGote);
            var dai = isSente ? this.komadai.sente : this.komadai.gote;

            if ((isSente && koma.isReverse) || (!isSente && !koma.isReverse)) {
                koma.reverse();
            }

            if (0 < kx && 0 < ky) {
                if (dai.has(koma)) {
                    dai.remove(koma);
                }
                if (nari == null) {
                    //DO NOTING
                } else if ((nari && !koma.isNari) || (!nari && koma.isNari)) {
                    koma.flip();
                }
                //apply to view
                this.board.moveKoma(koma, kx, ky);
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