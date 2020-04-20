const removeComments = require('./remove-comments');
const removeModifiers = require('./remove-modifiers');
const validate = require('./validate');
const exclude = require('./exclude');
const deduplicate = require('./deduplicate');
const compress = require('./compress');

/**
 * Enum with all available transformations
 */
const TRANSFORMATIONS = Object.freeze({
    RemoveComments: 'RemoveComments',
    Compress: 'Compress',
    RemoveModifiers: 'RemoveModifiers',
    Validate: 'Validate',
    Deduplicate: 'Deduplicate',
});

/**
 * Applies the specified transformations to the list of rules in the proper order.
 *
 * @param {Array<string>} rules - rules to transform
 * @param {Array<string>} exclusions - a list of the rules (or wildcards) to exclude
 * @param {Array<string>} exclusionsSources - array of exclusion sources
 * @param {Array<string>} transformations - a list of transformations to apply to the rules.
 * @returns {Array<string>} rules after applying all transformations.
 */
async function transform(rules, exclusions, exclusionsSources, transformations) {
    // If none specified -- apply all transformationss
    if (!transformations) {
        // eslint-disable-next-line no-param-reassign
        transformations = [];
    }

    let transformed = await exclude(rules, exclusions, exclusionsSources);
    if (transformations.indexOf(TRANSFORMATIONS.RemoveComments) !== -1) {
        transformed = removeComments(transformed);
    }
    if (transformations.indexOf(TRANSFORMATIONS.Compress) !== -1) {
        transformed = compress(transformed);
    }
    if (transformations.indexOf(TRANSFORMATIONS.RemoveModifiers) !== -1) {
        transformed = removeModifiers(transformed);
    }
    if (transformations.indexOf(TRANSFORMATIONS.Validate) !== -1) {
        transformed = validate(transformed);
    }
    if (transformations.indexOf(TRANSFORMATIONS.Deduplicate) !== -1) {
        transformed = deduplicate(transformed);
    }
    return transformed;
}

module.exports = {
    transform,
    TRANSFORMATIONS,
};
