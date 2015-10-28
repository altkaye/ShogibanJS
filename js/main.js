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
                }
            }
        })
    });
})();