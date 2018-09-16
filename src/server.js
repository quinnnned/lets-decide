/**
 * WARNING!
 * 
 * None of this file is best practices.  Seriously, don't use it.
 */

const {send, text, json} = require("micro");
const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {

    // CORS Stuff
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const [_, first, ...rest] = req.url.toLowerCase().split("/");
    // Serve Static Assets
    if (first === "") {
        const file = path.join(".","build", "index.html")
        sendStaticFile(res, file); 
        return;
    }

    if (first === "public") {
        const file = path.join(".","build",...rest);
        sendStaticFile(res, file); 
        return;
    }

    if (first === "api") {
        return await handleApiRequest(req, res);
    }

    send(res, 404, "not found, foo");
}

const sendStaticFile = (res, fileName) => {
    const data = fs.readFileSync(fileName);
    res.write(data);
    res.end();
}

const getTreeTraversal = url => 
    url.split("/").slice(2).reduce( 
        (steps, edge) => 
            (!edge || !steps[0].node) 
                ? steps 
                : [{
                    edge, 
                    node: steps[0].node[edge]
                }, ...steps], 
        [{ node: root }]
    );

const getJsonBody = async req => {
    const body = await json(req);
    if (typeof body !== "object" || body === null) {
        throw new Error("Invalid Body")
    }
    return body;
}

// IN-MEMORY PERSISTENCE! ABSOLUTE MADLAD!
const root = {
    people:[
        {id:0, firstName:"Jesse"},
        {id:1, firstName:"Sydney"}
    ]
};

const handleApiRequest = async (req, res) => {
    const steps = getTreeTraversal(req.url);
    const leaf = steps[0].node;
    if (leaf === undefined) return send(res, 404);
    try { switch (req.method) {
        case "OPTIONS" : return "";
        case "GET"     : return leaf; 
        case "PATCH"   : return Object.assign(leaf, await getJsonBody(req));
        case "DELETE"  : return "" + delete steps[1].node[steps[0].edge]
        case "POST"    : return leaf[leaf.length] = {...await getJsonBody(req), id: leaf.length }
    } } catch (error) { return send(res, 400, `${error}`) }
}