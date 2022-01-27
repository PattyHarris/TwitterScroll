const HOST = 'server.com/';

const goElement = document.getElementsByClassName("go")[0];

goElement.onclick = function() {
    const inputElement = document.getElementsByClassName("test")[0];
    api.get(HOST + "menus", {menu: inputElement.value}, displayText);
}

function displayText(response) {
    const outputElement = document.getElementsByClassName("output")[0];
    outputElement.innerHTML += (response + "<br>");
}

// Server

function getMenus(data) {
    switch (data.menu) {
        case "a":
            return "I got an A";
        case "b":
            return "I got a B";
        default:
            return "I don't know what I got";
    }
}

const endpoints = {
    "/": {
        "get": () => "hello world"
    },
    "/menus": {
        "get": getMenus
    }
}

// API library

function getFunction(url, data, callback) {
    const domain = url.substring(0, url.indexOf("/"));
    const endpoint = url.substring(url.indexOf("/"), url.length);

    /* Domain: server, endpoint: menus
    The following wasn't working since I missed passing
    in (data) so that it calls getMenus(data).  Instead it was
    return the function as an object as a reponse!
    */
    callback(endpoints[endpoint]["get"](data));
}

const api = {
    get: getFunction
};
