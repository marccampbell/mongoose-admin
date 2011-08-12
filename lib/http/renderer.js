var $ = require('jquery'),
    mongoose = require('mongoose');

function Renderer() {

};

Renderer.renderDocument = function(model, fields, options, document, onReady) {
    var documentDiv = $('<div />');
    var form = $('<form />').attr('id', 'document');

    if (document) {
        form.append($('<input />').attr('id', 'document_id').attr('name', 'document_id').attr('type', 'hidden').val(document._id));
    } else {
        form.append($('<input />').attr('id', 'document_id').attr('name', 'document_id').attr('type', 'hidden').val(''));
    }

    for (field in fields) {
        form.append(Renderer.renderDocumentField(field, fields, options, document, false, ''));
    }

    documentDiv.append(form);
    onReady(documentDiv.html());
};

Renderer.renderDocumentField = function(field, fields, options, document, isChild, parentFieldName) {
    var isRequired = fields[field].required;
    var labelClassName = isRequired ? 'required_label' : 'optional_label';

    var span = $('<span />').addClass('document_label');
    if (isChild) {
        span.addClass('inline_element');
    }

    var label = $('<label />').attr('for', field).addClass(labelClassName).html(field);
    if (isChild) {
        label.addClass('inline_element');
    }
    span.append(label);

    var result = $('<p />');
    result.append(span);

    // nested objects
    var fieldValue = '';
    var fieldName = '';
    if (isChild) {
        fieldValue = (document && document[parentFieldName][field]) ? document[parentFieldName][field].toString() : '';
        fieldName = parentFieldName + '[' + field + ']';
    } else {
        fieldValue = (document && document[field]) ? document[field].toString() : '';
        fieldName = field;
    }


    if (fields[field].type === Date) {
        result.append($('<span />').attr('id', fieldName).attr('name', fieldName).addClass('document_date').html(fieldValue.length === 0 ? '<em>Not set</em>' : fieldValue));
    } else if (fields[field].type === String) {
        result.append($('<input />').attr('id', fieldName).attr('name', fieldName).attr('type', 'text').attr('value', fieldValue).addClass('document_input'));
    } else if (fields[field].type === mongoose.Objectid) {
        var childDiv = $('<div />').attr('id', fieldName).attr('name', fieldName).addClass('document_object');
        for (childField in fields[field]) {
            if (childField != '0') {
                childDiv.append(Renderer.renderDocumentField(childField, fields[field], options, document, true, field));
            }
        }
        childDiv.append($('<div />').addClass('clearfix'));
        result.append(childDiv).append($('<div />').addClass('clearfix'));
    } else {
        result.append($('<span />').attr('id', fieldName).attr('name', fieldName).addClass('document_other').html(fieldValue.length === 0 ? '<em>Not set</em>' : fieldValue));
    }

    return result;
};

exports.Renderer = Renderer;
