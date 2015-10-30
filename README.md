*in early development.don't use this*

# ShogibanJS

Shogi board for modern browsers, made in Javascript.
legacy browsers and low spec pc? just throw it away.

# Usage

some sample in index.html.

[http://altkaye.github.io/ShogibanJS/](http://altkaye.github.io/ShogibanJS/)

# Depends on these Libraries

* phina.js
* webcomponents.js (polyfills)

# Coding rule

## Abbreviation

### kx, ky, kp

KifPositionX:int, KifPositionY:int, KifPosition:phina.geom.Vector2

KifPosition: coord of shogi

#### e.g. "1八"

kx = 1, ky = 8, kp = phina.geom.Vector2(1, 8)

### px, py, p

position.x:int, position.y:int, position:phina.geom.Vector2

coord of phina objects

# License

MIT ... at this point