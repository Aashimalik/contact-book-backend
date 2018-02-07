

function host(req){

    let protocol = req.connection.encrypted?'https':'http',
        baseUrl  = protocol + '://' + req.headers.host + '/';
        return baseUrl ;
}

module.exports = {
    host: host,
};