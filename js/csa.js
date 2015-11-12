(function() {
    phina.define("sb.CSA", {
        init: function(str) {
            this.parse(str);
        },

        parse: function(str) {
            var lines = str.split(/\r\n|\r|\n/);
            lines.forEach(this.parseLine);
        },

        parseLine: function(line) {
            if (this.isComment(line)) {
                return;
            }

            if (this.isVersion(line)) {
                this.applyVersion(line);
                return;
            }

            if (this.isKifInfo(line)) {
                this.applyKifInfo(line);
                return;
            }

            if (this.isInitBoard(line)) {
                this.applyInitBoard(line);
                break;
            }
        },

        isKifInfo: function(str) {
            return (str.lastIndexOf("$") === 0);
        },

        applyKifInfo: function(str) {
            var splitIndex = str.indexOf(":");

            var name = str.substr(0, splitIndex).substr(1);
            var value = str.substr(splitIndex);
            this[name] = value;
        },

        isComment: function(str) {
            return (str.lastIndexOf("'") === 0);
        },

        isVersion: function(str) {
            return (str.lastIndexOf("V") === 0);
        },

        applyVersion: function(str) {
            this.version = str.substr(1);
        },

        isInitBoard: function(str) {
            return (str.lastIndexOf("P") === 0);
        },

        applyInitBoard: function(str) {
            //TODO
        }
    });
})();