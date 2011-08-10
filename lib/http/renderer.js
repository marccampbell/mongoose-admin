var $ = require('jquery');

function Renderer() {

};

Renderer.renderDocument = function(model, fields, options, document, onReady) {
    var documentDiv = $('<div />');
    
    for (field in fields) {
        documentDiv.append(Renderer.renderDocumentField(field, fields, options, document));

        var span = $('<span />').addClass('document_label');

        console.log(field);
        for (subfield in fields[field]) {
            console.log(' |- ' + subfield);
        }
    }

    onReady(documentDiv.html());
};

Renderer.renderDocumentField = function(field, fields, options, document) {
    var span = $('<span />').addClass('document_label');
    span.append($('<label />').attr('for', field).addClass('required_label').html(field));

    var val = $('<input />').attr('id', field).attr('type', 'text').addClass('document_input');

    var result = $('<p />');
    result.append(span);
    result.append(val);
    return result;
};

exports.Renderer = Renderer;
