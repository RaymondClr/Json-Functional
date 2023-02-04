var JSON2 = (function () {
    var objectProto = Object.prototype;

    var hasOwnProperty = objectProto.hasOwnProperty,
        objectToString = objectProto.toString;

    var jsonEscapes = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' };

    var reEscapedJson = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        reHasEscapedJson = RegExp(reEscapedJson.source);

    function concatJson(head, partial, gap, mind, tail) {
        return gap ? head + '\n' + gap + partial.join(',\n' + gap) + '\n' + mind + tail : head + partial.join(',') + tail;
    }

    function concatJsonKey(string) {
        return reHasEscapedJson.test(string) ? '"' + escapeJsonKey(string) + '"' : '"' + string + '"';
    }

    function concatSpaceIndent(n) {
        var indent = '';

        for (var i = 0; i < n; i++) {
            indent += ' ';
        }
        return indent;
    }

    function each(array, iteratee) {
        var index = -1,
            length = array.length;

        while (++index < length) {
            iteratee(array[index], index, array);
        }
        return array;
    }

    function escapeJsonKey(string) {
        return string.replace(reEscapedJson, function (matched) {
            var escaped = jsonEscapes[matched];
            return isString(escaped) ? escaped : hexEncode(matched);
        });
    }

    function forOwn(object, iteratee) {
        for (var key in object) {
            if (has(object, key)) {
                if (iteratee(object[key], key, object) === false) return;
            }
        }
    }

    function getPrimitiveValue(value) {
        return value instanceof Date ? value.toString() : value.valueOf();
    }

    function has(object, key) {
        return hasOwnProperty.call(object, key);
    }

    function hexEncode(string) {
        return '\\u' + ('0000' + string.charCodeAt(0).toString(16)).slice(-4);
    }

    function isArray(object) {
        return objectToString.call(object) === '[object Array]';
    }

    function isString(value) {
        return typeof value === 'string';
    }

    function parse(string) {
        return string === '' ? {} : Function('return (' + string + ')')();
    }

    function stringify(object, indent) {
        indent = isString(indent) ? indent : concatSpaceIndent(indent);
        return stringifyValue(object, indent, '');
    }

    function stringifyArray(array, indent, gap) {
        var mind = gap;
        gap += indent;

        var partial = [];

        each(array, function (value, index) {
            partial[index] = stringifyValue(value, indent, gap);
        });
        return partial.length === 0 ? '[]' : concatJson('[', partial, gap, mind, ']');
    }

    function stringifyObject(object, indent, gap) {
        var mind = gap;
        gap += indent;

        var colon = gap ? ': ' : ':';

        var partial = [];

        forOwn(object, function (value, key) {
            partial.push(concatJsonKey(key) + colon + stringifyValue(value, indent, gap));
        });
        return partial.length === 0 ? '{}' : concatJson('{', partial, gap, mind, '}');
    }

    function stringifyValue(value, indent, gap) {
        if (value == null) return 'null';
        var primitive = getPrimitiveValue(value);
        var type = typeof primitive;
        if (type === 'string') return concatJsonKey(primitive);
        if (type === 'number') return isFinite(primitive) ? String(primitive) : 'null';
        if (type === 'boolean') return String(primitive);
        return isArray(primitive) ? stringifyArray(primitive, indent, gap) : stringifyObject(primitive, indent, gap);
    }

    return { parse: parse, stringify: stringify };
})();
