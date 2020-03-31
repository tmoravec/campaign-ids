const DEBUG = true;

function debug(str) {
    if (DEBUG) {
        console.log(str);
    }
}


/* Test data:

utm_source=1&utm_medium=2&utm_campaign=3&pk_campaign=4&piwik_campaign=5&pk_kwd=6&piwik_kwd=7&pk_keyword=8&utmTerm=9
?utm_source=1&utm_medium=2&utm_campaign=3&pk_campaign=4&piwik_campaign=5&pk_kwd=6&piwik_kwd=7&pk_keyword=8&utmTerm=9
https://www.example.com?utm_source=1&utm_medium=2&utm_campaign=3&pk_campaign=4&piwik_campaign=5&pk_kwd=6&piwik_kwd=7&pk_keyword=8&utmTerm=9
https://www.example.com/abcd?utm_source=1&utm_medium=2&utm_campaign=3&pk_campaign=4&piwik_campaign=5&pk_kwd=6&piwik_kwd=7&pk_keyword=8&utmTerm=9
https://www.example.com/abcd=efgh?utm_source=1&utm_medium=2&utm_campaign=3&pk_campaign=4&piwik_campaign=5&pk_kwd=6&piwik_kwd=7&pk_keyword=8&utmTerm=9

utmTerm=9&pk_keyword=8&piwik_kwd=7&pk_kwd=6&piwik_campaign=5&pk_campaign=4&utm_campaign=3&utm_medium=2&utm_source=1
?utmTerm=9&pk_keyword=8&piwik_kwd=7&pk_kwd=6&piwik_campaign=5&pk_campaign=4&utm_campaign=3&utm_medium=2&utm_source=1
https://www.example.com/abcd?utmTerm=9&pk_keyword=8&piwik_kwd=7&pk_kwd=6&piwik_campaign=5&pk_campaign=4&utm_campaign=3&utm_medium=2&utm_source=1
https://www.example.com/abcd=efgh?utmTerm=9&pk_keyword=8&piwik_kwd=7&pk_kwd=6&piwik_campaign=5&pk_campaign=4&utm_campaign=3&utm_medium=2&utm_source=1

fewofwiojfewji
fjewoiifijwae ofewajfo awejfawoifjwa=fjewiowe

 */

function generate(lines) {

    var campaign_ids = [];

    lines.forEach(function(L) {
        // Try to support both real URLs and only the query strings
        try {
            var url = new URL(L);
            var params = url.searchParams;
        } catch (TypeError) {
            var params = new URLSearchParams(L);
        }

        const utmSource = params.has("utm_source") ? params.get("utm_source") : "";
        const utmMedium = params.has("utm_medium") ? params.get("utm_medium") : "";
        const utmCampaign = params.has("utm_campaign") ? params.get("utm_campaign") : "";
        const pkCampaign = params.has("pk_campaign") ? params.get("pk_campaign") : "";
        const piwikCampaign = params.has("piwik_campaign") ? params.get("piwik_campaign") : "";
        const pkKwd = params.has("pk_kwd") ? params.get("pk_kwd") : "";
        const piwikKwd = params.has("piwik_kwd") ? params.get("piwik_kwd") : "";
        const pkKeyword = params.has("pk_keyword") ? params.get("pk_keyword") : "";
        const utmTerm = params.has("utmTerm") ? params.get("utmTerm") : "";
        var campaign = utmSource + utmMedium + utmCampaign + pkCampaign + piwikCampaign + pkKwd + piwikKwd + pkKeyword + utmTerm;
        const campaign_id = parseInt(md5(campaign).slice(-6), 16);
        debug("url: " + L + ", campaign: " + campaign + ", campaign_id: " + campaign_id);

        campaign_ids.push({url: L, campaign_id: campaign_id});
    });

    debug(campaign_ids);
    return campaign_ids;
}

function print_ids(campaign_ids) {
    var table = document.createElement("table");
    table.setAttribute("class", "table table-striped table-hover table-sm");

    // Create the header
    var thead = document.createElement("thead");
    var tr = document.createElement("tr");
    var th_url = document.createElement("th"); 
    th_url.appendChild(document.createTextNode("URL"));
    
    var th_id = document.createElement("th"); 
    th_id.appendChild(document.createTextNode("Campaign ID"));
    
    tr.appendChild(th_url);
    tr.appendChild(th_id);
    thead.appendChild(tr);
    table.appendChild(thead);


    // Fill-in data for the body
    var tbody = document.createElement("tbody");
    campaign_ids.forEach(function(row) {
        var tr = document.createElement("tr");
        var td_url = document.createElement("td");
        var td_id = document.createElement("td");

        td_url.appendChild(document.createTextNode(row.url));
        td_id.appendChild(document.createTextNode(row.campaign_id));

        tr.appendChild(td_url);
        tr.appendChild(td_id);

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    debug(table);

    // Display the table
    const results = document.getElementById("results");
    results.appendChild(table);
}

function run(e) {
    e.preventDefault();

    const queries_content = document.getElementById("queries");
    debug(queries_content.value);
    var lines = queries_content.value.split("\n");

    // Remove whitespace and empty lines.
    lines = lines.map(function(L) {
        return L.trim();
    });
    lines = lines.filter(function(L) {
        return L != "";
    });

    const campaign_ids = generate(lines);
    print_ids(campaign_ids);
}

function main() {
    const generate_btn = document.getElementById("generate-btn");
    generate_btn.addEventListener("click", run);
}

main();
