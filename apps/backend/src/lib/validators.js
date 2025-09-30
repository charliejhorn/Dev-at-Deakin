// simple payload validation helpers
function requireFields(obj, fields) {
    for (const f of fields) if (obj[f] == null) return `${f} is required`;
}

function allowOnly(obj, allowed) {
    const out = {};
    for (const k of Object.keys(obj || {})) {
        if (allowed.includes(k)) out[k] = obj[k];
    }
    return out;
}

function isEnum(value, allowed) {
    return allowed.includes(value);
}

module.exports = { requireFields, allowOnly, isEnum };
