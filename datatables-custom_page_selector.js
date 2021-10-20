/**
 * A DataTables feature plugin based on the answer found in:
 * https://www.datatables.net/forums/discussion/comment/174685/#Comment_174685
 */

$.fn.dataTable.CustomPageSelector = function(aTableSettings, aExtraSettings = {
    containerClasses: [],
    selectClasses: []
}) {
    let selectContainer = document.createElement("div");
    selectContainer.classList.add("data-tables-page-selector-container");

    if ("containerClasses" in aExtraSettings && aExtraSettings.containerClasses.length) {
        selectContainer.classList.add(...aExtraSettings.containerClasses);
    }

    let select = document.createElement("select");
    select.classList.add("data-tables-page-selector");

    if ("selectClasses" in aExtraSettings && aExtraSettings.selectClasses.length) {
        select.classList.add(...aExtraSettings.selectClasses);
    }

    // NOTE: In case that there are more than one table in a page, set the data-table-id attribute
    // with the ID of the table the select belongs to.
    select.setAttribute("data-table-id", aTableSettings.nTable.id);
    selectContainer.appendChild(select);

    select.addEventListener("change", (aE) => {
        window.scroll(0, 0);

        let val = aE.target.value;

        if (val === "" || val.match(/[^0-9]/)) {
            return;
        }

        let table = new $.fn.dataTable.Api(aTableSettings);
        table.page(parseInt(val, 10) - 1).draw(false); // false to remain on page.
    }, false);

    this.node = function() {
        return selectContainer;
    };

    // NOTE: If Bootstrap is used, initialize its tooltip.
    if ("bootstrap" in window && "Tooltip" in window.bootstrap) {
        const bsVersion = window.bootstrap.Tooltip.VERSION[0];
        select.setAttribute("data-bs-toggle", "tooltip");
        select.setAttribute("title", "Go to page");

        switch (bsVersion) {
            case "4":
                $(select).tooltip();
                break;
            case "5":
                window.bootstrap.Tooltip.getOrCreateInstance(select);
                break;
        }
    }
};

$.fn.DataTable.CustomPageSelector = $.fn.dataTable.CustomPageSelector;

// NOTE: I initialize the plugin when I initialize the table so I can use this plugin with
// any table and I don't have to hard-code CSS classes in the plug-in itself; I pass them at
// initialization time.
// Additionally, the external initialization allows to set a personalized feature name to be used
// in the table dom option.
// $.fn.dataTable.ext.feature.push({
//     fnInit: function(aTableSettings) {
//         let select = new $.fn.dataTable.CustomPageSelector(aTableSettings, {
//             containerClasses: [],
//             selectClasses: []
//         });
//         return select.node();
//     },
//     cFeature: "S"
// });
